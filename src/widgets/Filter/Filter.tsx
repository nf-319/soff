'use client'

import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import { Box, FormControl, InputLabel, OutlinedInput, InputAdornment, TextField, CircularProgress, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { Search } from 'lucide-react'
import { useGetTeachers } from './api/api'
import type { EmployeeChecklistType } from './types'
import useDebounce from '@hooks/useDebounce'

interface FilterProps {
  showTeacherFilter?: boolean
}

export const Filter = ({ showTeacherFilter = true }: FilterProps) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState<string>(() => String(router.query.search ?? ''))
  const [selectedTeacher, setSelectedTeacher] = useState<EmployeeChecklistType | null>(null)
  const [teachers, setTeachers] = useState<EmployeeChecklistType[]>([])
  const [isTeacherListOpen, setIsTeacherListOpen] = useState(false)

  const debouncedSearch = useDebounce(searchValue, 400)

  const { isLoading: isLoadingTeachers, refetch: refetchTeacher } = useGetTeachers(
    showTeacherFilter && isTeacherListOpen ? { role: 'teacher' } : null,
  )

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await refetchTeacher()
      setTeachers(response.data?.results || [])
    } catch (error) {
      console.error('O‘qituvchilarni yuklashda xato:', error)
      setTeachers([])
    }
  }, [refetchTeacher])

  const handleTeacherListOpen = useCallback(() => {
    setIsTeacherListOpen(true)
    if (!teachers.length) {
      void fetchTeachers()
    }
  }, [fetchTeachers, teachers.length])

  const handleTeacherListClose = useCallback(() => {
    setIsTeacherListOpen(false)
  }, [])

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }, [])

  const handleTeacherChange = useCallback((_: any, value: EmployeeChecklistType | null) => {
    setSelectedTeacher(value)
  }, [])

  useEffect(() => {
    const currentParams = router.query
    const newParams: Record<string, string> = {}

    if (debouncedSearch) newParams.search = debouncedSearch
    if (selectedTeacher?.id) newParams.teacher = String(selectedTeacher.id)

    if (
      currentParams.search === newParams.search &&
      currentParams.teacherId === newParams.teacher
    ) {
      return
    }

    router.push(
      {
        pathname: router.pathname,
        query: newParams,
      },
      undefined,
      { shallow: true }
    )
  }, [debouncedSearch, selectedTeacher, router])

  const noOptionsText = useMemo(() => {
    if (isLoadingTeachers) return <CircularProgress size={20} />
    if (!teachers.length) return <Typography>Ma’lumot topilmadi</Typography>
    return <Typography>O‘qituvchilar mavjud emas</Typography>
  }, [isLoadingTeachers, teachers.length])

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <FormControl sx={{ width: '100%', maxWidth: 260 }}>
        <InputLabel size="small">Qidirish</InputLabel>
        <OutlinedInput
          endAdornment={
            <InputAdornment position="end">
              <Search size={18} />
            </InputAdornment>
          }
          label="Qidirish"
          placeholder="Qidirish..."
          size="small"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </FormControl>

      {showTeacherFilter && (
        <FormControl sx={{ width: '100%', maxWidth: 260 }}>
          <Autocomplete
            size="small"
            disablePortal
            open={isTeacherListOpen}
            onOpen={handleTeacherListOpen}
            onClose={handleTeacherListClose}
            options={teachers}
            getOptionLabel={(option) => option.first_name}
            loading={isLoadingTeachers}
            noOptionsText={noOptionsText}
            renderInput={(params) => (
              <TextField
                {...params}
                label="O‘qituvchi"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingTeachers && <CircularProgress color="inherit" size={20} />}
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
