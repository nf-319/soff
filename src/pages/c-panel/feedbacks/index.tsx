'use client'

import { WidgetHeader } from '@/components/WidgetHeader'
import CpanelStatsCards from '@/widgets/CpanelThoughts/CardStats'
import ThoughtsPageContent from '@/widgets/CpanelThoughts/ThougthsContent'
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ThoughtsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '2023')
  const [selectedMonth, setSelectedMonth] = useState(searchParams.get('month') || 'May')
  const [role, setRole] = useState(searchParams.get('role') || '')

  useEffect(() => {
    const params = new URLSearchParams()

    if (selectedYear) params.set('year', selectedYear)
    if (selectedMonth) params.set('month', selectedMonth)
    if (role) params.set('role', role)

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [selectedYear, selectedMonth, role, router])

  const handleClearFilters = () => {
    setSelectedYear('2023')
    setSelectedMonth('May')
    setRole('')
    router.replace('?', { scroll: false })
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
              <MenuItem value='Aprel'>Aprel</MenuItem>
              <MenuItem value='May'>May</MenuItem>
              <MenuItem value='Iyun'>Iyun</MenuItem>
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
