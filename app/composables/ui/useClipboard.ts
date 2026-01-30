import { ref, onBeforeUnmount } from 'vue'

interface ClipboardOptions {
  resetAfter?: number
}

export const useClipboard = (options: ClipboardOptions = {}) => {
  const copiedText = ref<string | null>(null)
  const copyError = ref<Error | null>(null)
  let resetTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimer = () => {
    if (resetTimer) {
      clearTimeout(resetTimer)
      resetTimer = null
    }
  }

  const scheduleReset = () => {
    clearTimer()
    const delay = options.resetAfter ?? 2000
    if (delay <= 0) return
    resetTimer = setTimeout(() => {
      copiedText.value = null
      resetTimer = null
    }, delay)
  }

  const copyToClipboard = async (value: string) => {
    if (!value && value !== '') return false

    copyError.value = null

    try {
      if (import.meta.client && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      }
      else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea')
        textarea.value = value
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.top = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      else {
        throw new Error('Clipboard is not available in the current environment')
      }

      copiedText.value = value
      scheduleReset()
      return true
    }
    catch (error) {
      copyError.value = error instanceof Error ? error : new Error(String(error))
      return false
    }
  }

  onBeforeUnmount(() => {
    clearTimer()
  })

  return {
    copyToClipboard,
    copiedText,
    copyError,
  }
}

export type UseClipboardReturn = ReturnType<typeof useClipboard>
