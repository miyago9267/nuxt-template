export interface ApiClientOptions {
  baseUrl?: string
  fetchImpl?: typeof fetch
  logger?: typeof console
}

export class ApiClient {
  private baseUrl: string
  private logger: typeof console

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || '/api/v1'
    this.logger = options.logger || console
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

    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    }

    // 直接用全域 fetch，避免非法綁定
    const response = await fetch(url, defaultOptions)
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      }
      catch {
        // Ignore JSON parse errors and use the default errorMessage
      }
      throw new Error(errorMessage)
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

  // Health check
  async health(): Promise<unknown> {
    return this.get('/health')
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