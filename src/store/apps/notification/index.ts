import { setNotifications } from 'src/store/apps/user';
import { create } from 'zustand'


type NotificationStore = {
  notifications: any[]
  loading: boolean
  notificationCount:number
  setNotifications: (data: any[]) => void
  setNotificationsCount: (count: number) => void

  setLoading: (isLoading: boolean) => void
}

const useNotificationStore = create<NotificationStore>(set => ({
  notifications: [],
  notificationCount:0,
  loading: false,
  setNotificationsCount:(count:number)=>set({notificationCount:count}),
  setNotifications: (data: any) => set({ notifications: data, loading: false }),
  setLoading: (isLoading: boolean) => set({ loading: isLoading })
}))

export default useNotificationStore
