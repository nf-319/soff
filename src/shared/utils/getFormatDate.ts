import { format } from 'date-fns'
import { uz } from 'date-fns/locale'

export const getFormatDate = (
  date: Date | string,
  formatString: string = 'dd MMMM yyyy',
  showTime: boolean = false
): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date')
  }

  const baseFormat = format(parsedDate, formatString, { locale: uz })

  if (showTime) {
    const time = format(parsedDate, 'HH:mm', { locale: uz })
    return `${baseFormat} ${time}`
  }

  return baseFormat
}
