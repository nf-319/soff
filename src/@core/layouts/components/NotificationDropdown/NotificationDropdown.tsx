'use client'

import { useState, Fragment, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  Tooltip,
  Fade,
  Divider,
  Chip,
  Avatar,
} from '@mui/material'
import { Theme, alpha } from '@mui/material/styles'
import { Bell, BellRing, ChevronRight } from 'lucide-react'
import { Settings } from '@/@core/context/settingsContext'
import { ScrollWrapper } from './ui/ScrollWrapper'
import { NotificationsType } from './model/types'
import NotificationEmpty from './ui/NotificationEmpty'
import parse from 'html-react-parser'
import { useAuth } from '@hooks/useAuth'
import wsService from '@api/socket/wsInstance'
import Badge from '@mui/material/Badge'
import { getFormatTimestamp } from '@utils/getFormatTimestamp'
import {
  NotificationContent,
  StyledMenu,
  StyledMenuItem,
} from './NotificationDropdown.style'
import { useNotificationsNotRead } from '@hooks/useNotification'

type Props = {
  settings: Settings
}

interface NotificationSocketType {
  count: number
  notifications: NotificationsType[]
}

const NotificationDropdown = (props: Props) => {
  const { settings } = props
  const { direction } = settings
  const { t } = useTranslation()
  const [notificationData, setNotificationData] = useState<any>()
  const [notificationCount, setNotificationCount] = useState<NotificationSocketType | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const notificationPermissionRef = useRef<boolean>(false)

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const { refetch, isLoading } = useNotificationsNotRead()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const isMenuOpen = Boolean(anchorEl)

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!("Notification" in window)) {
        console.error("This browser does not support desktop notification");
        return;
      }

      if (Notification.permission === "granted") {
        notificationPermissionRef.current = true;
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        notificationPermissionRef.current = permission === "granted";
      }
    };

    void requestNotificationPermission();
  }, []);

  const handleNotificationDropdownOpen = async (value: any) => {
     setAnchorEl(value)
    try {
      const message = await refetch()
      setNotificationData(message.data)
    } catch (error) {
      console.error("Error showing notification:", error);
      throw error;
    }
  }

  const showBrowserNotification = (title: string, body: string) => {
    if (!notificationPermissionRef.current) return;

    try {
      const notification = new Notification(title, {
        body: body.replace(/<[^>]*>?/gm, ''),
        icon: '/favicon.ico'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  };

  const handleDropdownClose = async () => {
    setAnchorEl(null)
  }

  const handleViewAll = () => {
    void router.push('/notifications')
    setAnchorEl(null)
  }

  const handleClickNotification = (id: number) => {
    void router.push(`/notifications?id=${id}`)
    setAnchorEl(null)
  }

  const renderHTML = (htmlContent: string) => {
    try {
      return parse(htmlContent)
    } catch (error) {
      return htmlContent
    }
  }

  useEffect(() => {
    if (!user?.id) return;

    const handleMessage = (message: any) => {
      setNotificationCount(message);

      if (message?.notifications?.length > 0) {
        const newestNotification = message.notifications[0];
        showBrowserNotification(
          newestNotification.title || 'Yangi xabarnoma',
          newestNotification.body || ''
        );
      }
    };

    const handleError = (error: any) => {
      console.error('WebSocket error:', error);
    };

    const endpoint = `/notifications/${user.id}/`;
    wsService.connect(endpoint, handleMessage, handleError);

    return () => {
      wsService.disconnect();
    };
  }, [user?.id]);

  const notificationCounts = notificationCount?.count || 0;
  const notificationItems = notificationData || [];

  return (
    <Fragment>
      <Tooltip title={t('Xabarnomalar')} arrow>
        <IconButton
          color='inherit'
          aria-label='Notifications'
          aria-haspopup='true'
          onClick={(event) => handleNotificationDropdownOpen(event.currentTarget)}
          aria-controls='notification-menu'
          aria-expanded={isMenuOpen ? 'true' : undefined}
          sx={{
            position: 'relative',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        >
          <Badge color='error' variant='standard' badgeContent={notificationCounts} max={9}>
            <Bell size={24} />
          </Badge>
        </IconButton>
      </Tooltip>

      <StyledMenu
        id='notification-menu'
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleDropdownClose}
        TransitionComponent={Fade}
        transitionDuration={200}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box
          sx={{
            px: 4,
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: theme => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: 'white'
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, fontSize: '1rem', color: 'text.primary' }}>
            {t('Xabarnomalar')}
          </Typography>

          {notificationCounts > 0 && (
            <Chip
              size='small'
              color='primary'
              variant='outlined'
              label={`${notificationCounts} ta yangi xabar`}
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 500,
                borderRadius: '12px',
                backgroundColor: alpha('#f5f5f5', 0.8),
                borderColor: alpha('#e0e0e0', 0.5)
              }}
            />
          )}
        </Box>

        <ScrollWrapper hidden={hidden}>
          {notificationItems.length > 0 ? (
            notificationItems.map((notification: NotificationsType, index: number) => (
              <StyledMenuItem
                key={notification.id || index}
                onClick={() => handleClickNotification(notification.id)}
              >
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, pl: 1.5 }}>
                  <Box width='100%' display='flex' alignItems='flex-start' gap={2}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme => theme.palette.primary.main,
                        color: 'white',
                        flexShrink: 0,
                        border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                      }}
                    >
                      <BellRing size={20} />
                    </Avatar>

                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'text.primary'
                        }}
                      >
                        {notification?.title}
                      </Typography>

                      <NotificationContent>{renderHTML(notification?.body || '')}</NotificationContent>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 1.5
                        }}
                      >
                        <Typography
                          variant='caption'
                          sx={{
                            color: 'text.disabled'
                          }}
                        >
                          {getFormatTimestamp(notification?.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </StyledMenuItem>
            ))
          ) : (
            <NotificationEmpty />
          )}
        </ScrollWrapper>

        {notificationItems.length > 0 && (
          <Fragment>
            <Divider sx={{ m: 0 }} />
            <Box sx={{ p: 2, backgroundColor: 'white' }}>
              <Button
                fullWidth
                variant='contained'
                onClick={handleViewAll}
                endIcon={<ChevronRight size={16} />}
                sx={{
                  borderRadius: '8px',
                  boxShadow: 1,
                  backgroundColor: theme => theme.palette.primary.main,
                  '&:hover': {
                    boxShadow: 2,
                    backgroundColor: theme => theme.palette.primary.dark
                  }
                }}
              >
                {t('Barcha xabarnomalar')}
              </Button>
            </Box>
          </Fragment>
        )}
      </StyledMenu>
    </Fragment>
  )
}

NotificationDropdown.displayName = 'NotificationDropdown'
export default NotificationDropdown
