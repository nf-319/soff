import { Box, Card, Typography } from '@mui/material'
import { WidthDrawnStudentsFilter } from './WidthDrawnStudentsFilter'

export function WidthDrawnStudents() {
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
        <Typography variant='h5'>Ketgan o'quvchilar jadvali</Typography>
        <Typography fontSize={15}>Kursni tugatgan yoki tark etgan o'quvchilar</Typography>
      </Box>
      <WidthDrawnStudentsFilter />
    </Card>
  )
}
