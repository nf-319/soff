import { create } from 'zustand'


type NotificationStore = {
  notifications: any[]
  loading: boolean
  setNotifications: (data: any[]) => void
  setLoading: (isLoading: boolean) => void
}

const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],
  loading: false,
  setNotifications: (data: any) => set({ notifications: data, loading: false }),
  setLoading: (isLoading: boolean) => set({ loading: isLoading })
}))

export default useNotificationStore
