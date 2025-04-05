import { useGetAllNotifications } from './CreateNotifications/api/notification'
import Box from '@mui/material/Box'

export const Notifications = () => {
  const { data, isLoading } = useGetAllNotifications()

  return <Box>notification</Box>
}
