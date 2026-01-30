import { ref, computed } from 'vue'
import { useApiClient } from '~/composables/app/useApiClient'
import { useAuth } from '~/composables/app/useAuth'

interface UserInfo {
  userId: string
  name: string
  displayId: string
  avatar: string | null
  account: string
  googleLinked?: boolean
  googleEmail?: string | null
}

const user = ref<UserInfo | null>(null)
const loading = ref(true)

export const useUserInfo = () => {
  const api = useApiClient()
  const auth = useAuth()

  const avatarInitials = computed(() => {
    if (!user.value) return 'RC'
    return user.value.name?.charAt(0)?.toUpperCase() || user.value.displayId?.charAt(0)?.toUpperCase() || 'U'
  })

  const accountLabel = computed(() => {
    if (!user.value) return '管理員'
    return user.value.name || user.value.displayId || '使用者'
  })

  const fetchUserInfo = async () => {
    if (!auth.isAuthenticated.value) {
      loading.value = false
      return
    }

    try {
      const response = await api.get<{ success: boolean, data: UserInfo }>('/auth/me')
      if (response.success && response.data) {
        user.value = response.data
      }
    }
    catch (error) {
      console.error('Failed to fetch user info:', error)
      user.value = null
    }
    finally {
      loading.value = false
    }
  }

  const refreshUserInfo = async () => {
    loading.value = true
    await fetchUserInfo()
  }

  return {
    user,
    loading,
    avatarInitials,
    accountLabel,
    fetchUserInfo,
    refreshUserInfo,
  }
}
