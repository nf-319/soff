import { Card, Typography } from '@mui/material'

export function AttendanceReportsStatsCard({
  title,
  value,
  text_color
}: {
  title: string
  value: number
  text_color?: string
}) {
  return (
    <Card  sx={{height:'100%', padding: 5, boxShadow: 'none', border: '1px solid lightgray' }}>
      <Typography textAlign={'center'}>{title}</Typography>
      <Typography textAlign={'center'} fontSize={20} fontWeight={700} color={text_color || '#64748b'}>{value}</Typography>
    </Card>
  )
}
