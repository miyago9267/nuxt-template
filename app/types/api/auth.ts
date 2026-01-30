export interface ApiResponse<T> {
  data: T
  message: string
}

export interface LoginResponseData {
  token: string
  userId: string
  expiresAt: number
}

export interface RegisterResponseData {
  account: string
}

export interface VerifyResponseData {
  valid: boolean
  expiresAt?: number
  userId?: string

}

export interface LogoutResponseData {
  success: boolean
}
