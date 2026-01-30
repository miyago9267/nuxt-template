import { computed } from 'vue'
import type {
  ApiResponse,
  LoginResponseData,
  LogoutResponseData,
  RegisterResponseData,
} from '~/types/api/auth'
import type { AuthStatusState, FetchErrorLike, LoginPayload, RegisterPayload } from '~/types/auth'
import type { Role } from '~/constants/rbacPermissions'
import { useApiClient } from '~/composables/app/useApiClient'
import { clearPermissionsCache } from '~/composables/app/usePermission'

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

const resolveErrorMessage = (error: unknown, fallback: string) => {
  const fetchError = error as FetchErrorLike | undefined

  if (fetchError?.data?.message) return fetchError.data.message
  if (fetchError?.statusMessage) return fetchError.statusMessage
  if (error instanceof Error && error.message) return error.message

  return fallback
}

const isPermissionDeniedError = (error: unknown): error is FetchErrorLike => {
  const fetchError = error as FetchErrorLike | undefined
  return fetchError?.statusCode === 403
}

export const useAuth = () => {
  // Using httpOnly cookies for security - no client-side token management

  const status = useState<AuthStatusState>('auth-status', () => ({
    loading: false,
    error: null,
    lastCheckedAt: 0,
    authenticated: false,
    expiresAt: null,
    role: 'none',
  }))

  const api = useApiClient()

  const isAuthenticated = computed(() => status.value.authenticated)
  const loading = computed(() => status.value.loading)
  const error = computed(() => status.value.error)
  const expiresAt = computed(() => status.value.expiresAt)
  const role = computed(() => status.value.role)

  const setLoading = (value: boolean) => {
    status.value.loading = value
  }

  const setError = (message: string | null) => {
    status.value.error = message
  }

  const login = async (payload: LoginPayload) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login', payload)

      // Token is set as httpOnly cookie by server, just update auth status
      status.value.authenticated = true
      status.value.expiresAt = response.data.expiresAt || Date.now() + TOKEN_TTL_MS
      status.value.lastCheckedAt = Date.now()
      return response
    }
    catch (error: unknown) {
      if (isPermissionDeniedError(error)) {
        const fetchError = error as FetchErrorLike
        const redirectLocation = fetchError.data?.location
        const message = fetchError.data?.message || fetchError.statusMessage || 'Permission denied'

        setError(message)

        if (redirectLocation && import.meta.client) {
          setTimeout(() => {
            window.location.replace(redirectLocation)
          }, 1500)
        }

        throw error
      }

      const message = resolveErrorMessage(error, '登入失敗')
      setError(message)
      throw error
    }
    finally {
      setLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post<ApiResponse<RegisterResponseData>>('/auth/register', payload)
      return response
    }
    catch (error: unknown) {
      const message = resolveErrorMessage(error, '註冊失敗')
      setError(message)
      throw error
    }
    finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    // Call logout API to clear httpOnly cookie
    try {
      await api.post<ApiResponse<LogoutResponseData>>('/auth/logout')
    }
    catch {
      // Ignore errors, just clear local state
    }

    status.value.authenticated = false
    status.value.expiresAt = null
    status.value.role = 'none'
    status.value.lastCheckedAt = Date.now()

    // 清除權限快取
    clearPermissionsCache()
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<{ expiresAt: number }>>('/auth/refresh')

      status.value.authenticated = true
      status.value.expiresAt = response.data.expiresAt
      status.value.lastCheckedAt = Date.now()
      return true
    }
    catch {
      await logout()
      return false
    }
  }

  const verify = async (): Promise<boolean> => {
    try {
      const response = await api.post<ApiResponse<{ valid: boolean, needsRefresh: boolean, role?: string }>>('/auth/verify')
      console.log('[useAuth] verify() response:', response)

      status.value.lastCheckedAt = Date.now()

      if (response.data.needsRefresh) {
        console.log('[useAuth] needsRefresh is true, calling refreshToken()')
        return await refreshToken()
      }

      status.value.authenticated = response.data.valid
      status.value.role = (response.data.role || 'none') as Role
      console.log('[useAuth] verify() result:', response.data.valid, 'role:', response.data.role)
      return response.data.valid
    }
    catch (error) {
      console.error('[useAuth] verify() failed:', error)
      status.value.authenticated = false
      status.value.role = 'none'
      setError('登入狀態已失效，請重新登入')
      return false
    }
  }

  return {
    isAuthenticated,
    loading,
    error,
    expiresAt,
    role,
    lastCheckedAt: computed(() => status.value.lastCheckedAt),
    login,
    register,
    verify,
    logout,
    refreshToken,
    clearError: () => setError(null),
  }
}
