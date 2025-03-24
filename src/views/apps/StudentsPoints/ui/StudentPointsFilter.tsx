'use client'

import Box from '@mui/material/Box'
import { FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import { Search } from 'lucide-react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import useDebounce from 'src/hooks/useDebounce'
import { useGet } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'

export const StudentPointsFilter = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const [search, setSearch] = useState<string>(searchParams.get('search') || '')
  const [branch, setBranch] = useState<string>(searchParams.get('branch') || '')
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(
    searchParams.get('startDate') ? dayjs(searchParams.get('startDate')) : null
  )
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(
    searchParams.get('endDate') ? dayjs(searchParams.get('endDate')) : null
  )
  const searchDebounce = useDebounce(search, 300)
  const { data } = useGet(ceoConfigs.barnchs)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (search) params.set('search', search)
    else params.delete('search')

    if (branch) params.set('branch', branch)
    else params.delete('branch')

    if (startDate) params.set('startDate', startDate.format('YYYY-MM-DD'))
    else params.delete('startDate')

    if (endDate) params.set('endDate', endDate.format('YYYY-MM-DD'))
    else params.delete('endDate')

    const queryString = params.toString()
    history.replaceState(null, '', queryString ? `?${queryString}` : window.location.pathname)
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
          '& > *': { 
            flex: 1
          }
        }}
      >
        <FormControl size='small' fullWidth>
          <InputLabel id='search-input'>Search Students...</InputLabel>
          <OutlinedInput
            onChange={e => setSearch(e.target.value)}
            value={search}
            endAdornment={
              <InputAdornment position='end'>
                <Search />
              </InputAdornment>
            }
            label='Search Students...'
            id='search-input'
            placeholder='Search...'
          />
        </FormControl>

        <FormControl size='small' fullWidth>
          <InputLabel id='branch-select-label'>All Branches</InputLabel>
          <Select
            labelId='branch-select-label'
            id='branch-select'
            value={branch}
            onChange={e => setBranch(e.target.value)}
            label='All Branches'
          >
            <MenuItem value=''>All Branches</MenuItem>
            {data?.results.map((branch: any) => (
              <MenuItem key={branch.id} value={branch.id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label='Start Date'
          value={startDate}
          onChange={date => setStartDate(date)}
          format='DD-MM-YYYY'
          slotProps={{ 
            textField: { 
              size: 'small',
              fullWidth: true
            } 
          }}
        />

        <DatePicker
          label='End Date'
          value={endDate}
          onChange={date => setEndDate(date)}
          format='DD-MM-YYYY'
          slotProps={{ 
            textField: { 
              size: 'small',
              fullWidth: true
            } 
          }}
        />
      </Box>
    </LocalizationProvider>
  )
}

StudentPointsFilter.displayName = 'StudentPointsFilter'
