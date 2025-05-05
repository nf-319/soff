export const cleanPhone = (raw?: string) => {
  if (!raw) return ''
  const digits = raw.replace(/\D/g, '')

  if (digits.length === 9) {
    return `998${digits}`
  }

  if (digits.length === 12 && digits.startsWith('998')) {
    return digits
  }

  return digits
}

export const getFormatPhone = (raw: string) => {
  const cleaned = raw.replace(/\D/g, '')

  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    const code = cleaned.slice(3, 5)
    const part1 = cleaned.slice(5, 8)
    const part2 = cleaned.slice(8, 10)
    const part3 = cleaned.slice(10, 12)

    return `+998 (${code}) ${part1}-${part2}-${part3}`
  }

  return raw
}
