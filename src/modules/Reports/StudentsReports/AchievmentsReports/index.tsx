import { Box, Card, Typography } from '@mui/material'
import { AchievmentReportsFilter } from './AchievmentsReportsFilter'

export function AchievmentReports() {
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
      <Box>
        <Typography variant='h5'>O'quvchi o'zlashtirish darajasi jadvali</Typography>
        <Typography fontSize={15}>O'quvchilarning o'zlashtirish darajasi</Typography>
      </Box>
      <AchievmentReportsFilter />
    </Card>
  )
}
