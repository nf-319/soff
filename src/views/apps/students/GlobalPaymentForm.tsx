'use client'

import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail, searchStudent, setGlobalPay, setStudentData } from 'src/store/apps/students'
import useDebounce from 'src/hooks/useDebounce'
import usePayment from 'src/hooks/usePayment'
import toast from 'react-hot-toast'
import { disablePage } from 'src/store/apps/page'
import IconifyIcon from '../../../components/icon'
import AmountInput, { formatAmount, revereAmount } from '../../../components/amount-input'
import { formatPhoneNumber } from '@components/phone-input/format-phone-number'
import useResponsive from '../../../@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import dayjs from 'dayjs'

export const today = new Date().toISOString()

type Student = {
  id: number
  first_name: string
  phone: string
  status: string
  student_status: { status: string; group_name: string }[]
}

type Group = {
  id: number
  name: string
  last_debt: number
  status: string
}

export const handleCheckPrint = async (id: number | string, iframeId: string = 'printFrame') => {
  try {
    const response = await api.get(`common/generate-check/${id}/`, {
      responseType: 'blob',
    })

    const blobUrl = URL.createObjectURL(response.data)
    const printFrame = document.getElementById(iframeId) as HTMLIFrameElement
    if (printFrame) {
      printFrame.src = blobUrl
      printFrame.onload = () => {
        printFrame.contentWindow?.focus()
        printFrame.contentWindow?.print()
      }
    } else {
      console.error('Iframe not found')
      toast.error('Chekni chop etishda xatolik yuz berdi')
    }
    return blobUrl
  } catch (error) {
    console.error('Print error:', error)
    toast.error('Chekni chop etishda xatolik yuz berdi')
    return null
  }
}

