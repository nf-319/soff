import { useRef, useState, useEffect, useCallback } from 'react'
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
import { Search } from 'lucide-react'
import { DatePicker } from '@components/DatePicker'
import ceoConfigs from 'src/configs/ceo'
import { StudentsQueryParamsTypes } from '@/types/apps/studentsTypes'
import { useRouter } from 'next/router'

const StudentsFilter = () => {
  const dispatch = useAppDispatch()
  const { queryParams } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [activeFilter, setActiveFilter] = useState('')
  const { getCourses, courses } = useCourses()
  const [groups, setGroups] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const { t } = useTranslation()
  const { query } = useRouter()
  const [loadingGroups, setLoadingGroups] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [teacherId, setTeacherId] = useState(queryParams.teacher || '')
  const [groupId, setGroupId] = useState(queryParams.group || '')
  const [month, year] = Array.isArray(query?.debt_date)
    ? query.debt_date[0].split('-')
    : (query?.debt_date ?? '').split('-')

  const parsedMonth = Number(month) - 1
  const parsedYear = Number(year)

  const [date, setDate] = useState<Date | null>(
    query?.debt_date && !isNaN(parsedMonth) && !isNaN(parsedYear) ? new Date(parsedYear, parsedMonth, 1) : null
  )

  const dataFetchedRef = useRef({
    courses: false,
    groups: false,
    teachers: false,
    schools: false
  })

  const getGroups = useCallback(async () => {
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
  }, [teacherId])

  const getTeachers = useCallback(async () => {
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
  }, [groupId])

  const handleFilter = useCallback(
    (key: keyof StudentsQueryParamsTypes | 'amount', value: any) => {
      let updatedParams: Partial<StudentsQueryParamsTypes> = { [key]: value }

      if (key === 'debt_date') {
        updatedParams = { debt_date: value ? format(value, 'MM-yyyy') : '' }
      } else if (key === 'amount') {
        if (value === 'is_debtor') {
          updatedParams = { is_debtor: true, last_payment: '', not_in_debt: '', is_overpaid: '' }
        } else if (value === 'not_in_debt') {
          updatedParams = { is_debtor: '', last_payment: '', not_in_debt: true, is_overpaid: '' }
        } else if (value === 'last_payment') {
          updatedParams = { last_payment: true, is_debtor: '', not_in_debt: '', is_overpaid: '' }
        } else if (value === 'is_overpaid') {
          updatedParams = { last_payment: '', is_debtor: '', not_in_debt: '', is_overpaid: true }
        } else if (value === 'all') {
          updatedParams = { is_debtor: '', last_payment: '', not_in_debt: '', is_overpaid: '' }
        }
      } else if (value === '') {
        updatedParams = { [key]: '' }
      }

      dispatch(updateStudentParams(updatedParams))

      if (key === 'teacher') {
        setTeacherId(value || '')
        dataFetchedRef.current.groups = false
      } else if (key === 'group') {
        setGroupId(value || '')
        dataFetchedRef.current.teachers = false
      }
    },
    [dispatch]
  )

  const onDateChange = useCallback(
    (newDate: Date | null) => {
      handleFilter('debt_date', newDate)
      setDate(newDate)
    },
    [handleFilter]
  )

  useEffect(() => {
    if (activeFilter === 'course' && !dataFetchedRef.current.courses) {
      getCourses()
      dataFetchedRef.current.courses = true
    } else if (activeFilter === 'group') {
      getGroups()
    } else if (activeFilter === 'teacher') {
      getTeachers()
    } else if (activeFilter === 'school' && !dataFetchedRef.current.schools) {
      dispatch(fetchSchoolsList())
      dataFetchedRef.current.schools = true
    }
  }, [activeFilter, getCourses, getGroups, getTeachers, dispatch])

  const groupOptions =
    groups?.map((item: any) => ({
      label: item?.name,
      value: item?.id
    })) || []

  const teacherOptions =
    teachers?.map((item: any) => ({
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
          onChange={e => handleFilter('search', e.target.value)}
          value={queryParams.search || ''}
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
          onChange={e => handleFilter('course', e.target.value || '')}
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
          onChange={e => handleFilter('school', e.target.value || '')}
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
          onChange={e => handleFilter('group_status', e.target.value || '')}
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
              : queryParams.is_overpaid
              ? 'is_overpaid'
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
          <MenuItem value='is_overpaid'>{t("Ortiqcha to'lov")}</MenuItem>
        </Select>
      </FormControl>

      {queryParams.is_debtor && (
        <FormControl fullWidth>
          <DatePicker
            label='Oy kesimida balans'
            value={date}
            onChange={onDateChange}
            format='MM/yyyy'
            views={['month']}
            disableFuture
            fullWidth
          />
        </FormControl>
      )}

      <FormControl fullWidth>
        <Autocomplete
          disablePortal
          size='small'
          options={groupOptions}
          loading={loadingGroups}
          loadingText={t('Yuklanmoqda...')}
          noOptionsText={t("Ma'lumot topilmadi")}
          value={groupOptions.find(option => option.value === queryParams.group) || null}
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
