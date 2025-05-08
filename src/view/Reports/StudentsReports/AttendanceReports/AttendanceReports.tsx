import { Box, Card, Grid, Typography } from '@mui/material'
import { AttendanceReportsFilter } from './AttendanceReportsFilter'
import { AttendanceReportsStatsCard } from './StatsCards'

export function AttenDanceReports() {
  const attendanceStats = [
    {
      title: 'Jami davomаt qilinishi kerak',
      value: 209,
      text_color: '#1e40af'
    },
    {
      title: 'Kelgan',
      value: 140,
      text_color: '#22c55e'
    },
    {
      title: 'Kelmagan',
      value: 30,
      text_color: '#ef4444'
    },
    {
      title: 'Qilinmagan',
      value: 39,
      text_color: '#64748b'
    }
  ]
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        padding: 6,
        boxShadow: 'none',
        border: '1px solid lightgray'
      }}
    >
      <div>
        <Typography variant='h5'>Davomatlar Hisoboti</Typography>
        <Typography fontSize={15}>Guruhlar bo'yicha davomatlar ma'lumotlari</Typography>
      </div>
      <AttendanceReportsFilter />
      <Grid container spacing={2}>
        {attendanceStats.map(item => (
          <Grid item xs={12} sm={6} md={3}>
            <AttendanceReportsStatsCard title={item.title} value={item.value} text_color={item.text_color} />
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}
