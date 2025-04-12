import { format } from 'date-fns'

export const getFormatTimestamp = (timestamp?: string | Date): string => {
  if (!timestamp) return ''

  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return format(date, 'MMM d, HH:mm')
  } catch (error) {
    return ''
  }
}
