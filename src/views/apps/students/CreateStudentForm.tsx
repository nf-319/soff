'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  debounce,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material'
import IconifyIcon from 'src/components/icon'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { today } from 'src/components/card-statistics/kanban-item'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { CreateStudentDto } from 'src/types/apps/studentsTypes'
import { createStudent, fetchGroupCheckList, setOpenEdit, updateStudentParams } from 'src/store/apps/students'
import { useAppDispatch, useAppSelector } from 'src/store'
import useResponsive from 'src/@core/hooks/useResponsive'
import PhoneInput from 'src/components/phone-input'
import { reversePhone } from 'src/components/phone-input/format-phone-number'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import Router from 'next/router'
import { TeacherAvatar, VisuallyHiddenInput } from '../mentors/AddMentorsModal'
import { useQueryClient } from '@tanstack/react-query'
import { Add, Remove } from '@mui/icons-material'
import { fetchSchoolsList } from 'src/store/apps/settings'
import { useGet } from '@/hooks/useApi'

export default function CreateStudentForm() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { groups, openEdit } = useAppSelector(state => state.students)
  const { schools } = useAppSelector(state => state.settings)
  const [image, setImage] = useState<any>(null)
  const profilePhoto: any = useRef(null)
  const [selected, setSelected] = useState<any[]>([])
  const { data: sourceData } = useGet('leads/statistic/', { options: { enabled: openEdit === 'create' } })
  const toggleSelection = (item: any) => {
    setSelected(prev => (prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]))
  }

  const { isMobile } = useResponsive()
  const [isGroup, setIsGroup] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const school_type = localStorage.getItem('school_type')

  const getGroups = async () => {
    await dispatch(fetchGroupCheckList(''))
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().required('Ismingizni kiriting'),
    phone: Yup.string().required('Telefon raqam kiriting'),
    birth_date: Yup.string(),
    parent_phone: Yup.string().nullable(),
    parent_first_name: Yup.string().nullable(),
    gender: Yup.string().required('Jinsini tanlang'),
    password: Yup.string(),
    source: Yup.string().nullable(),
    is_discount: Yup.boolean(),
    discount_amount: Yup.number().when('is_discount', {
      is: true,
      then: Yup.number().required('Chegirma miqdorini kiriting'),
      otherwise: Yup.number().nullable()
    })
  })

  const initialValues: CreateStudentDto = {
    first_name: '',
    phone: '',
    parent_first_name: '',
    image: '',
    school: '',
    parent_phone: '',
    contract_amount: 0,
    birth_date: today,
    gender: 'male',
    source: '',
    start_at: today,
    is_discount: false,
    discount_amount: 0
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: CreateStudentDto) => {
      setLoading(true)
      dispatch(disablePage(true))

      const newValues = new FormData()

      for (const [key, value] of Object.entries({ ...values, is_discount: isDiscount })) {
        if (key === 'phone' || key === 'parent_phone') {
          if (String(value).length > 5) {
            newValues.append(key, reversePhone(value as any))
          }
        } else {
          newValues.append(key, value as any)
        }
      }

      if (isDiscount) {
        newValues.append('discount_amount', String(values.discount_amount))
      }

      if (image) {
        newValues.append('image', image)
      }

      const resp = await dispatch(createStudent(newValues))

      console.log(resp)
      if (resp.meta.requestStatus === 'rejected') {
        formik.setErrors(resp.payload)
      } else {
        toast.success("O'quvchi muvaffaqiyatli yaratildi")
        await dispatch(updateStudentParams({ status: 'active' }))
        queryClient.invalidateQueries({ queryKey: ['student/new-list/', 'students-list'] })
        dispatch(setOpenEdit(null))
        formik.resetForm()
        setIsGroup(false)
      }
      dispatch(disablePage(false))
      setLoading(false)
    }
  })

  const { values, errors, touched, handleBlur, handleChange } = formik

  useEffect(() => {
    void getGroups()
    dispatch(fetchSchoolsList())
    return () => {
      formik.resetForm()
    }
  }, [])

  const handleSearch = useCallback(
    debounce(async (val: string) => {
      await dispatch(fetchGroupCheckList(val))
    }, 500),
    []
  )

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'baseline',
        padding: '20px 10px',
        gap: '10px',
        minWidth: isMobile ? '330px' : '400px'
      }}
    >
      <TeacherAvatar
        onClick={() => profilePhoto?.current?.click()}
        skin='light'
        color={'info'}
        variant='rounded'
        sx={{ cursor: 'pointer', margin: '0 auto 10px' }}
      >
        {image ? (
          <img
            width={100}
            height={100}
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            src={URL.createObjectURL(image)}
            alt=''
          />
        ) : (
          <IconifyIcon fontSize={40} icon={'material-symbols-light:add-a-photo-outline'} />
        )}
        <VisuallyHiddenInput
          onChange={e => setImage(e.target?.files?.[0])}
          ref={profilePhoto}
          type='file'
          accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic'
        />
      </TeacherAvatar>
      <FormControl sx={{ width: '100%' }}>
        <TextField
          size='small'
          label={t('first_name')}
          name='first_name'
          error={!!errors.first_name && touched.first_name}
          value={values.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.first_name && touched.first_name && <FormHelperText error={true}>{errors.first_name}</FormHelperText>}
      </FormControl>

      <FormControl sx={{ width: '100%' }}>
        <InputLabel error={!!errors.phone && touched.phone} htmlFor='outlined-adornment-password'>
          {t('phone')}
        </InputLabel>
        <PhoneInput
          id='outlined-adornment-password'
          label={t('phone')}
          name='phone'
          error={!!errors.phone && touched.phone}
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.phone && touched.phone && <FormHelperText error={true}>{errors.phone}</FormHelperText>}
      </FormControl>

      {school_type == 'private_school' && (
        <FormControl sx={{ width: '100%' }}>
          <TextField
            size='small'
            type='number'
            label={t('Kelishilgan summa')}
            name='contract_amount'
            error={!!errors.contract_amount && touched.contract_amount}
            value={values.contract_amount}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.contract_amount && touched.contract_amount && (
            <FormHelperText error={true}>{errors.contract_amount}</FormHelperText>
          )}
        </FormControl>
      )}

      <FormControl sx={{ width: '100%' }}>
        <TextField
          size='small'
          label={t('birth_date')}
          name='birth_date'
          type='date'
          error={!!errors.birth_date && touched.birth_date}
          value={values.birth_date}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormHelperText error={true}>{errors.birth_date}</FormHelperText>
      </FormControl>
      <FormControl sx={{ width: '100%' }}>
        <TextField
          size='small'
          label={t('password')}
          name='password'
          error={!!errors.password && touched.password}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormHelperText error={true}>{errors.password}</FormHelperText>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel size='small' id='user-view-language-label'>
          {t('Manba')}
        </InputLabel>

        <Select
          size='small'
          error={!!errors.source && touched.source}
          label={t('Guruhlar')}
          id='user-view-language'
          labelId='user-view-language-label'
          name='source'
          onChange={handleChange}
          value={values.source || ''}
          sx={{ mb: 3, maxWidth: isMobile ? 320 : 'auto' }}
        >
          {sourceData?.result?.map((source: any) => (
            <MenuItem key={source.id} value={Number(source.id)} sx={{ width: '500px' }}>
              {source.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <FormLabel>{t('Jinsini tanlang')}</FormLabel>
        <RadioGroup
          aria-labelledby='demo-controlled-radio-buttons-group'
          name='gender'
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <FormControlLabel value='male' control={<Radio />} label={t('Erkak')} />
            <FormControlLabel value='female' control={<Radio />} label={t('Ayol')} />
          </Box>
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth>
        <Box>
          <Accordion variant='outlined' expanded={selected.includes('group')} onChange={() => toggleSelection('group')}>
            <AccordionSummary expandIcon={selected.includes('group') ? <Remove /> : <Add />}>
              Guruhga qo'shish
            </AccordionSummary>
            <AccordionDetails>
              <FormControl style={{ display: 'grid', gap: '5px' }} fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t('Guruhlar')}
                </InputLabel>

                <Select
                  size='small'
                  error={!!errors.group && touched.group}
                  label={t('Guruhlar')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='group'
                  onChange={handleChange}
                  value={values.group || ''}
                  sx={{ mb: 3, maxWidth: isMobile ? 320 : 'auto' }}
                >
                  <MenuItem className='hover:bg-gray-100 cursor-not-allowed' sx={{ width: '500px' }}>
                    <TextField onChange={e => handleSearch(e.target.value)} label={'Qidiruv'} fullWidth size='small' />
                  </MenuItem>

                  {groups.map((group: any) => (
                    <MenuItem
                      key={group.id}
                      onClick={() => setIsGroup(true)}
                      value={Number(group.id)}
                      sx={{ width: '500px' }}
                    >
                      {group.name}
                    </MenuItem>
                  ))}

                  <MenuItem sx={{ fontWeight: 600, width: '500px' }} onClick={() => Router.push('/groups')}>
                    <IconifyIcon icon={'ion:add-sharp'} />
                    {t('Yangi yaratish')}
                  </MenuItem>
                </Select>
                {errors.group && <FormHelperText error={!!errors.group}>{errors.group}</FormHelperText>}

                <TextField
                  size='small'
                  label={t("Guruhga Qo'shilish sanasi")}
                  name='start_at'
                  type='date'
                  error={!!errors.start_at && touched.start_at}
                  value={values.start_at}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormHelperText error={true}>{errors.start_at}</FormHelperText>
              </FormControl>

              {isGroup && values?.group && (
                <Box className='w-full'>
                  {isDiscount && (
                    <div>
                      <TextField
                        size='small'
                        label={t('Alohida narx')}
                        name='discount_amount'
                        type='text'
                        error={!!errors.discount_amount}
                        value={
                          formik.values.discount_amount
                            ? new Intl.NumberFormat('uz-UZ', {
                                style: 'currency',
                                currency: 'UZS',
                                minimumFractionDigits: 0
                              }).format(Number(formik.values.discount_amount))
                            : ''
                        }
                        onChange={e => {
                          const rawValue = e.target.value.replace(/\D/g, '')
                          formik.setFieldValue('discount_amount', rawValue)
                        }}
                        onBlur={handleBlur}
                        fullWidth
                      />
                      <FormHelperText className='mb-2' error={true}>
                        {errors.discount_amount}
                      </FormHelperText>

                      <FormHelperText className='mb-2' error={true}>
                        {errors.discount_amount}
                      </FormHelperText>
                    </div>
                  )}

                  <Button
                    onClick={() => setIsDiscount(!isDiscount)}
                    type='button'
                    variant='outlined'
                    size='small'
                    color='warning'
                    sx={{ width: '100%' }}
                  >
                    {isDiscount ? "Alohida narxni o'chirish" : 'Alohida narx kiritish'}
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            variant='outlined'
            expanded={selected.includes('parent')}
            onChange={() => toggleSelection('parent')}
          >
            <AccordionSummary expandIcon={selected.includes('parent') ? <Remove /> : <Add />}>
              Ota-ona telefon raqamini qo'shish
            </AccordionSummary>
            <AccordionDetails>
              <>
                <FormControl sx={{ width: '100%', mb: 2 }}>
                  <InputLabel htmlFor='outlined-adornment-phone'>{t('Ota-ona telefon raqami')}</InputLabel>
                  <PhoneInput
                    id='outlined-adornment-phone'
                    label={t('Ota-ona telefon raqami')}
                    name='parent_phone'
                    value={values.parent_phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.parent_phone}
                  />
                  {errors.parent_phone && touched.parent_phone && (
                    <FormHelperText error={true}>{errors.parent_phone[0]}</FormHelperText>
                  )}
                </FormControl>
                <FormControl sx={{ width: '100%' }}>
                  <TextField
                    size='small'
                    label={t('Ota-ona ismi')}
                    name='parent_first_name'
                    error={!!errors.parent_first_name && touched.parent_first_name}
                    value={values.parent_first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
              </>
            </AccordionDetails>
          </Accordion>

          <Accordion
            variant='outlined'
            expanded={selected.includes('school')}
            onChange={() => toggleSelection('school')}
          >
            <AccordionSummary expandIcon={selected.includes('school') ? <Remove /> : <Add />}>
              Maktab qo'shish
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t('Maktab')}
                </InputLabel>
                <Select
                  size='small'
                  error={!!errors.school && touched.school}
                  label={t('Maktab')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='school'
                  onChange={handleChange}
                  value={values.school || ''}
                  sx={{ mb: 3 }}
                >
                  {schools.map((school: { id: number | string; name: string }) => (
                    <MenuItem key={school.id} value={Number(school.id)}>
                      {school.name}
                    </MenuItem>
                  ))}
                  <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/settings/office/schools')}>
                    {t('Yangi yaratish')}
                    <IconifyIcon icon={'ion:add-sharp'} />
                  </MenuItem>
                </Select>
                {errors.school && <FormHelperText error={!!errors.school}>{errors.school}</FormHelperText>}

                <FormHelperText error={true}>{errors.start_at}</FormHelperText>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Box>
      </FormControl>

      <LoadingButton loading={loading} variant='contained' type='submit' fullWidth>
        {t('Saqlash')}
      </LoadingButton>
    </form>
  )
}
