import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

export const NotificationSkeleton = () => (
  <Paper
    elevation={1}
    sx={{
      height: '100%',
      borderRadius: '16px',
      minHeight: 220,
      p: 2
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={180} height={24} />
      </Box>
      <Skeleton variant="text" width={100} height={20} />
    </Box>

    <Skeleton variant="rectangular" height={1} sx={{ mb: 2 }} />

    <Stack spacing={1}>
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} width="80%" />
    </Stack>

    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Skeleton variant="text" width={150} height={24} />
    </Box>
  </Paper>
)
