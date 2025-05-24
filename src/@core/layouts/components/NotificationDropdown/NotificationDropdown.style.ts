import { alpha, styled } from '@mui/material/styles'
import { Badge, Box, Button, Menu, MenuItem } from '@mui/material'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import emotionStyled from '@emotion/styled'
import Typography from '@mui/material/Typography'


export const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(1.5),
    border: '1px solid #dddddd',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    '& .MuiList-root': {
      padding: 0
    },
    '& .MuiMenu-list': {
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }
  }
}))

export const StyledMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'read'
})(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  position: 'relative',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.08)
  }
}))


export const NotificationContent = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  fontSize: '0.875rem',
  '& a': { color: theme.palette.primary.main },
  '& img': { maxWidth: '100%', height: 'auto' },
  '& p': { margin: 0 },
  '& ul, & ol': { paddingLeft: theme.spacing(2) },
  '& table': {
    borderCollapse: 'collapse',
    width: '100%',
    '& th, & td': {
      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
      padding: theme.spacing(0.5)
    }
  }
}))

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 1),
  minWidth: 'auto',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    borderColor: theme.palette.primary.main
  }
}))


export const NotificationScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 380
})

export const ToastContainer = emotionStyled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  max-width: 400px;
  width: 100%;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ToastHeader = emotionStyled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`

export const ToastContent = emotionStyled.div`
  width: 100%;
  font-size: 0.9rem;
  color: #181818;
  line-height: 1.4;
  overflow: hidden;
`

export const ToastTitle = emotionStyled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`

export const ToastLink = emotionStyled(Typography)`
  font-size: 12px;
  cursor: pointer;
  color: #666CFF;
  transition: color 0.2s;
  flex-shrink: 0;
  &:hover {
    text-decoration: underline;
  }
`
