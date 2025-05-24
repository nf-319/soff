'use client'

import { useState, Fragment, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Box, Button, IconButton, Typography, useMediaQuery, Tooltip, Fade, Divider, Chip, Avatar } from '@mui/material'
import { Theme, alpha } from '@mui/material/styles'
import { Bell, BellRing, ChevronRight, X } from 'lucide-react'
import { Settings } from '@/@core/context/settingsContext'
import { ScrollWrapper } from './ui/ScrollWrapper'
import { NotificationsType } from './model/types'
import NotificationEmpty from './ui/NotificationEmpty'
import parse from 'html-react-parser'
import { useAuth } from '@hooks/useAuth'
import wsService from '@api/socket/wsInstance'
import Badge from '@mui/material/Badge'
import { getFormatTimestamp } from '@utils/getFormatTimestamp'
import { NotificationContent, StyledMenu, StyledMenuItem } from './NotificationDropdown.style'
import { useNotificationsNotRead } from '@hooks/useNotification'
import { useAppSelector } from '@/store'
import Link from 'next/link'
import { toast } from 'sonner'
import { ToastContainer, ToastHeader, ToastContent, ToastLink, ToastTitle } from './NotificationDropdown.style'


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
  const [notificationData, setNotificationData] = useState<NotificationsType[]>([])
  const [notificationCount, setNotificationCount] = useState<number>(0)
  const router = useRouter()
  const { user } = useAuth()
  const notificationPermissionRef = useRef<boolean>(false)
  const { companyInfo } = useAppSelector((state: any) => state.user)
  const shownNotificationsRef = useRef<Set<number>>(new Set())
  const wsConnectedRef = useRef<boolean>(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const { refetch } = useNotificationsNotRead()

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link) {
        e.preventDefault()
        const href = link.getAttribute('href')
        if (href) {
          void router.push(href)
        }
      }
    }

    const content = contentRef.current
    if (content) {
      content.addEventListener('click', handleLinkClick)
    }

    return () => {
      if (content) {
        content.removeEventListener('click', handleLinkClick)
      }
    }
  }, [router])

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const isMenuOpen = Boolean(anchorEl)

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        console.error('This browser does not support desktop notification');
        return;
      }

      if (Notification.permission === 'granted') {
        notificationPermissionRef.current = true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        notificationPermissionRef.current = permission === 'granted';
      } else {
        toast.error(t('Brauzer notificationlari o‘chirilgan. Iltimos, brauzer sozlamalaridan ruxsatni yoqing.'));
      }
    };

    void requestNotificationPermission()
  }, [])

  const handleNotificationDropdownOpen = async (value: any) => {
    setAnchorEl(value)
    try {
      const message = await refetch()
      setNotificationData(message.data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const showBrowserNotification = (title: string, body: string, id: number) => {
    if (!notificationPermissionRef.current) return

    try {
      const notification = new Notification(title, {
        body: body.replace(/<[^>]*>?/gm, ''),
        icon: companyInfo?.logo || '/logo.webp',
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
        window.location.href = `/notification?id=${id}`
      }
    } catch (error) {
      console.error('Error showing browser notification:', error)
    }
  }

  const showToastNotification = (title: string, body: string, id: number) => {
    toast.custom(
      t => (
        <Link href={`/notifications?id=${String(id)}`} passHref style={{ textDecoration: 'none' }}>
          <ToastContainer>
            <ToastHeader>
              <ToastTitle>
                <Typography variant='h5'>🔔</Typography>
                <strong style={{ fontWeight: 600, color: '#000', flex: 1 }}>
                  {title.split(' ').slice(0, 40).join(' ')}
                </strong>
              </ToastTitle>

              <IconButton
                size='small'
                onClick={() => toast.dismiss(t)}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                <X size={16} />
              </IconButton>
            </ToastHeader>

            <ToastContent>
              <NotificationContent ref={contentRef}>{parse(body)}</NotificationContent>
            </ToastContent>

            <Link href={`/notifications?id=${String(id)}`} passHref>
              <ToastLink>Batafsil</ToastLink>
            </Link>
          </ToastContainer>
        </Link>
      ),
      {
        duration: 3000,
        position: 'top-right',
        style: {
          width: '400px',
          padding: 0
        }
      }
    )
  }

  const handleDropdownClose = () => {
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

  const handleNewNotifications = (message: NotificationSocketType) => {
    setNotificationCount(message.count)

      setNotificationData(prev => {
        const newNotifications = message.notifications.filter(
          newItem => !prev.some(item => item.id === newItem.id)
        )
        return [...newNotifications, ...prev]
      })

      message.notifications.forEach(notification => {
          const title = notification.title || 'Yangi xabarnoma'
          const body = notification.body || ''
          const id = notification.id

          showBrowserNotification(title, body, id)
          showToastNotification(title, body, id)
          shownNotificationsRef.current.add(notification.id)
      })
  }

  useEffect(() => {
    if (!user?.id || wsConnectedRef.current) return

    const handleMessage = (message: NotificationSocketType) => {
      handleNewNotifications(message)
    }

    const handleError = (error: any) => {
      wsConnectedRef.current = false
    }

    const endpoint = `/notifications/${user.id}/`
    wsService.connect(endpoint, handleMessage, handleError)
    wsConnectedRef.current = true

    return () => {
      wsService.disconnect()
      wsConnectedRef.current = false
    }
  }, [user?.id])

  return (
    <Fragment>
      <Tooltip title='Xabarnomalar' arrow>
        <IconButton
          color='inherit'
          aria-label='Notifications'
          aria-haspopup='true'
          onClick={event => handleNotificationDropdownOpen(event.currentTarget)}
          aria-controls='notification-menu'
          aria-expanded={isMenuOpen ? 'true' : undefined}
          sx={{
            position: 'relative',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        >
          <Badge color='error' variant='standard' badgeContent={notificationCount} max={9}>
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
            px: '10px',
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

          {notificationCount > 0 && (
            <Chip
              size='small'
              color='primary'
              variant='outlined'
              label={`${notificationCount} ta yangi xabar`}
              sx={{
                height: 24,
                fontSize: '0.75rem',
                fontWeight: 500,
                borderRadius: '12px',
                backgroundColor: theme => alpha(theme.palette.grey[200], 0.8),
                borderColor: theme => alpha(theme.palette.grey[300], 0.5)
              }}
            />
          )}
        </Box>

        <ScrollWrapper hidden={hidden}>
          {notificationData.length > 0 ? (
            notificationData.map((notification: NotificationsType, index: number) => (
              <StyledMenuItem key={notification.id || index} onClick={() => handleClickNotification(notification.id)}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, pl: 0 }}>
                  <Box width='100%' display='flex' alignItems='flex-start' gap={2}>
                    <Box display='flex' alignItems='start' justifyContent='space-between' width='100%'>
                      <Box display='flex' gap={3} alignItems='center' justifyContent='start'>
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

                        <Box>
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

                      <Typography
                        fontSize={12}
                        sx={{
                          paddingRight: 4,
                          cursor: 'pointer',
                          color: 'primary.main',
                          transition: 'color 0.2s',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: 'primary.dark'
                          }
                        }}
                      >
                        Batafsil
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    <NotificationContent>{renderHTML(notification?.body || '')}</NotificationContent>
                  </Box>
                </Box>
              </StyledMenuItem>
            ))
          ) : (
            <NotificationEmpty />
          )}
        </ScrollWrapper>

        {notificationData.length > 0 && (
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
