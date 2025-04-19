'use client'

import Box from '@mui/material/Box'
import {
  Autocomplete,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  CircularProgress
} from '@mui/material'
import { Search } from 'lucide-react'
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import { useGetTeachers } from './api/api'
import type { EmployeeChecklistType } from './types'
import useDebounce from '@hooks/useDebounce'

interface FilterProps {
  showTeacherFilter?: boolean
}

export const Filter = ({ showTeacherFilter = true }: FilterProps) => {
  const router = useRouter()

  const initialSearchRef = useRef(String(router.query.search ?? ''))
  const [searchValue, setSearchValue] = useState<string>(initialSearchRef.current)
  const debouncedSearch = useDebounce(searchValue, 400)

  const [selectedTeacher, setSelectedTeacher] = useState<EmployeeChecklistType | null>(null)

  const { data: teachers, isLoading: isLoadingTeachers } = useGetTeachers(
    showTeacherFilter ? { role: 'teacher' } : null
  )

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleTeacherChange = (_: any, value: EmployeeChecklistType | null) => {
    setSelectedTeacher(value)
  }

  useEffect(() => {
    const currentParams = router.query
    const newParams: Record<string, string> = {}

    if (debouncedSearch) newParams.search = debouncedSearch
    if (selectedTeacher?.id) newParams.teacherId = String(selectedTeacher.id)

    const isSameQuery =
      currentParams.search === newParams.search &&
      currentParams.teacherId === newParams.teacherId

    if (isSameQuery) return

    void router.push(
      {
        pathname: router.pathname,
        query: newParams,
      },
      undefined,
      { shallow: true }
    )
  }, [debouncedSearch, selectedTeacher])

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <FormControl sx={{ width: '100%', maxWidth: 260 }}>
        <InputLabel size='small' id='search-input'>
          Qidirish
        </InputLabel>

        <OutlinedInput
          endAdornment={
            <InputAdornment position='end'>
              <Search size={18} />
            </InputAdornment>
          }
          label='Qidirish'
          id='search-input'
          placeholder='Qidirish...'
          size='small'
          value={searchValue}
          onChange={handleSearchChange}
        />
      </FormControl>

      {showTeacherFilter && (
        <FormControl sx={{ width: '100%', maxWidth: 260 }}>
          <Autocomplete
            size='small'
            disablePortal
            options={teachers?.results ?? []}
            getOptionLabel={(option) => option.first_name}
            loading={isLoadingTeachers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="O'qituvchi"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingTeachers ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            value={selectedTeacher}
            onChange={handleTeacherChange}
          />
        </FormControl>
      )}
    </Box>
  )
}
