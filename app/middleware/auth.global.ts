import { useAuth } from '~/composables/app/useAuth'
import { usePermission } from '~/composables/app/usePermission'
import { Permission } from '~/constants/rbacPermissions'

const PUBLIC_PATHS = new Set(['/login', '/auth/google-bind'])

// 頁面路徑對應的權限要求
const PAGE_PERMISSIONS: Record<string, Permission> = {
  '/': Permission.ACCESS_DASHBOARD,
  '/users': Permission.ACCESS_USERS,
  '/servers': Permission.ACCESS_SERVERS,
  '/channels': Permission.ACCESS_CHANNELS,
  '/badges': Permission.ACCESS_BADGES,
  '/user-badges': Permission.ACCESS_USER_BADGES,
  '/recommend-servers': Permission.ACCESS_RECOMMEND_SERVERS,
  '/announcements': Permission.ACCESS_ANNOUNCEMENTS,
  '/global-permissions': Permission.ACCESS_GLOBAL_PERMISSIONS,
  '/account-activation': Permission.ACCESS_ACCOUNT_ACTIVATION,
  '/account-security': Permission.ACCESS_ACCOUNT_SECURITY,
  '/admin-accounts': Permission.ACCESS_ADMIN_ACCOUNTS,
  '/logs': Permission.ACCESS_LOGS,
  '/custom-permissions': Permission.ACCESS_CUSTOM_PERMISSIONS,
  '/role-permissions': Permission.ACCESS_ROLE_PERMISSIONS,
}

// 無需權限即可訪問的已登入頁面（例如個人設定）
const NO_PERMISSION_REQUIRED = new Set(['/account-security'])

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  if (import.meta.server) {
    return
  }

  // Public paths: redirect to home if already authenticated
  if (PUBLIC_PATHS.has(to.path)) {
    if (auth.isAuthenticated.value) {
      return navigateTo('/', { replace: true })
    }
    return
  }

  // Protected paths: verify session (secondary check after initial app.vue verification)
  const isValid = await auth.verify()
  if (!isValid) {
    return navigateTo('/login', { replace: true })
  }

  // 檢查頁面級別權限
  const requiredPermission = PAGE_PERMISSIONS[to.path]

  // 如果該頁面需要權限檢查
  if (requiredPermission && !NO_PERMISSION_REQUIRED.has(to.path)) {
    const { can, loadPermissions, permissionsLoaded } = usePermission()

    // 確保權限已載入
    if (!permissionsLoaded.value) {
      await loadPermissions()
    }

    // 檢查用戶是否有權限
    if (!can(requiredPermission).value) {
      // 找到用戶有權限的第一個頁面
      const firstAvailablePage = Object.entries(PAGE_PERMISSIONS).find(([path, permission]) => {
        return can(permission).value && !NO_PERMISSION_REQUIRED.has(path)
      })

      if (firstAvailablePage) {
        // 重定向到第一個有權限的頁面
        return navigateTo(firstAvailablePage[0], { replace: true })
      }
      else {
        // 如果用戶沒有任何頁面權限，重定向到帳號安全頁面
        return navigateTo('/account-security', { replace: true })
      }
    }
  }
})
