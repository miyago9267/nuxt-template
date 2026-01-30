import { computed, ref, watch } from 'vue'
import { useAuth } from './useAuth'
import { useApiClient } from './useApiClient'
import { Permission, type Role } from '~/constants/rbacPermissions'

/**
 * 全局權限緩存
 */
const permissionsCache = ref<Set<string>>(new Set())
const permissionsLoaded = ref(false)
const permissionsLoading = ref(false)

/**
 * 清除權限快取
 */
export function clearPermissionsCache() {
  permissionsCache.value = new Set()
  permissionsLoaded.value = false
  permissionsLoading.value = false
}

/**
 * RBAC 權限管理 Composable
 *
 * 新的權限系統，支援細粒度的權限控制
 *
 * @example
 * ```vue
 * <script setup>
 * import { Permission } from '~/constants/rbacPermissions'
 *
 * const { can, canAny } = usePermission()
 *
 * const canBlockServer = can(Permission.BLOCK_SERVERS)
 * const canManageServer = canAny([
 *   Permission.EDIT_SERVERS,
 *   Permission.BLOCK_SERVERS,
 * ])
 * </script>
 *
 * <template>
 *   <button v-if="canBlockServer" @click="handleBlock">
 *     封鎖伺服器
 *   </button>
 * </template>
 * ```
 */
export function usePermission() {
  const { role } = useAuth()
  const api = useApiClient()

  /**
   * 當前使用者的角色
   */
  const userRole = computed<Role>(() => {
    return role.value || 'none'
  })

  // 監聽角色變化，自動重新載入權限
  watch(userRole, (newRole, oldRole) => {
    if (newRole !== oldRole) {
      console.log('[usePermission] Role changed from', oldRole, 'to', newRole, '- reloading permissions')
      clearPermissionsCache()
      if (newRole !== 'none') {
        loadPermissions()
      }
    }
  })

  /**
   * 從 API 載入權限
   */
  const loadPermissions = async () => {
    if (permissionsLoading.value || permissionsLoaded.value) {
      return
    }

    if (userRole.value === 'none') {
      permissionsCache.value = new Set()
      permissionsLoaded.value = true
      return
    }

    try {
      permissionsLoading.value = true
      const response = await api.get<{ success: boolean, data: { role: string, permissions: string[] } }>('/rbac/my-permissions')

      console.log('[usePermission] Loaded permissions:', response.data)

      if (response.success && response.data.permissions) {
        permissionsCache.value = new Set(response.data.permissions)
        permissionsLoaded.value = true
      }
    }
    catch (error) {
      console.error('[usePermission] Failed to load permissions:', error)
      // 載入失敗時，保持空權限集
      permissionsCache.value = new Set()
    }
    finally {
      permissionsLoading.value = false
    }
  }

  /**
   * 檢查是否擁有特定權限
   * @param permission 權限枚舉
   * @returns Computed<boolean>
   */
  const can = (permission: Permission) => {
    return computed(() => {
      // 未登入用戶沒有任何權限
      if (userRole.value === 'none') {
        return false
      }

      // 權限尚未載入時，暫時返回 false
      // 這會導致 sidebar 初始為空，但很快就會載入
      if (!permissionsLoaded.value) {
        return false
      }

      // 檢查權限集中是否包含此權限
      return permissionsCache.value.has(permission)
    })
  }

  /**
   * 檢查是否擁有任一權限（OR 邏輯）
   * @param permissions 權限陣列
   * @returns Computed<boolean>
   */
  const canAny = (permissions: Permission[]) => {
    return computed(() => {
      if (userRole.value === 'none' || !permissionsLoaded.value) {
        return false
      }

      return permissions.some(p => permissionsCache.value.has(p))
    })
  }

  /**
   * 檢查是否擁有所有權限（AND 邏輯）
   * @param permissions 權限陣列
   * @returns Computed<boolean>
   */
  const canAll = (permissions: Permission[]) => {
    return computed(() => {
      if (userRole.value === 'none' || !permissionsLoaded.value) {
        return false
      }

      return permissions.every(p => permissionsCache.value.has(p))
    })
  }

  /**
   * 取得所有權限列表
   */
  const permissions = computed(() => {
    return Array.from(permissionsCache.value) as Permission[]
  })

  /**
   * 快捷方法：常用權限檢查
   */
  const shortcuts = {
    // User Related
    canViewUsers: can(Permission.VIEW_USERS),
    canCreateUsers: can(Permission.CREATE_USERS),
    canEditUsers: can(Permission.EDIT_USERS),
    canDeleteUsers: can(Permission.DELETE_USERS),
    canBanUsers: can(Permission.BAN_USERS),

    // System Related
    canManageAdmins: can(Permission.MANAGE_ADMIN_ACCOUNTS),
    canManagePermissions: can(Permission.MANAGE_PERMISSIONS),
  }

  return {
    // 基礎權限檢查
    can,
    canAny,
    canAll,

    // 狀態
    userRole,
    permissions,
    permissionsLoaded: computed(() => permissionsLoaded.value),

    // 方法
    loadPermissions,

    // 快捷方法
    ...shortcuts,
  }
}
