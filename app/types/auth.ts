import type { Role } from '~/constants/rbacPermissions'

export interface AuthStatusState {
  loading: boolean
  error: string | null
  lastCheckedAt: number
  authenticated: boolean
  expiresAt: number | null
  role: Role
}

export interface LoginPayload {
  account: string
  password: string
  totp?: string
}

export interface RegisterPayload extends LoginPayload {
  username: string
}

export interface FetchErrorLike {
  statusCode?: number
  statusMessage?: string
  data?: {
    message?: string
    location?: string
    reason?: string
    data?: Record<string, unknown>
    [key: string]: unknown
  }
}
