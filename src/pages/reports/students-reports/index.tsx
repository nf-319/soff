import { AchievmentReports } from '@modules/Reports/StudentsReports/AchievmentsReports'
import { AttenDanceReports } from '@modules/Reports/StudentsReports/AttendanceReports/AttendanceReports'
import { StudentReportFilter } from '@modules/Reports/StudentsReports/StudentReportsFilter'
import { StudentsStatsCard } from '@modules/Reports/StudentsReports/StudentsStatsCard'
import { WidthDrawnStudents } from '@modules/Reports/StudentsReports/WidthDrawnStudents'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'

const StudentReportsPage = () => {
  const params = new URLSearchParams(window.location.search)
  const [value, setValue] = useState<string>((params.get('tab')) || '1')
  const router = useRouter()
  const query = { ...router.query }
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
    if (newValue !== '1') {
      query.tab = String(newValue)
    } else {
      delete query.tab
    }
    void router.push(
      {
        pathname: router.pathname,
        query: query
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={5}>
      <Typography variant='h5'>O'quvchilar Hisoboti</Typography>
      <StudentReportFilter />
      <StudentsStatsCard />
      {value !== undefined && (
        <>
          <Tabs scrollButtons={'auto'} variant='scrollable' value={value} onChange={handleChange}>
            <Tab value={'1'} label='Davomatlar Hisoboti' />
            <Tab value={'2'} label="O'zlashtirish darajasi" />
            <Tab value={'3'} label="Ketgan o'quvchilar" />
          </Tabs>
        </>
      )}
      {value == '1' && <AttenDanceReports />}
      {value == '2' && <AchievmentReports />}
      {value == '3' && <WidthDrawnStudents />}
    </Box>
  )
}

export default StudentReportsPage
