'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import { FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import { Search } from 'lucide-react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import useDebounce from 'src/hooks/useDebounce'
import { useGet } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'

export const StudentPointsFilter = () => {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [branch, setBranch] = useState<string>('')
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null)
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null)
  const searchDebounce = useDebounce(search, 300)
  const { data } = useGet(ceoConfigs.barnchs)

  useEffect(() => {
    if (router.isReady) {
      const query = router.query
      setSearch((query.search as string) || '')
      setBranch((query.branch as string) || '')
      setStartDate(query.start_date ? dayjs(query.start_date as string) : null)
      setEndDate(query.end_date ? dayjs(query.end_date as string) : null)
    }
  }, [router.isReady, router.query])

  const updateUrlParams = () => {
    const newQuery = {
      ...router.query,
      ...(searchDebounce && { search: searchDebounce }),
      ...(branch && { branch }),
      ...(startDate && { start_date: startDate.format('YYYY-MM-DD') }),
      ...(endDate && { end_date: endDate.format('YYYY-MM-DD') })
    }

    if (!searchDebounce) delete newQuery.search
    if (!branch) delete newQuery.branch
    if (!startDate) delete newQuery.start_date
    if (!endDate) delete newQuery.end_date

    void router.push({
      pathname: router.pathname,
      query: newQuery
    }, undefined, { shallow: true })
  }

  useEffect(() => {
    if (router.isReady) {
      updateUrlParams()
    }
  }, [searchDebounce, branch, startDate, endDate])

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
            endAdornment={<InputAdornment position='end'><Search /></InputAdornment>}
            label="Qidirish..."
          />
        </FormControl>

        <FormControl size='small' fullWidth>
          <InputLabel>Filial</InputLabel>
          <Select
            value={branch}
            onChange={e => setBranch(e.target.value)}
            label="Filial"
          >
            <MenuItem value="">Barchasi</MenuItem>
            {data?.results?.map((branch: any) => (
              <MenuItem key={branch.id} value={branch.id}>{branch.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Boshlanish sanasi"
          value={startDate}
          onChange={date => setStartDate(date)}
          format="DD-MM-YYYY"
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />

        <DatePicker
          label="Tugash sanasi"
          value={endDate}
          onChange={date => setEndDate(date)}
          format="DD-MM-YYYY"
          slotProps={{ textField: { size: 'small', fullWidth: true } }}
        />
      </Box>
    </LocalizationProvider>
  )
}
