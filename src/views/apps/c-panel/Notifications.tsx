'use client'

import { useGetAllNotifications } from './CreateNotifications/api/notification'
import Box from '@mui/material/Box'
import { Notification } from 'src/widgets/Notification'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { Plus } from 'lucide-react'
import { NotificationSkeleton } from './ui/NotificationSkeleton'
import { EmptyNotifications } from './ui/EmptyNotifications'
import { ErrorState } from './ui/ErrorState'

type NotificationType = {
  body: string
  created_at: string
  id: number
  receivers_info: string
  title: string
  updated_at: string
}

export const Notifications = () => {
  const { data, isLoading, error } = useGetAllNotifications()

  return (
    <Box component='section' display='grid' gap={4}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{ mb: 2 }}
      >
        <Typography variant='h4' component='h2'>
          Xabarnomalar
        </Typography>

        <Button
          component={Link}
          href='/c-panel/notifications/create'
          variant='outlined'
          size='medium'
          startIcon={<Plus size={18} />}
        >
          Yangi yuborish
        </Button>
      </Box>

      {isLoading && (
        <Grid container spacing={2}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} key={item}>
              <NotificationSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {error && <ErrorState />}

      {!isLoading && !error && data?.results.length === 0 && <EmptyNotifications />}

      {!isLoading && !error && data?.results.length > 0 && (
        <Grid container spacing={2}>
          {data?.results.map((notification: NotificationType) => (
            <Grid item xs={12} key={notification.id}>
              <Paper
                elevation={1}
                sx={{
                  height: '100%',
                  borderRadius: '16px',
                  minHeight: 220,
                  padding:5,
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <Notification
                  title={notification.title}
                  truncate
                  hiddenIsRead
                  content={notification.body}
                  isRead={false}
                  created_at={notification.created_at}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
