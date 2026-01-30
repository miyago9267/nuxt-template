export const useLoading = () => {
  const isLoading = useState('global-loading', () => true)
  const startLoading = () => {
    isLoading.value = true
  }
  const stopLoading = () => {
    isLoading.value = false
  }
  return {
    isLoading: readonly(isLoading),
    startLoading,
    stopLoading,
  }
}
