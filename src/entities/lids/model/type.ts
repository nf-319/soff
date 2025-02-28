export type LeadsType<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T
}
