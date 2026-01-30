const TITLE_SUFFIX = ' - Rice Call Admin Panel'

interface PageMetaConfig {
  title: string
  description: string
}

const pageMetaMap: Record<string, PageMetaConfig> = {
  '/': {
    title: '儀表板',
    description: 'Rice Call 管理後台儀表板',
  },
  '/login': {
    title: '登入',
    description: 'Rice Call 管理後台登入頁面',
  },
  '/user': {
    title: '使用者管理',
    description: 'Rice Call 管理後台使用者管理',
  },
  '/servers': {
    title: '伺服器管理',
    description: 'Rice Call 管理後台伺服器管理',
  },
  '/channels': {
    title: '頻道管理',
    description: 'Rice Call 管理後台頻道管理',
  },
  '/badges': {
    title: '徽章管理',
    description: 'Rice Call 管理後台徽章管理',
  },
  '/user-badges': {
    title: '使用者徽章',
    description: 'Rice Call 管理後台使用者徽章管理',
  },
  '/recommend-servers': {
    title: '推薦伺服器',
    description: 'Rice Call 管理後台推薦伺服器管理',
  },
  '/account-activation': {
    title: '帳號啟用',
    description: 'Rice Call 管理後台帳號啟用管理',
  },
  '/account-security': {
    title: '帳號安全',
    description: 'Rice Call 管理後台帳號安全與 2FA 設定',
  },
  '/global-permissions': {
    title: '全域權限',
    description: 'Rice Call 管理後台全域權限管理',
  },
  '/logs': {
    title: '日誌檢視器',
    description: 'Rice Call 管理後台日誌檢視器',
  },
  '/test-error': {
    title: '錯誤頁面測試',
    description: 'Rice Call 管理後台錯誤頁面測試',
  },
  '/announcements': {
    title: '公告管理',
    description: 'Rice Call 管理後台公告管理',
  },
  '/admin-accounts': {
    title: '管理員設定',
    description: 'Rice Call 管理後台管理員設定',
  },
}

/**
 * 使用頁面 Meta 資訊
 * @param route - 路由路徑
 */
export const usePageMeta = (route?: string) => {
  const routePath = route || useRoute().path
  const meta = pageMetaMap[routePath]

  if (!meta) {
    console.warn(`未找到路徑 ${routePath} 的 meta 配置`)
    return
  }

  useHead({
    title: meta.title + TITLE_SUFFIX,
    meta: [
      { name: 'description', content: meta.description },
    ],
  })

  return meta
}
