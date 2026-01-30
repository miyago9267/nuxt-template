import { getApiClient } from '~/apis/client'
import type { WebSocketClient, WebSocketCallbacks, WebSocketClientOptions } from '~/apis/websocket'

let apiInstance: ReturnType<typeof getApiClient> | null = null

export function useApiClient() {
  if (!apiInstance) {
    apiInstance = getApiClient({
      getAuthToken: () => {
        return null
      },
      onUnauthorized: async () => {
        // Lazy import to avoid circular dependency
        const { useAuth } = await import('~/composables/app/useAuth')
        const auth = useAuth()

        await auth.logout()
        await navigateTo('/login', { replace: true })
      },
    })
  }

  return apiInstance
}

/**
 * Create a WebSocket client using the API client
 */
export function useWebSocket(
  url: string,
  options?: Partial<Omit<WebSocketClientOptions, 'url'>>,
  callbacks?: WebSocketCallbacks,
): WebSocketClient {
  const api = useApiClient()
  return api.createWebSocket(url, options, callbacks)
}
