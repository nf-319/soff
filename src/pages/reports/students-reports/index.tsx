import { StudentReportFilter } from '@/view/Reports/StudentsReports/StudentReportsFilter'
import { StudentsStatsCard } from '@/view/Reports/StudentsReports/StudentsStatsCard'
import { Box, Typography } from '@mui/material'

const StudentReportsPage = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={5}>
      <Typography variant='h5'>O'quvchilar Hisoboti</Typography>
          <StudentReportFilter />
          <StudentsStatsCard/>
    </Box>
  )
}

export default StudentReportsPage
