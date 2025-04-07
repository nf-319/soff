import EmptyState from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { Plus, Search } from 'lucide-react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Link from 'next/link'

export const EmptyNotifications = () => (
  <EmptyState
    sx={{
      textAlign: 'center',
      p: 4,
      borderRadius: '16px',
      backgroundColor: '#f9f9f9',
      border: '1px dashed #ddd'
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Search size={64} color="#666" opacity={0.7} />
      </Box>
      <Typography variant="h5" component="div" gutterBottom>
        Xabarnomalar topilmadi
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Hozircha hech qanday xabarnoma mavjud emas. Yangi xabarnoma yaratish uchun "Yangi yuborish" tugmasini bosing.
      </Typography>
      <Button
        component={Link}
        href='/c-panel/notifications/create'
        variant='contained'
        size='medium'
        startIcon={<Plus size={18} />}
      >
        Yangi yuborish
      </Button>
    </CardContent>
  </EmptyState>
)
