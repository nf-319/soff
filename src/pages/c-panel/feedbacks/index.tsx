'use client'

import { WidgetHeader } from '@/components/WidgetHeader'
import CpanelStatsCards from '@/widgets/CpanelThoughts/CardStats'
import ThoughtsPageContent from '@/widgets/CpanelThoughts/ThougthsContent'
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const ThoughtsPage = () => {
  const router = useRouter()
  const searchParams = new URLSearchParams(window.location.search)
  const paramsObject = Object.fromEntries(searchParams.entries());
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year')||'2023')
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month')||'may')
  const [role, setRole] = useState(searchParams.get('role')||'')
  

  const months = [
  { value: 'january', label: 'Yanvar' },
  { value: 'february', label: 'Fevral' },
  { value: 'march', label: 'Mart' },
  { value: 'april', label: 'Aprel' },
  { value: 'may', label: 'May' },
  { value: 'june', label: 'Iyun' },
  { value: 'july', label: 'Iyul' },
  { value: 'august', label: 'Avgust' },
  { value: 'september', label: 'Sentabr' },
  { value: 'october', label: 'Oktabr' },
  { value: 'november', label: 'Noyabr' },
  { value: 'december', label: 'Dekabr' }
]


  useEffect(() => {
    const { year, month, role } = router.query

    if (typeof year === 'string') setSelectedYear(year)
    if (typeof month === 'string') setSelectedMonth(month)
    if (typeof role === 'string') setRole(role)
  }, [router.query])

  useEffect(() => {
  const currentQuery = router.query

  if (
    currentQuery.year !== selectedYear ||
    currentQuery.month !== selectedMonth ||
    currentQuery.role !== role
  ) {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...paramsObject,
          year: selectedYear,
          month: selectedMonth,
          role: role ?? '', 
        },
      },
      undefined,
      { shallow: true }
    )
  }
}, [selectedYear, selectedMonth, role])


 const handleClearFilters = () => {
  const clearedQuery = {
    ...paramsObject,
    year: '2023',
    month: 'May',
  }

  setSelectedYear('2023')
  setSelectedMonth('May')
  setRole('')

  router.replace({
    pathname: router.pathname,
    query: clearedQuery,
  }, undefined, { shallow: true })
}

  return (
    <Box display='flex' flexDirection='column' gap={5}>
      <WidgetHeader titleSize='large' childrenSx={{ width: '100%' }} title='Foydalanuvchi fikrlari tahlili'>
        <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <FormControl fullWidth>
            <Select size='small' value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              <MenuItem value='2023'>2023</MenuItem>
              <MenuItem value='2024'>2024</MenuItem>
              <MenuItem value='2025'>2025</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select size='small' value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
             {months.map((item)=>(
              <MenuItem value={item.value}>{item.label}</MenuItem>
             ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select size='small' displayEmpty value={role} onChange={e => setRole(e.target.value)}>
              <MenuItem value=''>Barcha rollar</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='ceo'>Ceo</MenuItem>
              <MenuItem value='teacher'>Teacher</MenuItem>
            </Select>
          </FormControl>
          <Button fullWidth variant='outlined' size='medium' onClick={handleClearFilters}>
            Filterni tozalash
          </Button>
        </Box>
      </WidgetHeader>

      <CpanelStatsCards />
      <ThoughtsPageContent />
    </Box>
  )
}

export default ThoughtsPage
