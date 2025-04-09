'use client'

import { useState, SyntheticEvent, Fragment, useEffect, useRef } from 'react'
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
  CircularProgress,
  Chip, Avatar
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import { Bell, BellRing, ChevronRight } from 'lucide-react'
import { Settings } from '@/@core/context/settingsContext'
import { useAppSelector } from 'src/store'
import { ScrollWrapper } from './ui/ScrollWrapper'
import { StyledBadge, StyledMenuItem, StyledMenu } from './NotificationDropdown.style'
import { NotificationsType } from './model/types'
import { useGetNotificationList } from './api/notifications'
import NotificationEmpty from './ui/NotificationEmpty'
import parse from 'html-react-parser'
import { useAuth } from '@hooks/useAuth'
import wsService from '@api/socket/wsInstance'

type Props = {
  settings: Settings
}

interface NotificaitonsSockerType {
  notifications: {
    count: number
    notifications: any[]
  }
}


const NotificationDropdown = (props: Props) => {
  const { settings } = props
  const { direction } = settings
  const { t } = useTranslation()
  const [messages, setMessages] = useState<NotificaitonsSockerType[]>([])
  const router = useRouter()
  const { user } = useAuth()

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [notifications, setNotifications] = useState<{ results: NotificationsType[] } | null>(null)

  const { refetch, isLoading } = useGetNotificationList()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const isMenuOpen = Boolean(anchorEl)

  const handleDropdownOpen = async (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    const data = await refetch()
    setNotifications(data.data)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleViewAll = () => {
    void router.push('/notifications')
    setAnchorEl(null)
  }

  const handleClickNotification = (id: number) => {
    void router.push(`/notifications/${id}`)
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
      console.info('New notification:', message);
      setMessages((prev) => [...prev, message]);
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

  console.log(messages)

  return (
    <Fragment>
      <Tooltip title={t('Xabarnomalar')} arrow>
        <IconButton
          color='inherit'
          aria-label='Notifications'
          aria-haspopup='true'
          onClick={handleDropdownOpen}
          aria-controls='notification-menu'
          aria-expanded={isMenuOpen ? 'true' : undefined}
          sx={{
            position: 'relative',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        >
          <StyledBadge
            color='error'
            variant='standard'
            badgeContent={messages[0]?.notifications?.count}
            max={9}
          >
            <Bell size={24} />
          </StyledBadge>
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
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='body1' sx={{ fontWeight: 600 }}>
            {t('Xabarnomalar')}
          </Typography>

          <Chip
            size='small'
            color='primary'
            variant='outlined'
            label={`${messages[0]?.notifications?.count} ta yangi xabar`}
            sx={{ height: 24, fontSize: '0.75rem', fontWeight: 500, borderRadius: '12px' }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <ScrollWrapper hidden={hidden}>
            {messages[0]?.notifications?.notifications?.length ? (
              messages[0]?.notifications?.notifications.map((notification: NotificationsType, index: number) => (
                <StyledMenuItem
                  key={notification.id || index}
                  onClick={() => handleClickNotification(notification.id)}
                  read={!notification.is_read}
                >
                  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box width='100%' display='flex' alignItems='center' justifyContent='start' gap={3}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: notification.is_read ? '#666CFF' : 'default',
                          color: notification.is_read ? 'white' : 'inherit'
                        }}
                      >
                        {notification.is_read ? <BellRing size={20} /> : <Bell size={20} />}
                      </Avatar>

                      <Box sx={{ display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                        <Typography
                          sx={{
                            fontWeight: notification.is_read ? 500 : 600,
                            fontSize: '0.9rem',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {notification?.notification.title}
                        </Typography>

                        <Typography
                          variant='caption'
                          sx={{
                            color: 'text.disabled',
                            mt: 0.5,
                            display: 'block',
                            textAlign: 'right'
                          }}
                        >
                          {notification?.notification.created_at}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className='notification-body'
                      sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontSize: '0.875rem',
                        '& a': { color: 'primary.main' },
                        '& img': { maxWidth: '100%', height: 'auto' },
                        '& p': { margin: 0 }
                      }}
                    >
                      {renderHTML(notification?.notification?.body || '')}
                    </Box>
                  </Box>
                </StyledMenuItem>
              ))
            ) : (
              <NotificationEmpty />
            )}
          </ScrollWrapper>
        )}

        {Array.isArray(notifications?.results) && notifications.results.length > 0 && (
          <Fragment>
            <Divider sx={{ m: 0 }} />
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant='contained'
                onClick={handleViewAll}
                endIcon={<ChevronRight size={16} />}
                sx={{
                  borderRadius: '8px',
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4
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
