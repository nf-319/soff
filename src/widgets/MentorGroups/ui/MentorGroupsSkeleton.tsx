import { Box, Skeleton, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'

export const MentorGroupsSkeleton = () => (
    <Box
      sx={{
        p: '25px',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        height: '100%',
        width: '100%'
      }}
    >
      <Typography variant='h6' sx={{ color: '#000' }}>
        Guruhlar
      </Typography>

      <Divider color='#e0e0e0' />

      <Typography sx={{ mt: '5px', mb: '10px', fontWeight: 600, fontSize: 12 }}>Hozirgi/Keyingi daras</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[...Array(2)].map((_, idx) => (
          <Skeleton key={`skeleton-current-${idx}`} variant='rectangular' height={80} sx={{ borderRadius: '8px' }} />
        ))}
      </Box>

      <Typography sx={{ mt: '15px', mb: '10px', fontWeight: 600, fontSize: 12 }}>Barcha guruhlar</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(14.75rem, 7.159vw + 10.159rem, 18.75rem), 1fr))',
          gap: '16px'
        }}
      >
        {[...Array(6)].map((_, idx) => (
          <Skeleton key={`skeleton-group-${idx}`} variant='rectangular' height={100} sx={{ borderRadius: '8px' }} />
        ))}
      </Box>
    </Box>
  )