export default function GlobalPaymentForm() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { isMobile } = useResponsive()
  const { companyInfo } = useAppSelector((state: any) => state.user)
  const { studentData } = useAppSelector((state) => state.students)
  const { createPayment, paymentMethods, getPaymentMethod } = usePayment()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false)
  const [studentList, setStudentList] = useState<Student[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [groupData, setGroupData] = useState<Group | null>(null)
  const [step, setStep] = useState<'search' | 'pay' | 'print'>('search')
  const [receiptBlobUrl, setReceiptBlobUrl] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<number | string | null>(null)

  const validationSchema = Yup.object({
    search: Yup.string().min(4, t("Qidirish uchun ma'lumot yetarli emas")),
    amount: Yup.string().when('step', {
      is: 'pay',
      then: Yup.string().required(t('Summani aniq kiriting')),
    }),
    description: Yup.string().when('step', {
      is: 'pay',
      then: Yup.string().required(t('Izoh yozishingiz shart')),
    }),
    payment_date: Yup.string().when('step', {
      is: 'pay',
      then: Yup.string().required(t('Sana kiritish shart')),
    }),
    group: Yup.string().when('step', {
      is: 'pay',
      then: Yup.string().required(t('Guruh tanlash shart')),
    }),
    payment_type: Yup.string().when('step', {
      is: 'pay',
      then: Yup.string().required(t("To'lov turini tanlang")),
    }),
    bonus: Yup.string().when('step', {
      is: 'pay',
      then: Yup.string().optional(),
    }),
  })

  const initialValues = {
    search: '',
    amount: '',
    description: '',
    debt_amount: '',
    payment_date: today,
    group: '',
    payment_type: '',
    bonus: '',
    step: 'search',
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    initialTouched: {},
    onSubmit: async (values) => {
      if (values.step === 'search') {
        setLoading(true)
        const resp = await dispatch(searchStudent(values.search))
        if (!resp.payload?.length) {
          formik.setFieldError('search', t("O'quvchi topilmadi"))
        } else {
          setStudentList(resp.payload)
        }
        setLoading(false)
      } else if (values.step === 'pay') {
        setLoadingBtn(true)
        dispatch(disablePage(true))
        try {
          const data = {
            student: studentData?.id,
            amount: revereAmount(values.amount),
            description: values.description,
            debt_amount: revereAmount(values.debt_amount),
            payment_date: dayjs(values.payment_date).format("YYYY-MM-DD"),
            group: values.group,
            payment_type: values.payment_type,
            bonus: revereAmount(values.bonus || '0'),
          }
          const rep = await createPayment(data)
          setPaymentId(rep.id)
          const blobUrl = await handleCheckPrint(rep.id)
          setReceiptBlobUrl(blobUrl)
          setStep('print')
          toast.success(t('Tolov amalaga oshirildi'), { duration: 4000 })
          formik.resetForm({ values: initialValues })
        } catch (err: any) {
          const errorMessage = err?.response?.data?.message || t('Xatolik yuz berdi')
          formik.setErrors(err?.response?.data || { general: errorMessage })
          toast.error(errorMessage)
        } finally {
          setLoadingBtn(false)
          dispatch(disablePage(false))
        }
      }
    },
  })

  const debouncedSearch = useDebounce(formik.values.search, 500)

  const getGroups = async (studentId: number) => {
    try {
      const res = await api.get(`common/group-check-list/?student=${studentId}`)
      setGroups(res.data)
    } catch (error) {
      toast.error(t('Guruhlarni olishda xatolik'))
    }
  }

  const handleStudentSelect = async (student: Student) => {
    setLoading(true)
    try {
      await Promise.all([dispatch(fetchStudentDetail(student.id)), getGroups(student.id), getPaymentMethod()])
      setStudentList([student])
      setStep('pay')
      await formik.setFieldValue('step', 'pay')
      await formik.setTouched({ search: formik.touched.search, payment_date: false }, false)
      await formik.setValues({
        ...formik.values,
        search: '',
        amount: '',
        description: '',
        debt_amount: '',
        payment_date: today,
        group: '',
        payment_type: '',
        bonus: '',
        step: 'pay',
      })
    } catch (error) {
      toast.error(t('Maʼlumotlarni olishda xatolik'))
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    formik.resetForm({ values: initialValues })
    setStudentList([])
    setGroups([])
    setGroupData(null)
    setReceiptBlobUrl(null)
    setPaymentId(null)
    const printFrame = document.getElementById('printFrame') as HTMLIFrameElement
    if (printFrame) printFrame.src = ''
    dispatch(setStudentData(null))
    dispatch(setGlobalPay(false))
  }

  const handleReprint = async () => {
    if (paymentId) {
      const blobUrl = await handleCheckPrint(paymentId)
      setReceiptBlobUrl(blobUrl)
    } else {
      toast.error(t('Chekni qayta chop etish uchun to\'lov ID topilmadi'))
    }
  }

  useEffect(() => {
    if (debouncedSearch && !formik.errors.search && debouncedSearch.length >= 4) {
      formik.handleSubmit()
    }
  }, [debouncedSearch])

  useEffect(() => {
    if (groupData) {
      formik.setFieldValue('debt_amount', formatAmount(String(groupData.last_debt)))
    }
  }, [groupData])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={isMobile ? { width: '100%' } : { width: '450px' }}>
        <iframe
          id="printFrame"
          style={{ display: step === 'print' ? 'block' : 'none', width: '100%', height: '500px' }}
        />
        {step === 'search' || step === 'pay' ? (
          <form
            onSubmit={e => {
              e.preventDefault()
              formik.handleSubmit()
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {step === 'search' && (
              <FormControl fullWidth>
                <OutlinedInput
                  size="small"
                  placeholder={t("O'quvchini qidiring... (Ismi yoki telefon raqami)")}
                  name="search"
                  value={formik.values.search}
                  onChange={e => {
                    formik.handleChange(e)
                    if (e.target.value.length < 4) setStudentList([])
                  }}
                  onBlur={formik.handleBlur}
                  onPaste={e => {
                    const pastedValue = e.clipboardData.getData('text')
                    formik.setFieldValue('search', pastedValue)
                    if (pastedValue.length >= 4) {
                      setTimeout(() => formik.handleSubmit(), 600)
                    }
                  }}
                />
                {formik.touched.search && formik.errors.search && (
                  <FormHelperText error>{formik.errors.search}</FormHelperText>
                )}
              </FormControl>
            )}

            {loading && <CircularProgress sx={{ margin: '30px auto', display: 'block' }} size={30} />}

            {studentList.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {studentList.map(student => (
                  <Alert
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    sx={{ padding: '0 10px', cursor: 'pointer', margin: '0', fontWeight: 600 }}
                    color="info"
                    variant="outlined"
                    icon={<IconifyIcon icon="mdi:account-student" />}
                  >
                    {student.first_name} | {formatPhoneNumber(student.phone)} |{' '}
                    {student.status === 'active'
                      ? 'Faol'
                      : student.status === 'archive'
                        ? 'Arxilangan'
                        : student.status === 'new'
                          ? 'Yangi'
                          : 'Muzlatilgan'}
                  </Alert>
                ))}
              </Box>
            )}

            {step === 'pay' && (
              <>
                <FormControl fullWidth>
                  <InputLabel size="small" error={formik.touched.group && Boolean(formik.errors.group)}>
                    {t('Qaysi guruh uchun?')}
                  </InputLabel>
                  <Select
                    size="small"
                    label={t('Qaysi guruh uchun?')}
                    name="group"
                    value={formik.values.group}
                    onChange={e => {
                      const selectedGroup = groups.find(g => g.id === Number(e.target.value))
                      formik.handleChange(e)
                      setGroupData(selectedGroup || null)
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.group && Boolean(formik.errors.group)}
                  >
                    {groups.map(group => (
                      <MenuItem key={group.id} value={group.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Typography variant="subtitle1">{group.name}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.group && formik.errors.group && (
                    <FormHelperText error>{formik.errors.group}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel size="small" error={formik.touched.payment_type && Boolean(formik.errors.payment_type)}>
                    {t('To\'lov turi')}
                  </InputLabel>
                  <Select
                    size="small"
                    label={t('To\'lov turi')}
                    name="payment_type"
                    value={formik.values.payment_type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.payment_type && Boolean(formik.errors.payment_type)}
                  >
                    {paymentMethods.map((method: any) => (
                      <MenuItem key={method.id} value={method.id}>
                        {method.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.payment_type && formik.errors.payment_type && (
                    <FormHelperText error>{formik.errors.payment_type}</FormHelperText>
                  )}
                </FormControl>

                {companyInfo?.extra_settings?.allow_debt_editing_on_payment && groupData && (
                  <FormControl fullWidth>
                    <AmountInput
                      size="small"
                      label={t('Qarzdorlik summasi')}
                      name="debt_amount"
                      value={formik.values.debt_amount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.debt_amount && Boolean(formik.errors.debt_amount)}
                    />
                    {formik.touched.debt_amount && formik.errors.debt_amount && (
                      <FormHelperText error>{formik.errors.debt_amount}</FormHelperText>
                    )}
                  </FormControl>
                )}

                <FormControl fullWidth>
                  <AmountInput
                    size="small"
                    label={t('Summa')}
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <FormHelperText error>{formik.errors.amount}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    size="small"
                    label={t("O'quvchiga bonus (pul miqdorida)")}
                    name="bonus"
                    value={formik.values.bonus ? formatAmount(formik.values.bonus) : ''}
                    onChange={e => {
                      const rawValue = e.target.value.replace(/\D/g, '')
                      formik.setFieldValue('bonus', rawValue || '')
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bonus && Boolean(formik.errors.bonus)}
                  />
                  {formik.touched.bonus && formik.errors.bonus && (
                    <FormHelperText error>{formik.errors.bonus}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    size="small"
                    label={t('Izoh')}
                    rows={4}
                    multiline
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <FormHelperText error>{formik.errors.description}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <DateTimePicker
                    label={t('Sana')}
                    value={formik.values.payment_date ? new Date(formik.values.payment_date) : null}
                    onChange={newValue => {
                      formik.setFieldValue('payment_date', newValue ? new Date(newValue).toISOString() : '')
                      formik.setFieldTouched('payment_date', true, false)
                    }}
                    disablePast
                    format="dd/MM/yyyy HH:mm"
                    ampm={false}
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: formik.touched.payment_date && Boolean(formik.errors.payment_date),
                      },
                    }}
                  />
                  {formik.touched.payment_date && formik.errors.payment_date && (
                    <FormHelperText error>{formik.errors.payment_date}</FormHelperText>
                  )}
                </FormControl>

                <LoadingButton
                  loading={loadingBtn}
                  sx={{ mt: '20px' }}
                  variant="contained"
                  onClick={() => formik.handleSubmit()}
                >
                  {t('To\'lov qilish')}
                </LoadingButton>
              </>
            )}
          </form>
        ) : (
          <Box style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Typography sx={{ fontSize: '20px', textAlign: 'center', whiteSpace: 'break-spaces' }}>
              {t('Iltimos chekni talab qiluvchiga berishni unutmang')}
            </Typography>

            <LoadingButton
              loading={loadingBtn}
              sx={{ mt: '20px' }}
              onClick={handleClose}
              variant="contained"
            >
              {t('Yakunlash')}
            </LoadingButton>

            <LoadingButton
              sx={{ mt: '10px' }}
              variant="outlined"
              onClick={handleReprint}
            >
              {t('Chekni qayta chop etish')}
            </LoadingButton>
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  )
}
