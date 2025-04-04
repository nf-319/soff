import { alpha, styled } from '@mui/material/styles'
import { Badge, Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

export const StyledMenu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 400,
    overflow: 'hidden',
    marginTop: theme.spacing(2),
    boxShadow: theme.shadows[4],
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

export const StyledMenuItem = styled(MuiMenuItem)<{ read?: boolean }>(({ theme, read }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  transition: 'background-color 0.2s ease',
  backgroundColor: read ? 'transparent' : alpha(theme.palette.primary.light, 0.1),
  '&:hover': {
    backgroundColor: read ? alpha(theme.palette.primary.light, 0.05) : alpha(theme.palette.primary.light, 0.15)
  },
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: 4,
    right: 4,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    fontSize: '0.65rem',
    padding: '0 4px',
    minWidth: 18,
    height: 18
  }
}))

export const NotificationScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 380
})
