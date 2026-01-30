interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  resolve: ((value: boolean) => void) | null
}

export const useConfirm = () => {
  const confirmState = useState<ConfirmState>('confirm-dialog-state', () => ({
    isOpen: false,
    title: '確認',
    message: '',
    resolve: null,
  }))

  const confirm = (message: string, title: string = '確認'): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmState.value = {
        isOpen: true,
        title,
        message,
        resolve,
      }
    })
  }

  return {
    confirm,
    confirmState: computed(() => confirmState.value),
  }
}
