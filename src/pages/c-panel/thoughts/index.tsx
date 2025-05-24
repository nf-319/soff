import { WidgetHeader } from '@/components/WidgetHeader'
import CpanelStatsCards from '@/widgets/CpanelThoughts/CardStats'
import ThoughtsPageContent from '@/widgets/CpanelThoughts/ThougthsContent'
import { Box, FormControl, MenuItem, Select } from '@mui/material'
import { useState } from 'react'

const ThoughtsPage = () => {
  const [selectedYear, setSelectedYear] = useState('2023')
  const [selectedMonth, setSelectedMonth] = useState('May')
  const [role, setRole] = useState('')
  return (
    <Box display={'flex'} flexDirection={'column'} gap={5}>
      <WidgetHeader title='Foydalanuvchi fikrlari tahlili'>
        <Box display={'flex'} gap={3}>
          <FormControl>
            <Select size='small' value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              <MenuItem value={'2023'}>2023</MenuItem>
              <MenuItem value={'2024'}>2024</MenuItem>
              <MenuItem value={'2025'}>2025</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <Select size='small' value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              <MenuItem value={'Aprel'}>Aprel</MenuItem>
              <MenuItem value={'May'}>May</MenuItem>
              <MenuItem value={'Iyun'}>Iyun</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <Select size='small' displayEmpty value={role} onChange={e => setRole(e.target.value)}>
              <MenuItem value=''>Barcha rollar</MenuItem>
              <MenuItem value={'Admin'}>Admin</MenuItem>
              <MenuItem value={'Ceo'}>Ceo</MenuItem>
              <MenuItem value={'Teacher'}>Teacher</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <Select size='small' value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              <MenuItem value={'2023'}>2023</MenuItem>
              <MenuItem value={'2024'}>2024</MenuItem>
              <MenuItem value={'2025'}>2025</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </WidgetHeader>
          <CpanelStatsCards />
          <ThoughtsPageContent/>
    </Box>
  )
}

export default ThoughtsPage
