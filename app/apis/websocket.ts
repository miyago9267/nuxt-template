/**
 * WebSocket Client Utility
 * Manages WebSocket connections with auto-reconnect and heartbeat features
 */

export interface WebSocketClientOptions {
  /** WebSocket URL */
  url: string
  /** Connection parameters */
  params?: Record<string, string>
  /** Maximum reconnect attempts */
  maxReconnectAttempts?: number
  /** Reconnect delay in milliseconds */
  reconnectDelay?: number
  /** Heartbeat interval in milliseconds */
  heartbeatInterval?: number
  /** Enable auto-reconnect */
  autoReconnect?: boolean
  /** Enable debug logging */
  debug?: boolean
}

export interface WebSocketCallbacks {
  onOpen?: () => void
  onMessage?: (data: string) => void
  onError?: (error: Event) => void
  onClose?: () => void
  onReconnect?: (attempt: number) => void
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private options: Required<WebSocketClientOptions>
  private callbacks: WebSocketCallbacks
  private reconnectAttempts = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private isManualClose = false

  constructor(options: WebSocketClientOptions, callbacks: WebSocketCallbacks = {}) {
    this.options = {
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
      heartbeatInterval: 30000,
      autoReconnect: true,
      debug: false,
      params: {},
      ...options,
    }
    this.callbacks = callbacks
  }

  /**
   * Connect to WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('WebSocket already connected')
      return
    }

    this.isManualClose = false

    // Build URL with query parameters
    let url = this.options.url
    if (this.options.params && Object.keys(this.options.params).length > 0) {
      const params = new URLSearchParams(this.options.params)
      url += `?${params.toString()}`
    }

    this.log('Connecting to:', url)

    try {
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.log('WebSocket connected')
        this.startHeartbeat()
        this.callbacks.onOpen?.()
      }

      this.ws.onmessage = (event) => {
        this.log('Received message:', event.data)
        this.callbacks.onMessage?.(event.data)
      }

      this.ws.onerror = (error) => {
        this.log('WebSocket error:', error)
        this.callbacks.onError?.(error)
      }

      this.ws.onclose = () => {
        this.log('WebSocket closed')
        this.stopHeartbeat()
        this.callbacks.onClose?.()

        // Auto-reconnect
        if (this.options.autoReconnect && !this.isManualClose) {
          this.attemptReconnect()
        }
      }
    }
    catch (error) {
      this.log('Failed to create WebSocket:', error)
      if (this.options.autoReconnect) {
        this.attemptReconnect()
      }
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      this.log(`Max reconnect attempts (${this.options.maxReconnectAttempts}) reached`)
      return
    }

    this.reconnectAttempts++
    const delay = this.options.reconnectDelay * this.reconnectAttempts

    this.log(`Reconnecting in ${delay}ms... (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`)

    this.callbacks.onReconnect?.(this.reconnectAttempts)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  /**
   * Send message
   */
  send(data: string | object): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.log('WebSocket not connected, cannot send message')
      return false
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      this.ws.send(message)
      this.log('Sent message:', message)
      return true
    }
    catch (error) {
      this.log('Failed to send message:', error)
      return false
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    this.isManualClose = true
    this.stopHeartbeat()
    this.clearReconnectTimer()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.log('WebSocket manually disconnected')
  }

  /**
   * Start heartbeat
   */
  private startHeartbeat(): void {
    if (this.options.heartbeatInterval <= 0) return

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' })
      }
    }, this.options.heartbeatInterval)
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * Clear reconnect timer
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  /**
   * Get connection state
   */
  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  /**
   * Check if connected
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * Update connection parameters
   */
  updateParams(params: Record<string, string>): void {
    this.options.params = params
    if (this.isConnected) {
      this.disconnect()
      this.connect()
    }
  }

  /**
   * Log message
   */
  private log(...args: unknown[]): void {
    if (this.options.debug) {
      console.log('[WebSocketClient]', ...args)
    }
  }
}

/**
 * Create log service WebSocket client
 */
export function createLogServiceWebSocket(
  serviceName: string,
  logFile: string,
  searchKeyword?: string,
  callbacks?: WebSocketCallbacks,
): WebSocketClient {
  const config = useRuntimeConfig()
  const wsUrl = config.public.logServiceUrl.replace(/^http/, 'ws')

  const params: Record<string, string> = { file: logFile }
  if (searchKeyword) {
    params.search = searchKeyword
  }

  return new WebSocketClient(
    {
      url: `${wsUrl}/ws/logs/${serviceName}`,
      params,
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
      autoReconnect: true,
      debug: true,
    },
    callbacks,
  )
}
