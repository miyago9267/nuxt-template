import { ref, watch, onBeforeUnmount } from 'vue'

interface DebounceSearchOptions {
  delay?: number
  initialPage?: number
  initialLimit?: number
}

export const useDebounceSearch = <T>(
  fetchFn: (page: number, limit: number, query: string) => Promise<T>,
  options: DebounceSearchOptions = {},
) => {
  const delay = options.delay ?? 300
  const searchQuery = ref('')
  const currentPage = ref(options.initialPage ?? 1)
  const currentLimit = ref(options.initialLimit ?? 50)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimer = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  watch(() => searchQuery.value, (value) => {
    clearTimer()
    debounceTimer = setTimeout(() => {
      currentPage.value = 1
      fetchFn(1, currentLimit.value, value.trim())
      debounceTimer = null
    }, delay)
  })

  const handlePageChange = (page: number) => {
    currentPage.value = page
    fetchFn(page, currentLimit.value, searchQuery.value.trim())
  }

  const handleLimitChange = (limit: number) => {
    currentLimit.value = limit
    currentPage.value = 1
    fetchFn(1, limit, searchQuery.value.trim())
  }

  const refresh = () => {
    fetchFn(currentPage.value, currentLimit.value, searchQuery.value.trim())
  }

  onBeforeUnmount(() => {
    clearTimer()
  })

  return {
    searchQuery,
    currentPage,
    currentLimit,
    handlePageChange,
    handleLimitChange,
    refresh,
  }
}

export type UseDebounceSearchReturn = ReturnType<typeof useDebounceSearch>
