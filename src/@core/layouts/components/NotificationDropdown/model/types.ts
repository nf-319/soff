export type NotificationsType = {
  id: number
  is_read: boolean
  link: string | null
  notification: {
    title: string
    created_at: string
    body: string
  }
}
