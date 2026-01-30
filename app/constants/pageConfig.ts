/**
 * Page Configuration
 * Shared page labels and icons used across sidebar menu and page titles
 */

export interface PageConfig {
  label: string
  icon: string
}

export const PAGE_CONFIG: Record<string, PageConfig> = {
  '/': {
    label: '首頁',
    icon: 'heroicons:chart-bar',
  },
  '/users': {
    label: '使用者管理',
    icon: 'heroicons:users',
  },
  '/channels': {
    label: '頻道管理',
    icon: 'heroicons:chat-bubble-left-ellipsis',
  },
  '/servers': {
    label: '伺服器管理',
    icon: 'heroicons:server',
  },
  '/badges': {
    label: '徽章管理',
    icon: 'heroicons:star',
  },
  '/user-badges': {
    label: '使用者徽章',
    icon: 'heroicons:gift',
  },
  '/global-permissions': {
    label: '全域權限',
    icon: 'heroicons:shield-check',
  },
  '/recommend-servers': {
    label: '推薦伺服器',
    icon: 'heroicons:heart',
  },
  '/announcements': {
    label: '公告',
    icon: 'heroicons:megaphone',
  },
  '/account-activation': {
    label: '帳號啟用',
    icon: 'heroicons:key',
  },
  '/logs': {
    label: '日誌檢視器',
    icon: 'heroicons:document-text',
  },
  '/admin-accounts': {
    label: '管理者帳號',
    icon: 'heroicons:lock-closed',
  },
  '/custom-permissions': {
    label: '自訂權限',
    icon: 'heroicons:adjustments-horizontal',
  },
  '/role-permissions': {
    label: '角色權限',
    icon: 'heroicons:user-group',
  },
  '/account-security': {
    label: '帳號安全',
    icon: 'heroicons:shield-check',
  },
}

/**
 * Get page label by path
 */
export const getPageLabel = (path: string): string => {
  return PAGE_CONFIG[path]?.label || 'Admin Panel'
}

/**
 * Get all page paths (for menu iteration)
 */
export const PAGE_PATHS = Object.keys(PAGE_CONFIG) as Array<keyof typeof PAGE_CONFIG>
