import { Box, Typography, Divider, Chip, Fade, Paper, IconButton, Tooltip, alpha, useTheme } from '@mui/material'
import { Calendar, Check, Circle, Bookmark, Bell } from 'lucide-react'
import { styled } from '@mui/material/styles'
import { NotificationDetailProps } from '../modal/types'
import { getFormatTimestamp } from '@utils/getFormatTimestamp'

const NotificationContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2.5),
  backgroundColor: alpha(theme.palette.background.default, 0.3),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '& img': {
    maxWidth: '100%',
    borderRadius: theme.spacing(1),
    margin: theme.spacing(2, 0),
  },
  '& p': {
    margin: theme.spacing(1.5, 0),
    lineHeight: 1.6,
  },
  '& h3, & h4': {
    margin: theme.spacing(2, 0, 1.5),
    color: theme.palette.text.primary,
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(1, 0),
    '& li': {
      margin: theme.spacing(0.5, 0),
    }
  }
}));

export const NotificationDetail = ({ selectedNotification }: NotificationDetailProps) => {
  const theme = useTheme();

  if (!selectedNotification) {
    return (
      <Fade in={true} timeout={300}>
        <Paper sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          border: '1px solid #eaeaea',
          padding: 3
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Bell
              size={50}
              color={alpha(theme.palette.text.secondary, 0.3)}
              strokeWidth={1.5}
            />
            <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.secondary }}>
              Xabar tanlang
            </Typography>
          </Box>
        </Paper>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={300}>
      <Paper sx={{
        p: 3,
        height: '100%',
        borderRadius: 1,
        border: '1px solid #eaeaea',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {selectedNotification.notification.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={getFormatTimestamp(selectedNotification.notification.created_at)}
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <NotificationContent>
          <div dangerouslySetInnerHTML={{ __html: selectedNotification.notification.body }} />
        </NotificationContent>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title="Saqlab qo'yish">
            <IconButton
              color="primary"
              size="small"
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <Bookmark size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Fade>
  );
}
