'use client'

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material'
import SearchInput from '../../../components/SearchInput'
import { useEffect, useState, useRef } from 'react'
import useResponsive from '@/@core/hooks/useResponsive'
import { useRouter } from 'next/router'

const HeadingFilter = () => {
  const { isMobile } = useResponsive()
  const router = useRouter()
    const searchParams = new URLSearchParams(window.location.search)
  const [status, setStatus] = useState(searchParams.get('status')||'')
  const [description, setDescription] = useState(searchParams.get('description')||'weaknesses')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm')||'')
  const paramsObject = Object.fromEntries(searchParams.entries());
  
  

  
  useEffect(() => {
    const currentQuery = router.query

    const isSameQuery =
      currentQuery.status === status &&
      currentQuery.description === description &&
      currentQuery.search === searchTerm

    if (!isSameQuery) {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...paramsObject,
            ...(status && { status }),
            ...(description && { description}),
            ...(searchTerm && { search: searchTerm }),
          },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [ status, description, searchTerm])

  return (
    <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
      

      <FormControl sx={{ width: isMobile ? 'auto' : 200 }} fullWidth size='small'>
        <InputLabel id='status-label'>Status</InputLabel>
        <Select
          labelId='status-label'
          value={status}
          label='Status'
          onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
        >
          <MenuItem value=''>Barcha Statuslar</MenuItem>
                    <MenuItem value='new'>Yangi</MenuItem>
          <MenuItem value='in_progress'>Jarayonda</MenuItem>
          <MenuItem value='accepted'>Qabul qilindi</MenuItem>
                    <MenuItem value='resolve'>Hal qilindi</MenuItem>

          <MenuItem value='rejected'>Rad etildi</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ width: isMobile ? 'auto' : 200 }} fullWidth size='small'>
        <InputLabel id='filter-label'>Izoh</InputLabel>
        <Select
          labelId='filter-label'
          value={description}
          label='Izoh'
          onChange={(e: SelectChangeEvent) => setDescription(e.target.value)}
        >
          <MenuItem value='weaknesses'>Muammolar</MenuItem>
          <MenuItem value='suggestions'>Qo'shimcha funksiyalar</MenuItem>
          <MenuItem value='strengths'>Farqimiz</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <SearchInput
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </FormControl>
    </Box>
  )
}

export default HeadingFilter
