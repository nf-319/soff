'use client'

import { useState, SyntheticEvent, Fragment, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { Settings } from 'src/@core/context/settingsContext'
import CustomChip from '../../../../components/mui/chip'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchNotification } from 'src/store/apps/user'
import { EmptyContent } from '../../../../components/empty-content'
import { Bell } from 'lucide-react'

export type NotificationsType = {
  date: string
  notification_data: {
    title: string
    body: string
  }
}

type Props = {
  settings: Settings
}

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 344
})

const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = (props: Props) => {
  const { settings } = props
  const { t } = useTranslation()
  const { notifications, notificationsCount, isGettingNotification } = useAppSelector(state => state.user)
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const dispatch = useAppDispatch()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  const { direction } = settings
  const router = useRouter()

  const handleDropdownOpen = async (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
    await dispatch(fetchNotification())
  }

  const handleDropdownClose = () => {
    router.push('/notifications')
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge
          color='error'
          variant='standard'
          badgeContent={notificationsCount}
          invisible={!notificationsCount}
          sx={{
            '& .MuiBadge-badge': { top: 4, right: 4, boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}` }
          }}
        >
          <Bell />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'white' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ cursor: 'text', fontWeight: 600 }}>{t('Xabarnomalar')}</Typography>

            <CustomChip
              skin='light'
              size='small'
              color='primary'
              label={`${notifications.length} ` + t('Yangi')}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>

        <ScrollWrapper hidden={hidden}>
          {notifications.length ? (
            notifications.map((notification: NotificationsType, index: number) => (
              <MenuItem key={index} onClick={handleDropdownClose}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                    <MenuItemTitle>{notification?.notification_data.title}</MenuItemTitle>
                    <MenuItemSubtitle variant='body2'>{notification?.notification_data?.body}</MenuItemSubtitle>
                  </Box>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {notification?.date}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <EmptyContent />
          )}
        </ScrollWrapper>

        {notifications.length > 5 && (
          <MenuItem
            disableRipple
            disableTouchRipple
            sx={{
              py: 3.5,
              borderBottom: 0,
              cursor: 'default',
              userSelect: 'auto',
              backgroundColor: 'transparent !important',
              borderTop: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Button fullWidth variant='contained' onClick={() => router.push('/notifications')}>
              {t('Barcha xabarnomalar')}
            </Button>
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
