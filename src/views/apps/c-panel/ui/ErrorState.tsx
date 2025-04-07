import EmptyState from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import { AlertCircle } from 'lucide-react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export const ErrorState = () => (
  <EmptyState
    sx={{
      textAlign: 'center',
      p: 4,
      borderRadius: '16px',
      backgroundColor: '#fff4f4',
      border: '1px dashed #ffcdd2'
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <AlertCircle size={64} color="#f44336" opacity={0.7} />
      </Box>
      <Typography variant="h5" component="div" gutterBottom color="error">
        Xatolik yuz berdi
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring yoki administratorga murojaat qiling.
      </Typography>
      <Button
        variant='outlined'
        color="error"
        size='medium'
        onClick={() => window.location.reload()}
      >
        Qayta yuklash
      </Button>
    </CardContent>
  </EmptyState>
)
