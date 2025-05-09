import { Card, Skeleton } from '@mui/material'
import { Box } from '@mui/system'

export const LeadsStatementYearlyTrendSkeleton = () => (
  <Card
    sx={{
      width: '100%',
      height: { xs: '100%', sm: 400, md: 500 },
      p: 2
    }}
  >
    <Box display='flex' gap={3} sx={{ px: 6, py: 4 }}>
      <Skeleton variant='text' width={200} height={32} />
      <Skeleton variant='circular' width={24} height={24} sx={{ mt: 'auto', mb: 'auto' }} />
    </Box>

    <Box sx={{ height: 'calc(100% - 80px)', width: '100%', position: 'relative', pt: 2, px: 3 }}>
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          top: 10,
          bottom: 40,
          width: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Skeleton variant='text' width={25} height={20} />
        <Skeleton variant='text' width={25} height={20} />
        <Skeleton variant='text' width={25} height={20} />
        <Skeleton variant='text' width={25} height={20} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 60,
          right: 20,
          bottom: 10,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} variant='text' width={40} height={20} />
          ))}
      </Box>

      <Box sx={{ position: 'absolute', left: 60, right: 20, top: 10, bottom: 40 }}>
        <Skeleton
          variant='rectangular'
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '30%',
            height: 3,
            borderRadius: 4,
            transform: 'none',
            '&::after': {
              animation: 'none'
            }
          }}
        />

        <Skeleton
          variant='rectangular'
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '60%',
            height: 3,
            borderRadius: 4,
            transform: 'none',
            '&::after': {
              animation: 'none'
            }
          }}
        />

        <Skeleton
          variant='rectangular'
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '75%',
            height: 3,
            borderRadius: 4,
            transform: 'none',
            '&::after': {
              animation: 'none'
            }
          }}
        />

        {Array(6)
          .fill(0)
          .map((_, index) => (
            <Box key={index} sx={{ position: 'absolute', left: `${index * 20}%`, transform: 'translateX(-50%)' }}>
              <Skeleton
                variant='circular'
                width={10}
                height={10}
                sx={{ position: 'absolute', top: '30%', transform: 'translate(-50%, -50%)' }}
              />
              <Skeleton
                variant='circular'
                width={10}
                height={10}
                sx={{ position: 'absolute', top: '60%', transform: 'translate(-50%, -50%)' }}
              />
              <Skeleton
                variant='circular'
                width={10}
                height={10}
                sx={{ position: 'absolute', top: '75%', transform: 'translate(-50%, -50%)' }}
              />
            </Box>
          ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: { xs: '50%', md: 20 },
          bottom: { xs: 10, md: '50%' },
          transform: { xs: 'translateX(50%)', md: 'translateY(50%)' },
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: 2
        }}
      >
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant='circular' width={12} height={12} />
              <Skeleton variant='text' width={80} height={20} />
            </Box>
          ))}
      </Box>
    </Box>
  </Card>
)

LeadsStatementYearlyTrendSkeleton.displayName = 'LeadsStatementYearlyTrendSkeleton'
