'use client'

import { useState, useEffect } from 'react'
import { Box, IconButton, Typography, Paper } from '@mui/material'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/router'
import { EmptyContent } from 'src/components/empty-content'
import { NotificationList } from './ui/NotificationsList'
import { NotificationDetail } from './ui/NotificationDetail'
import { LoadingSkeleton } from './ui/LoadingSkeleton'
import { generateFakeNotifications } from './modal/constants'
import { NotificationItem } from './modal/types'

export const Notifications = () => {
  const router = useRouter();
  const { id: selectedId } = router.query;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData = generateFakeNotifications();
      setNotifications(fakeData);
      setLoading(false);

      if (selectedId) {
        const selected = fakeData.find(item => item.id === parseInt(selectedId as string));
        if (selected) {
          setSelectedNotification(selected);

          if (!selected.notification.is_read) {
            handleReadNotification(selected);
          }
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedId]);

  const handleReadNotification = (notificationItem: NotificationItem) => {
    void router.push(`/notifications?id=${notificationItem.id}`, undefined, { shallow: true });

    setSelectedNotification(notificationItem);

    if (!notificationItem.notification.is_read) {
      setNotifications(prevNotifications =>
        prevNotifications.map(item =>
          item.id === notificationItem.id
            ? {
              ...item,
              notification: {
                ...item.notification,
                is_read: true
              }
            }
            : item
        )
      );
    }
  };

  const unreadCount = notifications.filter(item => !item.notification.is_read).length;

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'background.default',
      p: { xs: 1, sm: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            color: 'primary.main',
            '&:hover': { transform: 'translateX(-3px)' },
            transition: 'transform 0.2s'
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Xabarnomalar
        </Typography>
      </Box>

      {loading ? (
        <LoadingSkeleton />
      ) : notifications.length ? (
        <Box sx={{
          display: 'flex',
          height: 'calc(100vh - 80px)',
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Box sx={{ width: { xs: '100%', md: '35%' }, height: { xs: 'auto', md: '100%' } }}>
            <NotificationList
              notifications={notifications}
              selectedNotification={selectedNotification}
              handleReadNotification={handleReadNotification}
              unreadCount={unreadCount}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', md: '65%' }, height: { xs: 'auto', md: '100%' } }}>
            <NotificationDetail selectedNotification={selectedNotification} />
          </Box>
        </Box>
      ) : (
        <Box sx={{
          height: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <EmptyContent title="Xabarnomalar mavjud emas" />
          </Paper>
        </Box>
      )}
    </Box>
  );
}
