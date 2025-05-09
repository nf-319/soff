import Card from '@mui/material/Card'
import { Box } from '@mui/system'
import { Skeleton } from '@mui/material'

export const LeadsStatementFunnelSkeleton = () => (
  <Card
    sx={{
      height: { xs: '100%', sm: 500 },
      width: '100%',
      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <Box display='flex' gap={3} sx={{ px: 6, py: 4 }}>
      <Skeleton variant="text" width={180} height={32} />
      <Skeleton variant="circular" width={24} height={24} sx={{ mt: 'auto', mb: 'auto' }} />
    </Box>
    <Box sx={{ flexGrow: 1, width: '100%', px: 4, pb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="rectangular" width="80%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="rectangular" width="70%" height={60} sx={{ mb: 2, borderRadius: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Skeleton variant="rectangular" width="60%" height={60} sx={{ borderRadius: 1 }} />
      </Box>
    </Box>
  </Card>
);

LeadsStatementFunnelSkeleton.displayName = 'LeadsStatementFunnelSkeleton'
