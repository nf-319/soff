// @ts-nocheck
'use client'

import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip
} from '@mui/material'
import { useRouter } from 'next/router'

import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import Excel from '../../../components/excelButton/Excel'
import api from 'src/@core/utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setOnlineLessonLoading } from 'src/store/apps/groupDetails'
import { updateParams } from 'src/store/apps/groups'
import { useGetTeachers } from '@/shared/query-hooks/teachers/teachers'
import { useGetChecklistCourses } from '@/shared/query-hooks'
import { LaptopMinimal, Search } from 'lucide-react'
import useDebounce from '@hooks/useDebounce'
import { useEffect, useState } from 'react'
import useResponsive from '@/@core/hooks/useResponsive'

export const GroupsFilter = () => {
  const router = useRouter()
  const { query } = router
  const { isMobile } = useResponsive()
  const { queryParams } = useAppSelector(state => state.groups)
  const { onlineLessonLoading } = useAppSelector(state => state.groupDetails)
  const { data: teachersData } = useGetTeachers()
  const { data: courses } = useGetChecklistCourses()
  const [searchTerm, setSearchTerm] = useState(query.search || '')
  const search = useDebounce(searchTerm, 400)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  async function handleGetMeetLink() {
    dispatch(setOnlineLessonLoading(true))
    await api
      .get(`meets/google/login/`)
      .then(res => {
        if (res.data.url) {
          router.push(res.data.url)
        }
      })
      .catch(err => {
        toast.error(err.response.data.msg)
      })
    dispatch(setOnlineLessonLoading(false))
  }

  const handleChangeStatus = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ status: e.target.value }))
  }
  const handleChangeTeacher = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ teacher: e.target.value }))
  }
  const handleChangeCourse = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ course: e.target.value }))
  }
  const handleChangeDateOfWeek = (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ day_of_week: e.target.value }))
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  useEffect(() => {
    const handleQuery = () => {
      const newQuery = {...query}

      if(search) {
        newQuery.search = search
      } else {
        delete newQuery.search
      }

      void router.push({
        pathname: router.pathname,
        query: newQuery
      }, undefined, { shallow: true })
    }

    handleQuery()
  }, [search])

  useEffect(() => {
    dispatch(updateParams({ search }))
  }, [search])

  const queryString = new URLSearchParams({ ...queryParams }).toString()

  const options = teachersData?.map(item => ({
    label: item.first_name,
    value: item.id
  }))

  if (isMobile) {
    return (
      <form id='mobile-filter-form'>
        <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
          <FormControl sx={{ width: '100%', maxWidth: 260 }}>
            <InputLabel size='small' id='search-input'>
              {t('Qidirish')}
            </InputLabel>
            <OutlinedInput
              autoComplete='off'
              onChange={e => handleSearch(e.target.value)}
              value={searchTerm}
              endAdornment={
                <InputAdornment position='end'>
                  <Search size={18} />
                </InputAdornment>
              }
              label='Qidirish'
              id='search-input'
              placeholder='Qidirish...'
              size='small'
            />
          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Holat')}
            </InputLabel>
            <Select
              size='small'
              label={t('Holat')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.status || ''}
              onChange={handleChangeStatus}
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'active'}>{t('Aktiv')}</MenuItem>
              <MenuItem value={'archived'}>{t('archive')}</MenuItem>
              <MenuItem value={'new'}>{t('Sinov darsida')}</MenuItem>
              <MenuItem value={'frozen'}>{t('Muzlatilgan')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <Autocomplete
              onChange={(e, v) => handleChangeTeacher({ ...e, target: { ...e.target, value: v?.value || '' } })}
              size='small'
              placeholder={"O'qituvchi"}
              disablePortal
              options={options}
              renderInput={params => <TextField {...params} label={t("O'qituvchi")} />}
            />
          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kurslar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kurslar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.course || ''}
              onChange={handleChangeCourse}
              displayEmpty
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              {courses?.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kunlar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kunlar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.day_of_week || ''}
              onChange={handleChangeDateOfWeek}
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'tuesday,thursday,saturday'}>{t('Juft kunlari')}</MenuItem>
              <MenuItem value={'monday,wednesday,friday'}>{t('Toq kunlari')}</MenuItem>
              <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>{t('Har kuni')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </form>
    )
  } else
    return (
      <Box display={'flex'} gap={2} flexWrap={'nowrap'} alignItems='center' justifyContent='space-between' width='100%'>
        <Box display={'flex'} width='100%' gap={2} flexWrap={'nowrap'}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='search-input'>
              {t('Qidirish')}
            </InputLabel>
            <OutlinedInput
              onChange={e => handleSearch(e.target.value)}
              value={searchTerm}
              endAdornment={
                <InputAdornment position='end'>
                  <Search size={18} />
                </InputAdornment>
              }
              label='Qidirish'
              id='search-input'
              autoComplete='off'
              placeholder='Qidirish...'
              size='small'
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Holat')}
            </InputLabel>
            <Select
              size='small'
              label={t('Holat')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.status || ''}
              onChange={handleChangeStatus}
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'active'}>{t('active')}</MenuItem>
              <MenuItem value={'archived'}>{t('archive')}</MenuItem>
              <MenuItem value={'new'}>{t('new')}</MenuItem>
              <MenuItem value={'frozen'}>{t('frozen')}</MenuItem>
            </Select>
          </FormControl>
          {options?.length > 0 && (
            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                onChange={(e, v) => handleChangeTeacher({ ...e, target: { ...e.target, value: v?.value || '' } })}
                size='small'
                placeholder={"O'qituvchi"}
                disablePortal
                options={options}
                renderInput={params => <TextField {...params} label={t("O'qituvchi")} />}
              />
            </FormControl>
          )}
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kurslar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kurslar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.course || ''}
              onChange={handleChangeCourse}
            >
              <MenuItem value=''>
                <b>Barchasi</b>
              </MenuItem>
              {courses?.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kunlar')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kunlar')}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
              value={queryParams.day_of_week || ''}
              onChange={handleChangeDateOfWeek}
            >
              <MenuItem value=''>
                <b>{t('Barchasi')}</b>
              </MenuItem>
              <MenuItem value={'tuesday,thursday,saturday'}>{t('Juft kunlari')}</MenuItem>
              <MenuItem value={'monday,wednesday,friday'}>{t('Toq kunlari')}</MenuItem>
              <MenuItem value={'monday,tuesday,wednesday,thursday,friday,saturday,sunday'}>{t('Har kuni')}</MenuItem>
            </Select>
          </FormControl>
          <Excel
            tooltip='Ko‘rinib turgan jadvalni Excel fayliga yuklab oling.'
            url='common/groups/export/'
            queryString={queryString}
          />

          <Tooltip title={t('Online darsni boshlash uchun bosing.')}>
            <LoadingButton
              loading={onlineLessonLoading}
              color='success'
              variant='outlined'
              onClick={() => {
                void handleGetMeetLink()
              }}
            >
              <LaptopMinimal />
            </LoadingButton>
          </Tooltip>
        </Box>
      </Box>
    )
}
