import { Box, Typography, List, Divider, Chip, Avatar, alpha, useTheme, Theme, Paper } from '@mui/material'
import { Circle, Bell, BellRing } from 'lucide-react'
import { styled } from '@mui/material/styles'
import { NotificationListProps } from '../modal/types'
import { getFormatTimestamp } from '@utils/getFormatTimestamp'

type Props = {
  theme?: Theme;
  selected?: boolean;
  isread: boolean;
}

const NotificationListItem = styled('div')<Props>(({ theme, selected, isread }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  transition: 'all 0.2s ease',
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : isread
      ? theme.palette.background.paper
      : alpha(theme.palette.primary.main, 0.01),
  borderLeft: selected
    ? `3px solid ${theme.palette.primary.main}`
    : 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateX(4px)',
    boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.05)}`,
  },
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`
  }
}));

const TimeLabel = styled('div')(({ theme }) => ({
  fontSize: '0.7rem',
  color: alpha(theme.palette.text.secondary, 0.8),
  marginTop: '4px'
}));

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  marginRight: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
}));

export const NotificationList = ({
  notifications,
  selectedNotification,
  handleReadNotification,
  unreadCount
}: NotificationListProps) => {
  const theme = useTheme()

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.notification.is_read !== b.notification.is_read) {
      return a.notification.is_read ? 1 : -1
    }

    const dateA = new Date(a.notification.created_at).getTime()
    const dateB = new Date(b.notification.created_at).getTime()
    return dateB - dateA
  })

  return (
    <Box
      component={Paper}
      elevation={1}
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
          Barcha xabarnomalar ({notifications.length})
        </Typography>

        {unreadCount > 0 && (
          <Chip label={`${unreadCount} o'qilmagan`} size='small' color='primary' sx={{ fontSize: '0.75rem' }} />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ flex: 1, overflowY: 'auto', overflowX: "hidden", p: 0 }}>
        {sortedNotifications.map(item => (
          <NotificationListItem
            key={item.id}
            selected={selectedNotification?.id === item.id}
            isread={item.notification.is_read}
            onClick={() => handleReadNotification(item)}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <NotificationAvatar>
                {item.notification.is_read ? <Bell size={14} /> : <BellRing size={14} />}
              </NotificationAvatar>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {!item.notification.is_read && (
                    <Circle size={6} fill={theme.palette.primary.main} style={{ marginRight: '8px' }} />
                  )}
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: !item.notification.is_read ? 600 : 400,
                      color: !item.notification.is_read ? theme.palette.text.primary : theme.palette.text.secondary
                    }}
                  >
                    {item.notification.title}
                  </Typography>
                </Box>
                <Typography
                  variant='caption'
                  sx={{
                    color: alpha(theme.palette.text.secondary, 0.9),
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    mt: 0.5
                  }}
                >
                  {item.notification.body.replace(/<[^>]*>?/gm, '').substring(0, 60)}...
                </Typography>
                <TimeLabel>{getFormatTimestamp(item.notification.created_at)}</TimeLabel>
              </Box>
            </Box>
          </NotificationListItem>
        ))}
      </List>
    </Box>
  )
}
