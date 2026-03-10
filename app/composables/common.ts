export const StringEmpty = (str: string | null | undefined) => {
  return !str || str.trim().length == 0
}
