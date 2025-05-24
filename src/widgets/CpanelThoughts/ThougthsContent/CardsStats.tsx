import { Box, Card, Typography } from '@mui/material'

const CardStats = () => {
  const data = [
    { value: 12, status: 'Yangi', color: '#F1F5F9', text_color: '#1E293B' },
    { value: 8, status: 'Jarayonda', color: '#DBEAFE', text_color: '#1D4ED8' },
    { value: 15, status: 'Qabul qilindi', color: '#FEF9C3', text_color: '#CA8A04' },
    { value: 24, status: 'Hal qilindi', color: '#DCFCE7', text_color: '#15803D' },
    { value: 5, status: 'Rad etildi', color: '#FECACA', text_color: '#B91C1C' }
  ]

  return (
    <Box display={'flex'} gap={3}>
      {data.map(item => (
        <Card sx={{ width: '100%', padding: 4, boxShadow: 'none', bgcolor: item.color }}>
          <Typography fontWeight={600} color={item.text_color}>{item.value}</Typography>
          <Typography color={item.text_color}>{item.status}</Typography>
        </Card>
      ))}
    </Box>
  )
}

export default CardStats
