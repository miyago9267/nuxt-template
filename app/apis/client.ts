import { WebSocketClient, type WebSocketCallbacks, type WebSocketClientOptions } from './websocket'

export interface ApiClientOptions {
  baseUrl?: string
  fetchImpl?: typeof fetch
  logger?: typeof console
  getAuthToken?: () => string | null
  onUnauthorized?: () => Promise<void>
}

export class ApiClient {
  private baseUrl: string
  private logger: typeof console
  private getAuthToken?: () => string | null
  private onUnauthorized?: () => Promise<void>

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || '/api'
    this.logger = options.logger || console
    this.getAuthToken = options.getAuthToken
    this.onUnauthorized = options.onUnauthorized
    this.baseUrl = this.baseUrl.replace(/\/$/, '')
    this.logger.info('[ApiClient] Initialized with baseUrl:', this.baseUrl)
  }

  private getFullUrl(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${this.baseUrl}${normalizedEndpoint}`
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.getFullUrl(endpoint)
    this.logger.info('[ApiClient] Request:', url, options)

    const headers: Record<string, string> = {
      'Accept-Charset': 'utf-8',
      ...options.headers as Record<string, string>,
    }

    const hasFormDataBody = typeof FormData !== 'undefined'
      && options.body instanceof FormData

    if (!hasFormDataBody && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    // auto add JWT token
    const token = this.getAuthToken?.()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const defaultOptions: RequestInit = {
      method: 'GET',
      headers,
      credentials: 'include', // Enable httpOnly cookie to be sent
      ...options,
    }

    const response = await fetch(url, defaultOptions)

    // Handle 401 Unauthorized - session expired or invalid
    if (response.status === 401) {
      this.logger.warn('[ApiClient] Received 401 Unauthorized, clearing session')
      if (this.onUnauthorized) {
        try {
          await this.onUnauthorized()
        }
        catch (error) {
          this.logger.error('[ApiClient] Failed to handle 401:', error)
        }
      }
      throw new Error('Authentication required - redirecting to login')
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      let errorData: unknown

      try {
        errorData = await response.json()
        if (errorData && typeof errorData === 'object' && 'message' in errorData) {
          errorMessage = (errorData as { message?: string }).message || errorMessage
        }
      }
      catch {
        errorData = undefined
      }

      const error = new Error(errorMessage) as Error & {
        statusCode: number
        statusMessage: string
        data?: unknown
      }

      error.statusCode = response.status
      error.statusMessage = response.statusText

      if (errorData !== undefined) {
        error.data = errorData
      }

      throw error
    }

    // Handle JSON response with proper UTF-8 encoding
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      // Get response as text first to ensure UTF-8 decoding
      const text = await response.text()
      this.logger.debug('[ApiClient] Raw response text:', text)

      try {
        // Parse JSON with UTF-8 support
        const parsed = JSON.parse(text)
        this.logger.debug('[ApiClient] Parsed JSON:', parsed)
        return parsed
      }
      catch (parseError) {
        this.logger.error('[ApiClient] Failed to parse JSON response:', parseError)
        throw new Error('Invalid JSON response')
      }
    }

    return response.json()
  }

  get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    let url = endpoint
    if (params) {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      if (query) url += `?${query}`
    }
    return this.request<T>(url)
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  // Health check
  async health(): Promise<unknown> {
    return this.get('/health')
  }

  /**
   * Create a WebSocket client
   * @param url - WebSocket URL (can be relative or absolute)
   * @param options - WebSocket options
   * @param callbacks - WebSocket callbacks
   */
  createWebSocket(
    url: string,
    options?: Partial<Omit<WebSocketClientOptions, 'url'>>,
    callbacks?: WebSocketCallbacks,
  ): WebSocketClient {
    // If URL is relative, convert http baseUrl to ws
    let wsUrl = url
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      // Convert relative URL to WebSocket URL
      const baseWsUrl = this.baseUrl.replace(/^http/, 'ws')
      wsUrl = url.startsWith('/') ? `${baseWsUrl}${url}` : `${baseWsUrl}/${url}`
    }

    return new WebSocketClient(
      {
        url: wsUrl,
        ...options,
      },
      callbacks,
    )
  }
}

// Singleton instance
let apiClientInstance: ApiClient | null = null
export const getApiClient = (options?: ApiClientOptions): ApiClient => {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient(options)
  }
  return apiClientInstance
}