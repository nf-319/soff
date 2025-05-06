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
  TextField,
  CircularProgress,
  Popper
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { updateStudentParams } from 'src/store/apps/students'
import useCourses from 'src/hooks/useCourses'
import useDebounce from 'src/hooks/useDebounce'
import api from 'src/@core/utils/api'
import { format } from 'date-fns'
import { fetchSchoolsList } from 'src/store/apps/settings'
import ceoConfigs from 'src/configs/ceo'
import { useRouter } from 'next/router'
import { Search } from 'lucide-react'
import { DatePicker } from '@components/DatePicker'

const StudentsFilter = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { queryParams } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [activeFilter, setActiveFilter] = useState('')
  const { getCourses, courses } = useCourses()
  const [groups, setGroups] = useState([])
  const [teachers, setTeachers] = useState([])
  const { t } = useTranslation()
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const querySearch = new URLSearchParams(window.location.search).get('q')
  const [search, setSearch] = useState(querySearch || '')
  const debounceSearch = useDebounce(search, 300)
  const [teacherId, setTeacherId] = useState('')
  const [groupId, setGroupId] = useState('')
  const [date, setDate] = useState<Date | null>(null)

  const isInitialMount = useRef(true)
  const isUpdating = useRef(false)

  const dataFetchedRef = useRef({
    courses: false,
    groups: false,
    teachers: false,
    schools: false
  })

  const getGroups = async () => {
    if (dataFetchedRef.current.groups) return

    try {
      setLoadingGroups(true)
      const queryParam = teacherId ? `?teacher=${teacherId}` : ''
      const res = await api.get(`common/group-check-list/${queryParam}`)
      setGroups(res.data)
      dataFetchedRef.current.groups = true
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoadingGroups(false)
    }
  }

  const getTeachers = async () => {
    if (dataFetchedRef.current.teachers) return

    try {
      setLoadingTeachers(true)
      const queryParam = groupId ? `?group=${groupId}` : ''
      const res = await api.get(`${ceoConfigs.employee_checklist}?role=teacher${queryParam}`)
      setTeachers(res.data)
      dataFetchedRef.current.teachers = true
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoadingTeachers(false)
    }
  }

  const handleFilter = (key: any, value: any) => {
    isUpdating.current = true

    let updatedParams: Record<any, any> = { [key]: value }

    if (key === 'debt_date') {
      updatedParams = { debt_date: value ? `${value}` : '' }
    } else if (key === 'amount') {
      if (value === 'is_debtor') {
        updatedParams = { is_debtor: true, last_payment: '', not_in_debt: '' }
      } else if (value === 'not_in_debt') {
        updatedParams = { is_debtor: '', last_payment: '', not_in_debt: true }
      } else if (value === 'last_payment') {
        updatedParams = { last_payment: true, is_debtor: '', not_in_debt: '' }
      } else if (value === 'all') {
        updatedParams = { is_debtor: '', last_payment: '', not_in_debt: '' }
      }
    } else if (value === '') {
      updatedParams = { [key]: null }
    }

    dispatch(updateStudentParams(updatedParams))

    if (key === 'teacher') {
      setTeacherId(value || '')
      dataFetchedRef.current.groups = false
    } else if (key === 'group') {
      setGroupId(value || '')
      dataFetchedRef.current.teachers = false
    }
  }

  const onDateChange = (newDate: Date | null) => {
    if (!newDate) {
      handleFilter('debt_date', '')
    } else {
      handleFilter('debt_date', format(newDate, 'MM-yyyy'))
    }
    setDate(newDate)
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
        search: (q || ''),
        status: (status || ''),
        course: (course || ''),
        school: (school || ''),
        group_status: (group_status || ''),
        group: (group || ''),
        teacher: (teacher || ''),
        is_debtor: (is_debtor || ''),
        last_payment: (last_payment || ''),
        not_in_debt: (not_in_debt || ''),
        debt_date: (debt_date || '')
      }

      if (JSON.stringify(newParams) !== JSON.stringify(queryParams)) {
        isUpdating.current = true
        dispatch(updateStudentParams(newParams))

        if (teacher) setTeacherId(String(teacher))
        if (group) setGroupId(String(group))
      }

      isInitialMount.current = false
    }
  }, [router.query, dispatch, queryParams])

  useEffect(() => {
    if (!isUpdating.current) {
      const { q, ...restQuery } = router.query

      if (debounceSearch && debounceSearch !== q) {
        router.push(
          {
            pathname: '/students',
            query: { ...restQuery, q: debounceSearch }
          },
          undefined,
          { shallow: true }
        )
      } else if (!debounceSearch && q) {
        router.push(
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
    if (activeFilter === 'course' && !dataFetchedRef.current.courses) {
      void getCourses()
      dataFetchedRef.current.courses = true
    } else if (activeFilter === 'group') {
      void getGroups()
    } else if (activeFilter === 'teacher') {
      void getTeachers()
    } else if (activeFilter === 'school' && !dataFetchedRef.current.schools) {
      dispatch(fetchSchoolsList())
      dataFetchedRef.current.schools = true
    }
  }, [activeFilter, getCourses, dispatch])

  const groupOptions = groups?.map((item: any) => ({
    label: item?.name,
    value: item?.id
  })) || []

  const teacherOptions = teachers?.map((item: any) => ({
    label: item?.first_name,
    value: item?.id
  })) || []

  return (
    <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={2} width='100%'>
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
          onOpen={() => setActiveFilter('course')}
          label={t('Kurslar')}
          value={queryParams.course || ''}
          id='course-select'
          labelId='course-select-label'
          onChange={e => handleFilter('course', e.target.value)}
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
          onOpen={() => setActiveFilter('school')}
          label={t('Maktab')}
          value={queryParams.school || ''}
          id='school-select'
          labelId='school-select-label'
          onChange={e => handleFilter('school', e.target.value)}
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
          label={t('Guruhdagi holati')}
          value={queryParams.group_status || ''}
          id='group-status-select'
          labelId='group-status-select-label'
          onChange={e => handleFilter('group_status', e.target.value)}
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
          onChange={e => handleFilter('amount', e.target.value || 'all')}
        >
          <MenuItem value=''>{t('Barchasi')}</MenuItem>
          <MenuItem value='last_payment'>{t("To'lov vaqti yaqinlashgan")}</MenuItem>
          <MenuItem value='is_debtor'>{t('Qarzdor')}</MenuItem>
          <MenuItem value='not_in_debt'>{t("Qarzdor bo'lmagan")}</MenuItem>
          <MenuItem value='not_in_debt'>{t("Ortiqcha to'lov")}</MenuItem>

        </Select>
      </FormControl>

      <FormControl fullWidth>
        <DatePicker
          label='Oy kesimida balans'
          value={date}
          onChange={onDateChange}
          format='MM/yyyy'
          views={['month', 'year']}
          disableFuture
          fullWidth
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          size='small'
          options={groupOptions}
          loading={loadingGroups}
          loadingText={t('Yuklanmoqda...')}
          noOptionsText={t("Ma'lumot topilmadi")}
          value={groupOptions.find(option => option.value === queryParams.group_status) || null}
          onOpen={() => setActiveFilter('group')}
          onChange={(_, v) => handleFilter('group', v?.value || '')}
          PopperComponent={props => <Popper {...props} style={{ ...props.style, width: 300 }} />}
          renderInput={params => (
            <TextField
              {...params}
              label={t('Guruh')}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingGroups ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      </FormControl>

      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          size='small'
          options={teacherOptions}
          loading={loadingTeachers}
          loadingText='Yuklanmoqda...'
          noOptionsText="Ma'lumot topilmadi"
          value={teacherOptions.find(option => option.value === queryParams.teacher) || null}
          onOpen={() => setActiveFilter('teacher')}
          onChange={(_, v) => handleFilter('teacher', v?.value || '')}
          PopperComponent={props => <Popper {...props} style={{ ...props.style, width: 300 }} />}
          renderInput={params => (
            <TextField
              {...params}
              label={t('Ustoz')}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingTeachers ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      </FormControl>
    </Box>
  )
}

export default StudentsFilter
