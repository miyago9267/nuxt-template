import { ref, watch } from 'vue'

const isDark = ref(false)
let initialized = false

const syncDocumentClass = () => {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.classList.toggle('dark', isDark.value)
}

const persistPreference = () => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem('darkMode', String(isDark.value))
}

export function useDarkMode() {
  const applyPreference = (value: boolean) => {
    isDark.value = value
    syncDocumentClass()
    persistPreference()
  }

  const toggleDarkMode = () => {
    applyPreference(!isDark.value)
  }

  const initDarkMode = () => {
    if (initialized || typeof window === 'undefined') {
      return
    }
    initialized = true

    const saved = window.localStorage.getItem('darkMode')
    const nextValue = saved !== null
      ? saved === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches

    applyPreference(nextValue)

    // Watch for changes and sync to document
    watch(isDark, () => {
      syncDocumentClass()
    })
  }

  return {
    isDark,
    toggleDarkMode,
    initDarkMode,
  }
}
