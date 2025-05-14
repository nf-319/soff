export const getTrendDirection = (process?: number): 'up' | 'down' => {
  const results = (process || 0) > 0
  return results ? 'up' : 'down'
}
