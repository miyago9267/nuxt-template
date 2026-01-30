/**
 * 角色配置
 *
 * 定義所有角色的顯示資訊和屬性
 */

import type { Role } from './rbacPermissions'

/**
 * 角色顯示資訊
 */
export interface RoleInfo {
  value: Role
  label: string
  description: string
  colorClass: string
  level: number // 用於排序和比較，數字越大權限越高
}

/**
 * 角色完整配置
 */
export const ROLE_CONFIG: Record<Role, RoleInfo> = {
  none: {
    value: 'none',
    label: '無權限',
    description: '帳號未啟用，無法登入後台系統',
    colorClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    level: 0,
  },
  support: {
    value: 'support',
    label: '客服',
    description: '負責內容管理（徽章、公告、推薦伺服器等）',
    colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    level: 1,
  },
  entertainment: {
    value: 'entertainment',
    label: '娛樂',
    description: '內容審核（封禁使用者、封鎖伺服器、設定特殊ID）',
    colorClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    level: 2,
  },
  admin: {
    value: 'admin',
    label: '管理員',
    description: '可執行大部分管理操作（使用者、頻道、伺服器、全域權限）',
    colorClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    level: 3,
  },
  super_admin: {
    value: 'super_admin',
    label: '超級管理員',
    description: '系統最高權限（管理員帳號、系統設定、所有功能）',
    colorClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    level: 4,
  },
}

/**
 * 獲取角色選項列表（用於下拉選單）
 */
export function getRoleOptions(): RoleInfo[] {
  return Object.values(ROLE_CONFIG)
    .filter(role => role.value !== 'none') // 過濾掉 none
    .sort((a, b) => a.level - b.level)
}

/**
 * 獲取角色標籤
 */
export function getRoleLabel(role: Role): string {
  return ROLE_CONFIG[role]?.label || role
}

/**
 * 獲取角色描述
 */
export function getRoleDescription(role: Role): string {
  return ROLE_CONFIG[role]?.description || ''
}

/**
 * 獲取角色顏色類名
 */
export function getRoleColorClass(role: Role): string {
  return ROLE_CONFIG[role]?.colorClass || 'bg-gray-100 text-gray-800'
}

/**
 * 獲取角色等級
 */
export function getRoleLevel(role: Role): number {
  return ROLE_CONFIG[role]?.level || 0
}

/**
 * 比較兩個角色的等級
 * @returns 如果 role1 >= role2 返回 true
 */
export function isRoleHigherOrEqual(role1: Role, role2: Role): boolean {
  return getRoleLevel(role1) >= getRoleLevel(role2)
}

/**
 * 獲取所有可選擇的角色（排除none）
 */
export function getSelectableRoles(): Role[] {
  return Object.keys(ROLE_CONFIG).filter(r => r !== 'none') as Role[]
}
