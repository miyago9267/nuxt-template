import type { ApiResponse } from './auth'

export interface AccountSecurityStatusDto {
  account: string
  totpEnabled: boolean
  hasSecret: boolean
  pendingActivation: boolean
  lastUpdatedAt: number | null
}

export interface TotpProvisioningDto {
  secret: string
  otpauthUrl: string
  qrCodeDataUrl: string
  issuer: string
  label: string
  algorithm: string
  digits: number
  period: number
}

export type AccountSecurityStatusResponse = ApiResponse<AccountSecurityStatusDto>

export type AccountSecurityInitiateResponse = ApiResponse<{
  provisioning: TotpProvisioningDto
  status: AccountSecurityStatusDto
}>

export type AccountSecurityToggleResponse = ApiResponse<AccountSecurityStatusDto>
