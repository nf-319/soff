import { useGet } from '@/hooks/useApi'
import { Box, Card, Typography } from '@mui/material'

const CardStats = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const paramsObject = Object.fromEntries(searchParams.entries())
  const { data: dataResult } = useGet('owner/feedback_weakness/', { params: paramsObject })
  const data = [
    { value: dataResult?.results.summary.new || 0, status: 'Yangi', color: '#F1F5F9', text_color: '#1E293B' },
    {
      value: dataResult?.results.summary.in_process || 0,
      status: 'Jarayonda',
      color: '#DBEAFE',
      text_color: '#1D4ED8'
    },
    {
      value: dataResult?.results.summary.accepted || 0,
      status: 'Qabul qilindi',
      color: '#FEF9C3',
      text_color: '#CA8A04'
    },
    {
      value: dataResult?.results.summary.resolved || 0,
      status: 'Hal qilindi',
      color: '#DCFCE7',
      text_color: '#15803D'
    },
    { value: dataResult?.results.summary.rejected || 0, status: 'Rad etildi', color: '#FECACA', text_color: '#B91C1C' }
  ]

  return (
    <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
      {data.map(item => (
        <Card sx={{ width: '100%', padding: 4, boxShadow: 'none', bgcolor: item.color }}>
          <Typography fontWeight={600} color={item.text_color}>
            {item.value}
          </Typography>
          <Typography color={item.text_color}>{item.status}</Typography>
        </Card>
      ))}
    </Box>
  )
}

export default CardStats
