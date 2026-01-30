/**
 * RBAC 權限系統 - 常數定義
 *
 * 這個檔案只包含權限和角色的定義（常數）
 * 不包含任何邏輯或類別
 *
 * 功能類別請見：~/utils/rbacChecker.ts
 */

/**
 * 系統所有權限的定義
 * 命名規則：資源:操作 (例如 servers:view)
 */
export enum Permission {
  // ============ Page Access Names ============
  ACCESS_DASHBOARD = 'access:dashboard',
  ACCESS_USERS = 'access:users',
  ACCESS_ADMIN_ACCOUNTS = 'access:admin_accounts',
  ACCESS_LOGS = 'access:logs',
  ACCESS_ROLE_PERMISSIONS = 'access:role_permissions',

  // ============ User Management ============
  VIEW_USERS = 'users:view',
  CREATE_USERS = 'users:create',
  EDIT_USERS = 'users:edit',
  DELETE_USERS = 'users:delete',
  BAN_USERS = 'users:ban',

  // ============ System Management ============
  MANAGE_ADMIN_ACCOUNTS = 'system:manage_admins',
  MANAGE_PERMISSIONS = 'system:manage_permissions',
  VIEW_LOGS = 'system:view_logs',
}

/**
 * 角色定義
 */
export type Role = 'none' | 'support' | 'entertainment' | 'admin' | 'super_admin'

/**
 * 角色顯示名稱對照表
 */
export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  none: '無權限',
  support: '客服',
  entertainment: '娛樂',
  admin: '管理員',
  super_admin: '超級管理員',
}

/**
 * ⚠️ 注意：角色權限映射已移至資料庫
 *
 * 使用方式：
 * - 後端：使用 DynamicRbacService.getRolePermissions(role)
 * - 前端：使用 usePermission() composable（內部會調用 API）
 *
 * 這樣可以：
 * 1. 動態調整權限而無需重新部署
 * 2. 減少硬編碼維護負擔
 * 3. 支援更靈活的權限管理
 *
 * 權限配置請至資料庫表：
 * - admin_roles：角色定義
 * - admin_permissions：權限定義
 * - admin_role_permissions：角色-權限映射
 */
