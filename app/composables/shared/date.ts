/**
 * 格式化日期為標準格式
 * @param date - Date 物件或日期字串或時間戳
 * @returns 格式化後的日期字串，格式：yyyy-mm-dd hh:mm
 */
export const formatDate = (date: Date | string | number | null | undefined): string => {
  if (!date) return '-'

  let dateObj: Date
  if (typeof date === 'number') {
    // 如果是時間戳（秒或毫秒）
    dateObj = date > 1000000000000 ? new Date(date) : new Date(date * 1000)
  }
  else if (typeof date === 'string') {
    dateObj = new Date(date)
  }
  else {
    dateObj = date
  }

  if (isNaN(dateObj.getTime())) return '-'

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}
