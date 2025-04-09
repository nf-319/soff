import { Box, Paper, Skeleton, Divider } from '@mui/material'

export const LoadingSkeleton = () => (
    <Box sx={{
      display: 'flex',
      height: 'calc(100vh - 80px)',
      gap: 2,
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      <Box sx={{ width: { xs: '100%', md: '35%' }, height: { xs: 'auto', md: '100%' } }}>
        <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="rounded" width="20%" height={24} />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ mb: 2, p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1.5 }} />
                <Skeleton variant="text" width="70%" height={20} />
              </Box>
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="30%" height={14} sx={{ mt: 1 }} />
            </Box>
          ))}
        </Paper>
      </Box>

      <Box sx={{ width: { xs: '100%', md: '65%' }, height: { xs: 'auto', md: '100%' } }}>
        <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="text" width="50%" height={28} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={100} height={28} />
              <Skeleton variant="rounded" width={100} height={28} />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ px: 2 }}>
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="85%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ my: 2 }} />
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
