import { useEffect, useRef, useState } from 'react'
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
  useMediaQuery
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { updateStudentParams } from 'src/store/apps/students'
import useCourses from 'src/hooks/useCourses'
import useDebounce from 'src/hooks/useDebounce'
import 'rsuite/Toggle/styles/index.css'
import api from 'src/@core/utils/api'
import { MetaTypes } from 'src/types/apps/groupsTypes'
import 'rsuite/DateRangePicker/styles/index.css'
import { DatePicker } from 'rsuite'
import { format } from 'date-fns'
import { fetchSchoolsList } from 'src/store/apps/settings'
import ceoConfigs from 'src/configs/ceo'
import { useRouter } from 'next/router'
import { Search } from 'lucide-react'

const StudentsFilter = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { queryParams } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [key, setKey] = useState<string>('')
  const { getCourses, courses } = useCourses()
  const [groups, setGroups] = useState<any>()
  const [teachers, setTeachers] = useState<any>()
  const { t } = useTranslation()

  const querySearch = new URLSearchParams(window.location.search).get('q')
  const [search, setSearch] = useState<string>(querySearch || '')
  const debounceSearch = useDebounce(search, 300)
  const [teacherId, setTeacherId] = useState<any>()
  const [groupId, setGroupId] = useState<any>()
  const isMobile = useMediaQuery('(max-width:564px)');
  const isInitialMount = useRef(true)
  const isUpdating = useRef(false)

  async function getGroups() {
    try {
      const res = await api.get(`common/group-check-list/?teacher=${teacherId || ''}`)
      setGroups(res.data)
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  async function getTeachers() {
    try {
      const res = await api.get(`${ceoConfigs.employee_checklist}?role=teacher&group=${groupId || ''}`)
      setTeachers(res.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  async function handleFilter(key: string, value: string | number | null) {
    isUpdating.current = true
    dispatch(updateStudentParams({ [key]: value }))

    if (key === 'debt_date') {
      dispatch(updateStudentParams({  debt_date: `${value}` }))
    } else if (key === 'amount') {
      if (value === 'is_debtor') {
        dispatch(updateStudentParams({ is_debtor: true, last_payment: '', not_in_debt: '' }))
      } else if (value === 'not_in_debt') {
        dispatch(updateStudentParams({ is_debtor: '', last_payment: '', not_in_debt: true }))
      } else if (value === 'last_payment') {
        dispatch(updateStudentParams({ last_payment: true, is_debtor: '', not_in_debt: '' }))
      } else if (value === 'all') {
        dispatch(updateStudentParams({ is_debtor: '', last_payment: '', not_in_debt: '' }))
      }
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      const {
        q,
        status,
        course,
        school,
        group_status,
        group,
        teacher,
        is_debtor,
        last_payment,
        not_in_debt,
        debt_date
      } = router.query
      const newParams = {
        search: (q as string) || '',
        status: (status as string) || '',
        course: (course as string) || '',
        school: (school as string) || '',
        group_status: (group_status as string) || '',
        group: (group as string) || '',
        teacher: (teacher as string) || '',
        is_debtor: (is_debtor as string) || '',
        last_payment: (last_payment as string) || '',
        not_in_debt: (not_in_debt as string) || '',
        debt_date: (debt_date as string) || ''
      }

      if (JSON.stringify(newParams) !== JSON.stringify(queryParams)) {
        isUpdating.current = true
        dispatch(updateStudentParams(newParams))
      }
      isInitialMount.current = false
    }
  }, [router.query, dispatch, queryParams])

  useEffect(() => {
    if (!isUpdating.current) {
      const { q, ...restQuery } = router.query


      if (debounceSearch && debounceSearch !== q) {
        void router.push(
          {
            pathname: '/students',
            query: { ...restQuery, q: debounceSearch }
          },
          undefined,
          { shallow: true }
        )
      } else if (!debounceSearch && q) {
        void router.push(
          {
            pathname: '/students',
            query: restQuery
          },
          undefined,
          { shallow: true }
        )
      }
    }
  }, [debounceSearch, router])

  useEffect(() => {
    isUpdating.current = false
  }, [])

  useEffect(() => {
    if (key === 'course') {
      void getCourses()
    } else if (key === 'group') {
      void getGroups()
    } else if (key === 'teacher') {
      void getTeachers()
    } else if (key === 'school') {
      dispatch(fetchSchoolsList())
    }
  }, [key, getCourses, dispatch])

  const groupOptions =
    groups?.map((item: MetaTypes) => ({
      label: item?.name,
      value: item?.id
    })) || []

  const teacherOptions =
    teachers?.map((item: any) => ({
      label: item?.first_name,
      value: item?.id
    })) || []

  return (
    <Box
      display='flex'
      gap={{ xs: 1, sm: 2 }}
      flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
      alignItems='center'
      justifyContent='space-between'
      width='100%'
    >
      <Box
        display='flex'
        width='100%'
        gap={{ xs: 1, sm: 1 }}
        flexWrap={{ sm: 'wrap', md: 'nowrap' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
      >
        <FormControl fullWidth>
          <InputLabel size='small' id='search-input'>
            {t('Qidirish')}
          </InputLabel>
          <OutlinedInput
            onChange={e => setSearch(e.target.value)}
            value={search}
            endAdornment={
              <InputAdornment position='end'>
                <Search size={18} />
              </InputAdornment>
            }
            label={t('Qidirish')}
            id='search-input'
            placeholder={t('Qidirish...')}
            size='small'
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel size='small' id='course-select-label'>
            {t('Kurslar')}
          </InputLabel>
          <Select
            size='small'
            onOpen={() => setKey('course')}
            label={t('Kurslar')}
            value={String(queryParams.course)}
            id='course-select'
            labelId='course-select-label'
            onChange={(e: SelectChangeEvent) => handleFilter('course', e.target.value || null)}
          >
            <MenuItem value=''>{t('Barchasi')}</MenuItem>
            {courses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel size='small' id='school-select-label'>
            {t('Maktab')}
          </InputLabel>
          <Select
            size='small'
            onOpen={() => setKey('school')}
            label={t('Maktab')}
            value={queryParams.school || ''}
            id='school-select'
            labelId='school-select-label'
            onChange={(e: SelectChangeEvent) => handleFilter('school', e.target.value || null)}
          >
            <MenuItem value=''>{t('Barchasi')}</MenuItem>
            {schools?.map((school: any) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel size='small' id='group-status-select-label'>
            {t('Guruhdagi holati')}
          </InputLabel>
          <Select
            size='small'
            onOpen={() => setKey('group_status')}
            label={t('Guruhdagi holati')}
            value={queryParams.group_status || ''}
            id='group-status-select'
            labelId='group-status-select-label'
            onChange={(e: SelectChangeEvent) => handleFilter('group_status', e.target.value)}
          >
            <MenuItem value=''>{t('Barchasi')}</MenuItem>
            <MenuItem value='active'>{t('active')}</MenuItem>
            <MenuItem value='new'>{t('test')}</MenuItem>
            <MenuItem value='frozen'>{t('frozen')}</MenuItem>
            <MenuItem value='not_activated'>{t('Sinov darsidan ketganlar')}</MenuItem>
            <MenuItem value='without_group'>{t('Guruhsiz')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel size='small' id='payment-status-select-label'>
            {t("To'lov holati")}
          </InputLabel>
          <Select
            size='small'
            onOpen={() => setKey('payment_status')}
            label={t("To'lov holati")}
            value={
              queryParams.is_debtor
                ? 'is_debtor'
                : queryParams.not_in_debt
                ? 'not_in_debt'
                : queryParams.last_payment
                ? 'last_payment'
                : ''
            }
            id='payment-status-select'
            labelId='payment-status-select-label'
            onChange={(e: SelectChangeEvent) => handleFilter('amount', e.target.value || 'all')}
          >
            <MenuItem value=''>{t('Barchasi')}</MenuItem>
            <MenuItem value='last_payment'>{t("To'lov vaqti yaqinlashgan")}</MenuItem>
            <MenuItem value='is_debtor'>{t('Qarzdor')}</MenuItem>
            <MenuItem value='not_in_debt'>{t("Qarzdor bo'lmagan")}</MenuItem>
          </Select>
        </FormControl>

        <div>
          <FormControl sx={{ width: !isMobile ? 180 : '100%', position: 'relative', mt: isMobile ? 3 : 0 }}>
            <InputLabel
              sx={{ position: 'absolute', top: -30, left: -10 }}
              size='small'
              id='demo-simple-select-outlined-label'
            >
              <p style={{ fontSize: 12 }}>{t('Oy kesimida balans')}</p>
            </InputLabel>
            <DatePicker
              cleanable={true}
              size='lg'
              placeholder='Oy va yil'
              format='MM/yyyy'
              onChange={value => {
                if (!value) {
                  void handleFilter('debt_date', '')
                } else {
                  void handleFilter('debt_date', format(value, 'MM-yyyy'))
                }
              }}
              shouldDisableDate={date => date?.getTime() > Date.now()}
            />
          </FormControl>
        </div>

        <FormControl fullWidth onClick={() => setKey('group')}>
          <Autocomplete
            loading={!groupOptions}
            disablePortal
            options={groupOptions}
            value={groupOptions.find((option: any) => option.value === queryParams.group_status) || null}
            onChange={(_, v) => {
              void handleFilter('group', v?.value || null)
              setGroupId(v?.value || null)
            }}
            size='small'
            renderInput={params => <TextField {...params} label={t('Guruh')} />}
          />
        </FormControl>

        <FormControl fullWidth onClick={() => setKey('teacher')}>
          <Autocomplete
            loading={!teacherOptions}
            sx={{ maxWidth: 180, width: '100%' }}
            disablePortal
            value={teacherOptions.find((option: any) => option.value === queryParams.teacher) || null}
            options={teacherOptions}
            onChange={(_, v) => {
              void handleFilter('teacher', v?.value || null)
              setTeacherId(v?.value || null)
            }}
            size='small'
            renderInput={params => <TextField {...params} label={t('Ustoz')} />}
          />
        </FormControl>
      </Box>
    </Box>
  )
}

export default StudentsFilter
