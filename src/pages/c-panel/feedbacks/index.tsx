'use client'

import { WidgetHeader } from '@/components/WidgetHeader'
import CpanelStatsCards from '@/widgets/CpanelThoughts/CardStats'
import ThoughtsPageContent from '@/widgets/CpanelThoughts/ThougthsContent'
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MONTH_VALUES } from '@shared/config'

const ThoughtsPage = () => {
  const router = useRouter()
  const searchParams = new URLSearchParams(window.location.search)
  const paramsObject = Object.fromEntries(searchParams.entries())
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '2025')
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month') || currentMonth)
  const [role, setRole] = useState(searchParams.get('role') || '')

  useEffect(() => {
    const { year, month, role } = router.query

    if (typeof year === 'string') setSelectedYear(year)
    if (typeof month === 'string') setSelectedMonth(month)
    if (typeof role === 'string') setRole(role)
  }, [router.query])

  useEffect(() => {
    const currentQuery = router.query

    if (currentQuery.year !== selectedYear || currentQuery.month !== selectedMonth || currentQuery.role !== role) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...paramsObject,
            year: selectedYear,
            month: selectedMonth,
            ...(role ? { role } : {})
          }
        },
        undefined,
        { shallow: true }
      )
    }
  }, [selectedYear, selectedMonth, role])

  const handleClearFilters = () => {
    const clearedQuery = {
      ...paramsObject,
      year: '2025',
      role: '',
      month: currentMonth
    }

    setSelectedYear('2025')
    setSelectedMonth(currentMonth)

    router.replace(
      {
        pathname: router.pathname,
        query: clearedQuery
      },
      undefined,
      { shallow: true }
    )
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
              {MONTH_VALUES.map(item => (
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
          <Button sx={{ flexShrink: 0 }} variant='outlined' size='medium' onClick={handleClearFilters}>
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
