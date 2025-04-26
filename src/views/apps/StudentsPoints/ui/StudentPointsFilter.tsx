'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import { Search } from 'lucide-react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

import useDebounce from 'src/hooks/useDebounce'
import { useGet } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'

export const StudentPointsFilter = () => {
  const router = useRouter()
  const { data } = useGet(ceoConfigs.barnchs)

  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('')
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    if (!router.isReady) return

    const { search = '', branch = '', start_date, end_date } = router.query

    setSearch(search as string)
    setBranch(branch as string)
    setStartDate(start_date ? dayjs(start_date as string) : null)
    setEndDate(end_date ? dayjs(end_date as string) : null)
  }, [router.isReady])

  useEffect(() => {
    if (!router.isReady) return

    const { query, pathname } = router

    const queryStart = startDate?.format('YYYY-MM-DD') || ''
    const queryEnd = endDate?.format('YYYY-MM-DD') || ''

    const isChanged =
      (query.search || '') !== debouncedSearch ||
      (query.branch || '') !== branch ||
      (query.start_date || '') !== queryStart ||
      (query.end_date || '') !== queryEnd

    if (!isChanged) return

    const newQuery: Record<string, string> = {}

    if (debouncedSearch) newQuery.search = debouncedSearch
    if (branch) newQuery.branch = branch
    if (startDate) newQuery.start_date = queryStart
    if (endDate) newQuery.end_date = queryEnd

    void router.replace({ pathname, query: newQuery }, undefined, { shallow: true })
  }, [debouncedSearch, branch, startDate, endDate, router])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display='flex'
        alignItems='center'
        gap={2}
        py={4}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          '& > *': { flex: 1 }
        }}
      >
        <FormControl size='small' fullWidth>
          <InputLabel>Qidirish...</InputLabel>
          <OutlinedInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <Search size={18} />
              </InputAdornment>
            }
            label='Qidirish...'
          />
        </FormControl>

        <FormControl size='small' fullWidth>
          <InputLabel>Filial</InputLabel>
          <Select value={branch} onChange={e => setBranch(e.target.value)} label='Filial'>
            <MenuItem value=''>Barchasi</MenuItem>
            {data?.results?.map((item: any) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label='Boshlanish sanasi'
          value={startDate}
          onChange={setStartDate}
          format='DD-MM-YYYY'
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />

        <DatePicker
          label='Tugash sanasi'
          value={endDate}
          onChange={setEndDate}
          format='DD-MM-YYYY'
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
      </Box>
    </LocalizationProvider>
  )
}
