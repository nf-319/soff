import { ReactNode } from 'react'
import { Box } from '@mui/material'
import { NotificationScrollbar } from '../NotificationDropdown.style'

export const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 380, overflowY: 'auto', overflowX: 'hidden', backgroundColor: 'white' }}>{children}</Box>
  } else {
    return (
      <NotificationScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        {children}
      </NotificationScrollbar>
    )
  }
}
