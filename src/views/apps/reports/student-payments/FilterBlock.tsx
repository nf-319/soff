import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent
} from '@mui/material'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateRangePicker } from 'rsuite'
import IconifyIcon from '../../../../components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import useDebounce from 'src/hooks/useDebounce'
import usePayment from 'src/hooks/usePayment'
import { formatDateString } from 'src/pages/finance'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentPaymentsList, GroupsPaymentType, updateParams } from 'src/store/apps/reports/studentPayments'
import { useGet } from '@hooks/useApi'

export default function FilterBlock() {
  const [search, setSearch] = useState<string>('')
  const { isMobile } = useResponsive()
  const { paymentMethods, getPaymentMethod } = usePayment()
  const { t } = useTranslation()
  const { groups, queryParams, teachersData } = useAppSelector(state => state.studentPayments)
  const { course_list } = useAppSelector(state => state.settings)
  const [teacher, setTeacher] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const [date, setDate] = useState<any>('')
  const searchVal = useDebounce(search, 800)
  const { data: roles } = useGet('employee/check-list/?roles=admin,ceo&type=employee')

  const memoizedQueryString = useMemo(() => {
    return new URLSearchParams({ ...queryParams, search: searchVal, page: '1' }).toString()
  }, [queryParams, searchVal])

  useEffect(() => {
    dispatch(updateParams({ search: searchVal, page: '1' }))
    dispatch(fetchStudentPaymentsList(memoizedQueryString))
  }, [memoizedQueryString])

  const handleChangeDate = async (e: any) => {
    if (e) {
      dispatch(
        updateParams({ start_date: `${formatDateString(e[0])}`, end_date: `${formatDateString(e[1])}`, page: '1' })
      )

      const queryString = new URLSearchParams({
        ...queryParams,
        start_date: `${formatDateString(e[0])}`,
        end_date: `${formatDateString(e[1])}`,
        page: '1'
      }).toString()
      await dispatch(fetchStudentPaymentsList(queryString))
    } else {
      dispatch(updateParams({ start_date: ``, end_date: ``, page: '1' }))
    }
    setDate(e)
  }

  const handleFilterGroup = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ group: e.target.value, page: '1' }))
  }

  const handleFilterTeacher = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ teacher: e.target.value, page: '1' }))
  }

  const handleFilterCourse = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ course: e.target.value, page: '1' }))
  }
  const handleFilterPayment = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ payment_type: e.target.value, page: '1' }))
  }

  const handleFilterBonus = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ bonus: e.target.value, page: '1' }))
  }

  const handleFilterRole = async (e: SelectChangeEvent<string>) => {
    dispatch(updateParams({ admin: e.target.value, page: '1' }))
  }

  const filterGroup = (group: GroupsPaymentType[]) => {
    const teacherGroup: GroupsPaymentType[] = teacher?.length ? group?.filter(e => teacher === e.teacher) : group

    return teacherGroup.map(group => (
      <MenuItem key={group.id} value={group.id}>
        {group.name}
      </MenuItem>
    ))
  }

  useLayoutEffect(() => {
    void getPaymentMethod()
  }, [])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        width: '100%',
      }}
    >
      <FormControl variant='outlined' size='small'>
        <InputLabel htmlFor='outlined-adornment-password'>{t('Qidirish')}</InputLabel>

        <OutlinedInput
          fullWidth
          sx={{ bgcolor: 'white' }}
          id='outlined-adornment-password'
          type='text'
          onChange={(e: any) => setSearch(e.target.value)}
          value={search}
          autoComplete='off'
          endAdornment={
            <InputAdornment position='end'>
              <IconifyIcon icon={'tabler:search'} />
            </InputAdornment>
          }
          label={t('Qidirish')}
        />
      </FormControl>

      <FormControl>
        <InputLabel size='small' id='group-filter-label'>
          {t('Guruhlar')}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Guruhlar')}
          value={queryParams.group || ''}
          id='group-filter'
          labelId='group-filter-label'
          onChange={handleFilterGroup}
        >
          <MenuItem value=''>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {filterGroup(groups)}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel size='small' id='group-filter-label'>
          {t('Tolov')}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Tolov')}
          value={queryParams.payment_type || ''}
          id='group-filter'
          labelId='group-filter-label'
          onChange={handleFilterPayment}
        >
          <MenuItem value=''>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {paymentMethods?.map((group: any) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel size='small' id='teacher-filter-label'>
          {t("O'qituvchilar")}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t("O'qituvchilar")}
          value={queryParams.teacher || ''}
          id='teacher-filter'
          labelId='teacher-filter-label'
          onChange={handleFilterTeacher}
        >
          <MenuItem value='' onClick={() => setTeacher(null)}>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {teachersData?.map((teacher: any) => (
            <MenuItem key={teacher.id} value={teacher.id} onClick={() => setTeacher(teacher.first_name)}>
              {teacher.first_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel size='small' id='course-filter-label'>
          {t('Kurslar')}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Kurslar')}
          value={queryParams.course || ''}
          id='course-filter'
          labelId='course-filter-label'
          onChange={handleFilterCourse}
        >
          <MenuItem value=''>
            <b>{t('Barchasi')}</b>
          </MenuItem>

          {course_list?.results?.map((course: any) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel size='small' id='group-filter-label'>
          {t('Oquvchi bonusi')}
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Oquvchi bonusi')}
          value={queryParams.bonus || ''}
          id='group-filter'
          labelId='group-filter-label'
          onChange={handleFilterBonus}
        >
          <MenuItem value=''>{t('Barchasi')}</MenuItem>
          <MenuItem value='1'>{t('Bonus olganlar')}</MenuItem>
        </Select>
      </FormControl>

      <DateRangePicker
        style={{ gridColumn: isMobile ? '1/3' : '' }}
        showOneCalendar
        placement='bottomEnd'
        locale={{
          last7Days: t('Oxirgi hafta'),
          sunday: t('Yak'),
          monday: t('Du'),
          tuesday: t('Se'),
          wednesday: t('Chor'),
          thursday: t('Pa'),
          friday: t('Ju'),
          saturday: t('Sha'),
          ok: t('Saqlash'),
          today: t('Bugun'),
          yesterday: t('Kecha'),
          hours: t('Soat'),
          minutes: t('Minut'),
          seconds: t('Sekund')
        }}
        format='dd/MM/yyyy'
        onChange={handleChangeDate}
        translate='yes'
        size='lg'
        value={date}
      />

      <FormControl>
        <InputLabel size='small' id='group-filter-label-roles'>
          Qabul qilgan xodim
        </InputLabel>

        <Select
          sx={{ bgcolor: 'white' }}
          size='small'
          label={t('Qabul qilgan xodim')}
          value={queryParams.admin || ''}
          id='group-filter-roles'
          labelId='group-filter-label-roles'
          onChange={handleFilterRole}
        >
          {roles?.length ? (
            roles.map((item: any) => <MenuItem value={item.id}>{item.first_name}</MenuItem>)
          ) : (
            <MenuItem>Malumot yo'q</MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  )
}
