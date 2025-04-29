//@ts-nocheck
import { Autocomplete, Box, Drawer, FormHelperText, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  getDashboardLessons,
  getMetaData,
  handleOpenAddModal,
  handleOpenEdit,
  resetFormParams,
  setRoomsData,
  setTeacherData,
  updateFormParams,
  updateGroup,
  updateParams
} from 'src/store/apps/groups'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Calendar from '../../views/apps/groups/Calendar'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import Router, { useRouter } from 'next/router'
import api from 'src/@core/utils/api'
import { useGet, usePost } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'
import { useQueryClient } from '@tanstack/react-query'
import {
  getAttendance,
  getDays,
  getGroupById,
  setGettingAttendance,
  setGettingGroupDetails
} from '@/store/apps/groupDetails'
import { getMontNumber } from '@/@core/utils/gwt-month-name'
import { Plus, X } from 'lucide-react'

type Props = {
  open: 'create' | 'edit' | null
  setOpen: (status: any) => void
}

export function GroupCreateEditDrawer({ open, setOpen }: Props) {
  const { isOpenAddGroup, groupData, queryParams, isOpenEdit, formParams, initialValues } = useAppSelector(
    state => state.groups
  )
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [customWeekdays, setCustomWeekDays] = useState<string[]>([])
  const { mutate, isPending } = usePost()
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { query } = useRouter()
  const { data: roomsData } = useGet('common/room-check-list/', { options: { enabled: !!open } })
  const { data: teachersData } = useGet(`${ceoConfigs.employee_checklist}?role=teacher`, {
    options: { enabled: !!open }
  })
  const { data: courses } = useGet('common/course/checklist/', { options: { enabled: !!open } })
  const validationSchema = Yup.object({
    name: Yup.string().required(t('Guruh nomini kiriting') || 'Guruh nomini kiriting'),
    course: Yup.string().required(t('Kursni tanlang') || 'Kursni tanlang'),
    teacher: Yup.string().required(t("O'qituvchini tanlang") || "O'qituvchini tanlang"),
    room: Yup.string().required(t('Xonani tanlang') || 'Xonani tanlang'),

    start_date: Yup.string().required(t('Boshlanish sanasini tanlang') || 'Boshlanish sanasini tanlang'),
    start_at: Yup.string().required(t('Boshlanish vaqtini tanlang') || 'Boshlanish vaqtini tanlang'),
    day_of_week: Yup.string().required(t('Dars kunlarini tanlang') || 'Dars kunlarini tanlang'),
    end_at: Yup.string().required(t('Tugash vaqtini tanlang') || 'Tugash vaqtini tanlang')
  })
  const updateValidationSchema = Yup.object({
    name: Yup.string().required(t('Guruh nomini kiriting')),
    course: Yup.string().required(t('Kursni tanlang')),
    teacher: Yup.string().required(t("O'qituvchini tanlang")),
    room: Yup.string().required(t('Xonani tanlang')),
    start_date: Yup.string().required(t('Boshlanish sanasini tanlang')),
    end_date: Yup.string().required(t('Tugash sanasini tanlang')),

    start_at: Yup.string().required(t('Boshlanish vaqtini tanlang')),
    day_of_week: Yup.string().required(t('Dars kunlarini tanlang')),
    end_at: Yup.string().required(t('Tugash vaqtini tanlang'))
  })

  const createFormik = () =>
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: async values => {
        dispatch(disablePage(true))
        let obj = { ...values }
        if (!values.day_of_week || values.day_of_week === '0') {
          obj = { ...obj, day_of_week: customWeekdays }
        } else {
          obj = {
            ...obj,
            day_of_week: values.day_of_week.split(',').map(day => day.trim())
          }
        }

        mutate(ceoConfigs.groups_create, obj, {
          onSuccess: () => {
            handleClose()
            toast.success(t('Guruh muvaffaqiyatli yaratildi') || 'Guruh muvaffaqiyatli yaratildi')
            queryClient.invalidateQueries({ queryKey: [ceoConfigs.groups, 'groups-list'] })
          },
          onError: err => {
            console.error('API xatosi:', err.response?.data)
            formik.setErrors(err.response?.data || { general: 'Server xatosi' })
          }
        })
        dispatch(disablePage(false))
      }
    })

  const updateFormik = () =>
    useFormik({
      initialValues,
      validationSchema: updateValidationSchema,
      onSubmit: async values => {
        setLoading(true)
        dispatch(disablePage(true))
        let obj = { ...values }

        if (!values.day_of_week || values.day_of_week === '0') {
          obj = { ...obj, day_of_week: customWeekdays }
        } else {
          obj = {
            ...obj,
            day_of_week: values.day_of_week.split(',').map(day => day.trim())
          }
        }

        if (queryParams?.is_recovery) {
          obj.status = 'active'
        }

        const response = await dispatch(
          updateGroup({
            id: groupData?.id,
            values: obj
          })
        )

        if (response.meta.requestStatus === 'rejected') {
          formik.setErrors(response.payload)
          toast.error(response.payload.msg || response.payload.end_date)
        } else {
          dispatch(updateParams({ is_recovery: false }))
          toast.success(t("O'zgrishlar muvafaqqiyati saqlandi"))
          handleClose()
          const queryString = new URLSearchParams(queryParams).toString()

          if (query?.id) {
            dispatch(setGettingAttendance(true))
            dispatch(setGettingGroupDetails(true))
            await Promise.all([
              dispatch(
                getDays({
                  date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
                  group: query.id
                })
              ),
              dispatch(getGroupById(query.id)),
              dispatch(
                getAttendance({
                  date: `${query?.year || new Date().getFullYear()}-${getMontNumber(query.month)}`,
                  group: query.id,
                  queryString: queryString
                })
              )
            ])
            dispatch(setGettingAttendance(false))
            dispatch(setGettingGroupDetails(false))
          } else {
            void queryClient.invalidateQueries({ queryKey: [ceoConfigs.groups, 'groups-list'] })
          }
          formik.resetForm()
        }

        setLoading(false)
        dispatch(disablePage(false))
      }
    })
  const formik = open == 'edit' ? updateFormik() : createFormik()

  const handleChangeField = async (
    name: string,
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement> | string | any
  ) => {
    formik.setFieldValue(name, event?.target?.value || event)
    if (name == 'teacher') {
      dispatch(updateFormParams({ teacher: event?.target?.value || event }))
      const queryString = new URLSearchParams({ ...formParams, teacher: event?.target?.value || event }).toString()
      await dispatch(getDashboardLessons(queryString))
    } else if (name == 'room') {
      dispatch(updateFormParams({ room: event?.target?.value || event }))
      const queryString = new URLSearchParams({ ...formParams, room: event?.target?.value || event }).toString()
      await dispatch(getDashboardLessons(queryString))
    } else if (name == 'day_of_week') {
      if (event.target.value != '0') {
        setCustomWeekDays([])
        dispatch(updateFormParams({ day_of_week: event?.target?.value || event }))
        const queryString = new URLSearchParams({
          ...formParams,
          day_of_week: event?.target?.value || event
        }).toString()
        await dispatch(getDashboardLessons(queryString))
      }
    }
  }

  const handleCustomWeek = async (el: ChangeEvent<HTMLInputElement>) => {
    const filtered = customWeekdays.includes(el.target.value)
      ? [...customWeekdays.filter(item => item !== el.target.value)]
      : [...customWeekdays, el.target.value]
    setCustomWeekDays(filtered)

    dispatch(updateFormParams({ day_of_week: filtered.toString() }))
    const queryString = new URLSearchParams({ ...formParams, day_of_week: filtered.toString() }).toString()
    await dispatch(getDashboardLessons(queryString))
  }

  const handleClose = () => {
    setOpen(null)
    formik.resetForm()
    dispatch(resetFormParams())
    setCustomWeekDays([])
  }

  useEffect(() => {
    if (groupData) {
      for (const [key, value] of Object.entries(groupData)) {
        if (key === 'course_data') {
          formik.setFieldValue('course', value?.id)
        }
        if (key == 'teacher_data') {
          formik.setFieldValue('teacher', value?.id)
          dispatch(updateFormParams({ teacher: value?.id }))
        }
        if (key == 'room_data') {
          formik.setFieldValue('room', value?.id)
          dispatch(updateFormParams({ room: value?.id }))
        }
        if (key === 'day_of_week') {
          const dayMapping = {
            'tuesday,thursday,saturday': 'tuesday,thursday,saturday',
            'monday,wednesday,friday': 'monday,wednesday,friday',
            'tuesday,thursday,saturday,monday,wednesday,friday': 'tuesday,thursday,saturday,monday,wednesday,friday'
          }
          const joinedValue = value.join(',')
          if (dayMapping[joinedValue]) {
            formik.setFieldValue(key, dayMapping[joinedValue])
            dispatch(updateFormParams({ day_of_week: dayMapping[joinedValue] }))
          } else {
            formik.setFieldValue(key, 0)
            setCustomWeekDays(value)
            dispatch(updateFormParams({ day_of_week: value.toString() }))
          }
        } else formik.setFieldValue(key, value)
      }
    }
  }, [groupData])

  return (
    <Drawer open={open} hideBackdrop anchor='right' variant='temporary' sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', width: '100vw' }}>
        <Calendar />
        <Box
          sx={{
            gridColumn: '4/5',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            className='customizer-header '
            sx={{
              top: 2,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              padding: 3,
              borderBottom: theme => `1px solid ${theme.palette.divider}`
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                color: 'text.secondary'
              }}
            >
              <IconButton onClick={handleClose}>
                <X fontSize={20} />
              </IconButton>
            </Box>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
              {open == 'create' ? t("Guruh qo'shish") : t("Guruh ma'lumotlarini tahrirlash")}
            </Typography>
          </Box>
          <Box width={'100%'}>
            <form
              onSubmit={formik.handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'baseline',
                padding: '20px 10px',
                gap: '10px'
              }}
            >
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  name='name'
                  size='small'
                  label={t('Guruh nomi')}
                  error={!!formik.errors.name && !!formik.touched.name}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FormHelperText error={!!formik.errors.name && !!formik.touched.name}>
                  {!!formik.errors.name && !!formik.touched.name && formik.errors.name}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t('Kurslar')}
                </InputLabel>
                <Select
                  size='small'
                  name='course'
                  label={t('Kurslar')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.course || ''}
                  error={!!formik.errors.course && !!formik.touched.course}
                >
                  {courses?.map(course => (
                    <MenuItem key={course.id} value={+course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                  <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/settings/office/courses')}>
                    {t('Yangi yaratish')}
                    <Plus size={20} />
                  </MenuItem>
                </Select>
                <FormHelperText error={!!formik.errors.course && !!formik.touched.course}>
                  {!!formik.errors.course && !!formik.touched.course && formik.errors.course}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t('Hafta kunlari')}
                </InputLabel>

                <Select
                  size='small'
                  label={t('Hafta kunlari')}
                  id='demo-simple-select-outlined'
                  name='day_of_week'
                  labelId='demo-simple-select-outlined-label'
                  onChange={e => handleChangeField('day_of_week', e)}
                  onBlur={formik.handleBlur}
                  error={!!formik.errors.day_of_week && !!formik.touched.day_of_week}
                  value={formik.values.day_of_week}
                >
                  <MenuItem value={`tuesday,thursday,saturday`}>{t('Juft kunlari')}</MenuItem>
                  <MenuItem value={`monday,wednesday,friday`}>{t('Toq kunlari')}</MenuItem>
                  <MenuItem value={`tuesday,thursday,saturday,monday,wednesday,friday`}>{t('Har kuni')}</MenuItem>
                  <MenuItem value={'0'}>{t('Boshqa')}</MenuItem>
                </Select>

                <FormHelperText error={!!formik.errors.day_of_week && !!formik.touched.day_of_week}>
                  {!!formik.errors.day_of_week && !!formik.touched.day_of_week && formik.errors.day_of_week}
                </FormHelperText>
              </FormControl>
              {formik.values.day_of_week == '0' ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(el => (
                    <label
                      key={el}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row-reverse',
                        border: '1px solid #c3cccc',
                        padding: '0 5px',
                        borderRadius: '7px',
                        gap: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{t(el)}</span>
                      <input type='checkbox' value={el} onChange={handleCustomWeek} />
                    </label>
                  ))}
                </Box>
              ) : (
                ''
              )}
              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t('Xona')}
                </InputLabel>
                <Select
                  size='small'
                  label={t('Xona')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='room'
                  onChange={e => handleChangeField('room', e)}
                  onBlur={formik.handleBlur}
                  value={formik.values.room}
                  error={!!formik.errors.room && !!formik.touched.room}
                >
                  {roomsData?.map((room: any) => (
                    <MenuItem key={room.id} value={+room.id}>
                      {room.name}
                    </MenuItem>
                  ))}
                  <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/settings/office/rooms')}>
                    {t('Yangi yaratish')}
                    <Plus size={20} />{' '}
                  </MenuItem>
                </Select>
                <FormHelperText error={!!formik.errors.room && !!formik.touched.room}>
                  {!!formik.errors.room && !!formik.touched.room && formik.errors.room}
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t("O'qituvchi")}
                </InputLabel>
                <Select
                  size='small'
                  label={t("O'qituvchi")}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='teacher'
                  disabled={!formik.values.room}
                  onChange={e => handleChangeField('teacher', e)}
                  onBlur={formik.handleBlur}
                  value={formik.values.teacher}
                  error={!!formik.errors.teacher && !!formik.touched.teacher}
                >
                  {teachersData?.map((teacher: any) => (
                    <MenuItem key={teacher.id} value={+teacher.id}>
                      {teacher.first_name}
                    </MenuItem>
                  ))}
                  <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/mentors')}>
                    {t('Yangi yaratish')}
                    <Plus size={20} />{' '}
                  </MenuItem>
                </Select>
                <FormHelperText error={!!formik.errors.teacher && !!formik.touched.teacher}>
                  {!!formik.errors.teacher && !!formik.touched.teacher && formik.errors.teacher}
                </FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField
                  size='small'
                  type='date'
                  label={t('Boshlanish sanasi')}
                  name='start_date'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.start_date}
                  error={!!formik.errors.start_date && !!formik.touched.start_date}
                />
                <FormHelperText error={!!formik.errors.start_date && !!formik.touched.start_date}>
                  {!!formik.errors.start_date && !!formik.touched.start_date && formik.errors.start_date}
                </FormHelperText>
              </FormControl>

              {open == 'edit' && (
                <FormControl sx={{ width: '100%' }}>
                  <TextField
                    size='small'
                    type='date'
                    label={t('Tugash sanasi')}
                    name='end_date'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.end_date}
                    error={!!formik.errors.end_date && formik.touched.end_date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FormHelperText error={!!formik.errors.end_date && formik.touched.end_date}>
                    {!!formik.errors.end_date && formik.touched.end_date && formik.errors.end_date}
                  </FormHelperText>
                </FormControl>
              )}

              <FormControl sx={{ width: '100%' }}>
                <TextField
                  size='small'
                  type='time'
                  label={t('Boshlanish vaqti')}
                  name='start_at'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.errors.start_at && !!formik.touched.start_at}
                  value={formik.values.start_at}
                  InputLabelProps={{ shrink: true }}
                />

                <FormHelperText error={!!formik.errors.start_at && !!formik.touched.start_at}>
                  {!!formik.errors.start_at && !!formik.touched.start_at && formik.errors.start_at}
                </FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField
                  size='small'
                  type='time'
                  label={t('Tugash vaqti')}
                  name='end_at'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={!!formik.errors.end_at && !!formik.touched.end_at}
                  value={formik.values.end_at}
                  InputLabelProps={{ shrink: true }}
                />
                <FormHelperText error={!!formik.errors.end_at && !!formik.touched.end_at}>
                  {!!formik.errors.end_at && !!formik.touched.end_at && formik.errors.end_at}
                </FormHelperText>
              </FormControl>

              <LoadingButton loading={isPending || loading} variant='contained' type='submit' fullWidth>
                {t('Saqlash')}
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
