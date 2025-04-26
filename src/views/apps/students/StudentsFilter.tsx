import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Popper,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../../../components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { updateStudentParams } from 'src/store/apps/students'
import useCourses from 'src/hooks/useCourses'
import useDebounce from 'src/hooks/useDebounce'
import { Toggle } from 'rsuite'
import 'rsuite/Toggle/styles/index.css'
import api from 'src/@core/utils/api'
import { MetaTypes } from 'src/types/apps/groupsTypes'
import { ModalTypes, SendSMSModal } from './view/UserViewLeft'
import useSMS from 'src/hooks/useSMS'
import 'rsuite/DateRangePicker/styles/index.css'
import { DatePicker } from 'rsuite'
import { format } from 'date-fns'
import { fetchSchoolsList, fetchSmsList } from 'src/store/apps/settings'
import ExcelStudents from '../../../components/excelButton/ExcelStudents'
import ceoConfigs from 'src/configs/ceo'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import useResponsive from '@/@core/hooks/useResponsive'

type StudentsFilterProps = {
  students?: any[]
}

const StudentsFilter = ({ students }: StudentsFilterProps) => {
  const router = useRouter()
  const { isMobile } = useResponsive()
  const dispatch = useAppDispatch()
  const { queryParams } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [key, setKey] = useState<string>('')
  const { getCourses, courses } = useCourses()
  const [groups, setGroups] = useState<any>()
  const [teachers, setTeachers] = useState<any>()
  const [isActive, setIsActive] = useState<boolean>(true)
  const { t } = useTranslation()
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const { smsTemps, getSMSTemps } = useSMS()
  const querySearch = new URLSearchParams(window.location.search).get('q')
  const [search, setSearch] = useState<string>(querySearch || '')
  const debounceSearch = useDebounce(search, 300)
  const studentIds = students?.map(student => student.id)
  const [teacherId, setTeacherId] = useState<any>()
  const [groupId, setGroupId] = useState<any>()

  const handleEditClickOpen = (value: ModalTypes) => {
    setOpenEdit(value)
  }
  const queryString = new URLSearchParams({ ...queryParams } as Record<string, string>).toString()

  const handleEditClose = () => {
    setOpenEdit(null)
  }

  async function getGroups() {
    await api
      .get(`common/group-check-list/?teacher=${teacherId || ''}`)
      .then(res => setGroups(res.data))
      .catch(error => console.log(error))
  }
  async function getTeachers() {
    await api
      .get(`${ceoConfigs.employee_checklist}?role=teacher&group=${groupId || ''}`)
      .then(res => setTeachers(res.data))
      .catch(error => console.log(error))
  }

  async function handleFilter(key: string, value: string | number | null) {
    dispatch(updateStudentParams({ [key]: value }))

    if (key === 'status') {
      dispatch(updateStudentParams({ group_status: '', status: value, offset: 0 }))
    }
    if (key === 'debt_date') {
      setIsActive(false)
      dispatch(updateStudentParams({ debt_date: `${value}` }))
    } else if (key === 'amount') {
      dispatch(updateStudentParams({ debt_date: '' }))
      if (value === 'is_debtor') {
        setIsActive(false)
        dispatch(updateStudentParams({ is_debtor: true, last_payment: '', not_in_debt: '' }))
      } else if (value === 'not_in_debt') {
        setIsActive(false)
        dispatch(updateStudentParams({ is_debtor: '', last_payment: '', not_in_debt: true }))
      } else if (value === 'last_payment') {
        setIsActive(true)
        dispatch(updateStudentParams({ last_payment: true, is_debtor: '', not_in_debt: '' }))
      } else if (value === 'all') {
        setIsActive(true)
        dispatch(updateStudentParams({ is_debtor: '', last_payment: '', not_in_debt: '' }))
      }
    }
  }

  const StyledPopper = styled(Popper)({
    minWidth: '300px'
  })

  const TeacherPopper = styled(Popper)({
    minWidth: '200px'
  })

  useEffect(() => {
    const { q, ...restQuery } = router.query

    if (debounceSearch) {
      void router.push(
        {
          pathname: '/students',
          query: { ...restQuery, q: debounceSearch }
        },
        undefined,
        { shallow: true }
      )
    } else if (q) {
      void router.push(
        {
          pathname: '/students',
          query: restQuery
        },
        undefined,
        { shallow: true }
      )
    }
  }, [debounceSearch])

  useEffect(() => {
    if (key == 'course') {
      void getCourses()
    } else if (key == 'group') {
      void getGroups()
    } else if (key == 'teacher') {
      void getTeachers()
    } else if (key == 'school') {
      dispatch(fetchSchoolsList())
    }
  }, [key])

  const groupOptions = groups?.map((item: MetaTypes) => ({
    label: item?.name,
    value: item?.id
  }))

  const teacherOptions = teachers?.map((item: any) => ({
    label: item?.first_name,
    value: item?.id
  }))

  if (isMobile)
    <form id='mobile-filter-form'>
      <Box display={'flex'} gap={2} flexDirection={'column'} paddingTop={isMobile ? 3 : 0} rowGap={isMobile ? 4 : 0}>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel size='small' id='search-input'>
            {t('Qidirish')}
          </InputLabel>
          <OutlinedInput
            onChange={e => setSearch(e.target.value)}
            value={search}
            endAdornment={
              <InputAdornment position='end'>
                <IconifyIcon icon={'tabler:search'} />
              </InputAdornment>
            }
            label='Qidirish'
            id='search-input'
            placeholder='Qidirish...'
            size='small'
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Kurslar')}
          </InputLabel>
          <Select
            onOpen={() => setKey('course')}
            key={'course'}
            size='small'
            label={t('Kurslar')}
            defaultValue={''}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === '') {
                handleFilter('course', null)
              } else {
                handleFilter('course', e.target.value)
              }
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {courses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Maktab')}
          </InputLabel>

          <Select
            onOpen={() => setKey('school')}
            size='small'
            label={t('Maktab')}
            value={queryParams.school}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              handleFilter('school', e.target.value)
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {schools.map((school: any) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Guruhdagi holati')}
          </InputLabel>
          <Select
            onClick={() => setKey('group_status')}
            size='small'
            label={t('Guruhdagi holati')}
            value={queryParams.group_status}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => handleFilter('group_status', e.target.value)}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'active'}>{t('active')}</MenuItem>
            <MenuItem value={'new'}>{t('test')}</MenuItem>
            <MenuItem value={'frozen'}>{t('frozen')}</MenuItem>
            <MenuItem value={'not_activated'}>{t('Sinov darsidan ketganlar')}</MenuItem>
            <MenuItem value={'without_group'}>{t('Guruhsiz')}</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t("To'lov holati")}
          </InputLabel>
          <Select
            size='small'
            label={t("To'lov holati")}
            value={queryParams.is_debtor ? 'is_debtor' : Boolean(queryParams.last_payment) ? 'last_payment' : ''}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === 'is_debtor') {
                handleFilter('amount', 'is_debtor')
              } else if (e.target.value === 'last_payment') {
                handleFilter('amount', 'last_payment')
              } else if (e.target.value === 'not_in_debt') {
                handleFilter('amount', 'not_in_debt')
              } else {
                handleFilter('amount', 'all')
              }
            }}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'last_payment'}>{t("To'lov vaqti yaqinlashgan")}</MenuItem>
            <MenuItem value={'is_debtor'}>{t('Qarzdor')}</MenuItem>
            <MenuItem value={'not_in_debt'}>{t("Qarzdor bo'lmagan")}</MenuItem>
          </Select>
        </FormControl>

        {/* <FormControl fullWidth sx={{ position: 'relative' }}>
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
            // value={queryParams.debt_date ? new Date(queryParams.debt_date) : null}
            onChange={value => {
              if (!value) {
                void handleFilter('debt_date', '')
              } else {
                void handleFilter('debt_date', format(value, 'MM-yyyy'))
              }
            }}
            style={{ width: 180 }}
            shouldDisableDate={date => date?.getTime() > Date.now()}
          />
        </FormControl> */}

        <div onClick={() => setKey('group')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!groupOptions}
            disablePortal
            options={groupOptions || []}
            onChange={(e: any, v: any) => handleFilter('group', v?.value)}
            size='small'
            renderInput={params => <TextField {...params} label={t('Guruh')} />}
          />
        </div>
        <div onClick={() => setKey('group')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!teacherOptions}
            disablePortal
            options={teacherOptions || []}
            onChange={(e: any, v: any) => handleFilter('teacher', v?.value)}
            size='small'
            renderInput={params => <TextField {...params} label={t('Ustoz')} />}
          />
        </div>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Toggle
            checked={queryParams.status === 'archive'}
            color='red'
            checkedChildren={t('Arxiv')}
            unCheckedChildren={t('Arxiv')}
            onChange={e => {
              if (e) {
                handleFilter('status', 'archive')
              } else {
                handleFilter('status', 'active')
              }
            }}
          />
        </Box>
        <Button
          onClick={() => (getSMSTemps(), handleEditClickOpen('sms'))}
          variant='outlined'
          color='warning'
          fullWidth
          size='small'
          startIcon={<IconifyIcon icon='material-symbols-light:sms-outline' />}
        >
          {t('Sms yuborish')}
        </Button>
      </Box>
      <div onClick={() => dispatch(fetchSmsList())}>
        <SendSMSModal
          handleEditClose={handleEditClose}
          openEdit={openEdit}
          smsTemps={smsTemps}
          setOpenEdit={setOpenEdit}
          usersData={studentIds}
        />
      </div>
    </form>

  return (
    <Box display='flex' gap={2} alignItems='center' flexWrap={'wrap'} justifyContent='space-between' width='100%'>
      <Box display={'flex'} width='100%' gap={2} flexWrap={'nowrap'}>
        <FormControl sx={{ width: '100%', maxWidth: 260 }}>
          <InputLabel size='small' id='search-input'>
            {t('Qidirish')}
          </InputLabel>

          <OutlinedInput
            onChange={e => setSearch(e.target.value)}
            value={search}
            endAdornment={
              <InputAdornment position='end'>
                <IconifyIcon icon={'tabler:search'} />
              </InputAdornment>
            }
            label='Qidirish'
            id='search-input'
            placeholder='Qidirish...'
            size='small'
          />
        </FormControl>

        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Kurslar')}
          </InputLabel>

          <Select
            size='small'
            onOpen={() => setKey('course')}
            key={'course'}
            label={t('Kurslar')}
            defaultValue={''}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === '') {
                handleFilter('course', null)
              } else {
                handleFilter('course', e.target.value)
              }
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {courses.map(course => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Maktab')}
          </InputLabel>
          <Select
            onOpen={() => setKey('school')}
            size='small'
            label={t('Maktab')}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === '') {
                handleFilter('school', null)
              } else {
                handleFilter('school', e.target.value)
              }
            }}
          >
            <MenuItem value={''}>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            {schools?.map((school: any) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t('Guruhdagi holati')}
          </InputLabel>
          <Select
            size='small'
            onOpen={() => setKey('group_status')}
            label={t('Guruhdagi holati')}
            value={queryParams.group_status}
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => handleFilter('group_status', e.target.value)}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'active'}>{t('active')}</MenuItem>
            <MenuItem value={'new'}>{t('test')}</MenuItem>
            <MenuItem value={'frozen'}>{t('frozen')}</MenuItem>
            <MenuItem value={'not_activated'}>{t('Sinov darsidan ketganlar')}</MenuItem>
            <MenuItem value={'without_group'}>{t('Guruhsiz')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 180, width: '100%' }}>
          <InputLabel size='small' id='demo-simple-select-outlined-label'>
            {t("To'lov holati")}
          </InputLabel>
          <Select
            size='small'
            onClick={() => setKey('payment_status')}
            label={t("To'lov holati")}
            value={
              queryParams.is_debtor
                ? 'is_debtor'
                : queryParams.not_in_debt
                ? 'not_in_debt'
                : Boolean(queryParams.last_payment)
                ? 'last_payment'
                : ''
            }
            id='demo-simple-select-outlined'
            labelId='demo-simple-select-outlined-label'
            onChange={(e: any) => {
              if (e.target.value === 'is_debtor') {
                handleFilter('amount', 'is_debtor')
              } else if (e.target.value === 'last_payment') {
                handleFilter('amount', 'last_payment')
              } else if (e.target.value === 'not_in_debt') {
                handleFilter('amount', 'not_in_debt')
              } else {
                handleFilter('amount', 'all')
              }
            }}
          >
            <MenuItem value=''>
              <b>{t('Barchasi')}</b>
            </MenuItem>
            <MenuItem value={'last_payment'}>{t("To'lov vaqti yaqinlashgan")}</MenuItem>
            <MenuItem value={'is_debtor'}>{t('Qarzdor')}</MenuItem>
            <MenuItem value={'not_in_debt'}>{t("Qarzdor bo'lmagan")}</MenuItem>
          </Select>
        </FormControl>

        <div>
          <FormControl fullWidth sx={{ position: 'relative' }}>
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
              // value={queryParams.debt_date ? new Date(queryParams.debt_date) : null}
              onChange={value => {
                if (!value) {
                  void handleFilter('debt_date', '')
                } else {
                  void handleFilter('debt_date', format(value, 'MM-yyyy'))
                }
              }}
              style={{ width: 180 }}
              shouldDisableDate={date => date?.getTime() > Date.now()}
            />
          </FormControl>
        </div>

        <div onClick={() => setKey('group')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!groupOptions}
            options={groupOptions || []}
            onChange={(_: any, v: any) => {
              void handleFilter('group', v?.value)
              setGroupId(v?.value)
            }}
            PopperComponent={StyledPopper}
            size='small'
            renderInput={params => <TextField {...params} label='Guruh' />}
          />
        </div>
        <div onClick={() => setKey('teacher')} style={{ width: '100%' }}>
          <Autocomplete
            loading={!teacherOptions}
            disablePortal
            value={teacherOptions?.find((option: any) => option.value === queryParams.teacher) || null}
            options={teacherOptions || []}
            PopperComponent={TeacherPopper}
            onChange={(e: any, v: any) => {
              void handleFilter('teacher', v?.value)
              setTeacherId(v?.value)
            }}
            size='small'
            renderInput={params => <TextField {...params} label={t('Ustoz')} />}
          />
        </div>

        {isActive && (
          <Box sx={{ display: 'flex', alignItems: 'center', width: 180 }}>
            <Toggle
              checked={queryParams.status === 'archive'}
              color='red'
              checkedChildren={t('Arxiv')}
              unCheckedChildren={t('Arxiv')}
              onChange={e => {
                if (e) {
                  handleFilter('status', 'archive')
                } else {
                  handleFilter('status', 'active')
                }
              }}
            />
          </Box>
        )}
        <ExcelStudents
          tooltip='Ko‘rinib turgan jadvalni Excel faylga yuklab olish.'
          size='medium'
          url='/student/offset-list/'
          queryString={queryString}
        />
        <Button
          onClick={() => {
            void getSMSTemps()
            handleEditClickOpen('sms')
          }}
          variant='outlined'
          color='warning'
          fullWidth
          size='small'
          startIcon={<IconifyIcon icon='material-symbols-light:sms-outline' />}
        >
          <Tooltip title={t('Ro‘yxatdagi o‘quvchilarga SMS yuborish.')}>
            <span>{t('Sms yuborish')}</span>
          </Tooltip>
        </Button>
      </Box>

      <div onClick={() => dispatch(fetchSmsList())}>
        <SendSMSModal
          handleEditClose={handleEditClose}
          openEdit={openEdit}
          smsTemps={smsTemps}
          setOpenEdit={setOpenEdit}
          usersData={studentIds}
        />
      </div>
    </Box>
  )
}

export default StudentsFilter
