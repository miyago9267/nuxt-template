export const StringEmpty = (str: string | null | undefined) => {
  return !str || str.trim().length == 0
}

export const copyToClipboard = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
  }
  catch (error) {
    console.error('Copy failed', error)
  }
}
