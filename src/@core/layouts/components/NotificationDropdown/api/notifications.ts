import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'

const getNotification = async () => {
  try {
    const response = await api.get(Endpoints.Notifications)
    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const useGetNotificationList = () =>
  useQuery({
    queryKey: [QueryKeys.NotificationList],
    queryFn: getNotification
  })
