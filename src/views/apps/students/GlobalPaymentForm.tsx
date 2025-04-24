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
  Typography
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import useDebounce from 'src/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail, searchStudent } from 'src/store/apps/students'
import * as Yup from 'yup'
import IconifyIcon from '../../../components/icon'
import { today } from '@components/card-statistics/kanban-item'
import AmountInput, { revereAmount } from '../../../components/amount-input'
import LoadingButton from '@mui/lab/LoadingButton'
import usePayment from 'src/hooks/usePayment'
import toast from 'react-hot-toast'
import { disablePage } from 'src/store/apps/page'
import { formatPhoneNumber } from '@components/phone-input/format-phone-number'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import useResponsive from '../../../@core/hooks/useResponsive'
import { handleCheckDownload } from '@/views/apps/students/view/UserViewPage'

export default function GlobalPaymentForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false)
  const [studentList, setStudentList] = useState<any[]>([])
  const [step, setStep] = useState<'search' | 'pay' | 'print'>('search')
  const { t } = useTranslation()
  const { companyInfo } = useAppSelector((state: any) => state.user)
  const [groups, setGroups] = useState([])
  const [isCheckId, setIsCheckId] = useState<any>()
  const [groupData, setGroupData] = useState<any>(null)
  const dispatch = useAppDispatch()
  const { isMobile } = useResponsive()
  const { studentData } = useAppSelector(state => state.students)
  const { createPayment, paymentMethods, getPaymentMethod } = usePayment()

  async function getGroups(student: number) {
    await api
      .get(`common/group-check-list/?student=${student}`)
      .then(res => setGroups(res.data))
      .catch(error => console.log(error))
  }

  const userData: any = { ...studentData }

  const validationSchema = Yup.object({
    search: Yup.string().min(4, "Qidirish uchun ma'lumot yetarli emas")
  })

  const handleCheckPrint = async (id: number | string) => {
    try {
      const response = await api.get(`common/generate-check/${id}/`, {
        responseType: 'blob',
      })

      const blobUrl = URL.createObjectURL(response.data)

      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'
      iframe.src = blobUrl

      document.body.appendChild(iframe)

      iframe.onload = () => {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      }
    } catch (error) {
      console.error('Check chiqarishda xatolik:', error)
      toast.error("Check chiqarishda xatolik yuz berdi")
    }
  }

  const initialValues = {
    search: ''
  }

  const validationSchemaPay = Yup.object({
    amount: Yup.string().required(t('Summani aniq kiriting') as string),
    description: Yup.string().required(t('Izoh yozishingiz shart') as string),
    payment_date: Yup.string().required(t('Sana kiritish shart') as string),
    group: Yup.string().required(t('Guruh tanlash shart') as string),
    payment_type: Yup.string().required(t("To'lov turini tanlang") as string)
  })

  const initialValuesPay = {
    amount: '',
    description: '',
    debt_amount: groupData?.last_debt,
    payment_date: today,
    group: '',
    payment_type: '',
    bonus: '0'
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async () => {}
  })

  const payform = useFormik({
    initialValues: initialValuesPay,
    validationSchema: validationSchemaPay,
    onSubmit: async values => {
      setLoadingBtn(true)
      dispatch(disablePage(true))
      const data = {
        ...values,
        debt_amount: values.debt_amount,
        student: userData?.id,
        amount: revereAmount(values.amount)
      }
      try {
        const res = await createPayment(data)
        setIsCheckId(res.id)
        setStep('print')
        setLoadingBtn(false)
        toast.success("Tolov amalaga oshirildi")
      } catch (err: any) {
        if (err?.respnse?.data) {
          payform.setErrors(err?.respnse?.data)
        }
        setLoadingBtn(false)
      }
      dispatch(disablePage(false))
    }
  })

  const search = useDebounce(formik.values.search, 1000)

  const handleSearch = async () => {
    setLoading(true)
    const resp = await dispatch(searchStudent(search))
    if (!resp.payload?.length) {
      formik.setFieldError('search', t("O'quvchi topilmadi"))
    }
    setStudentList(resp.payload)
    setLoading(false)
  }

  const clickStudent = async (item: any) => {
    setStudentList([])
    setLoading(true)
    void getGroups(item.id)
    await dispatch(fetchStudentDetail(item.id))
    await getPaymentMethod()
    setStudentList([item])
    setStep('pay')
    setLoading(false)
  }

  useEffect(() => {
    setStudentList([])
    if (!formik.errors.search && search) {
      void handleSearch()
    }
  }, [search])

  const formatNumber = (num: any) => {
    return new Intl.NumberFormat('uz-UZ').format(num)
  }

  return (
    <Box sx={isMobile ? { width: '100%' } : { width: '450px' }}>
      {step === 'search' || step === 'pay' ? (
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {step === 'search' && (
            <FormControl fullWidth>
              <OutlinedInput
                size='small'
                placeholder={t("O'quvchini qidiring... (Ismi yoki telefon raqami)")}
                name='search'
                fullWidth
                value={formik.values.search}
                onChange={e => (setStudentList([]), formik.handleChange(e))}
                onBlur={formik.handleBlur}
              />
              {!!formik.errors.search && formik.touched.search && (
                <FormHelperText error>{formik.errors.search}</FormHelperText>
              )}
            </FormControl>
          )}

          {loading ? <CircularProgress sx={{ margin: '30px auto', display: 'block' }} size={30} /> : ''}
          {studentList.length > 0 && (
            <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '5px' }}>
              {studentList.map(student => (
                <Alert
                  onClick={() => clickStudent(student)}
                  sx={{ padding: '0 10px', cursor: 'pointer', margin: '0', fontWeight: 600 }}
                  color='info'
                  variant='outlined'
                  icon={<IconifyIcon icon={'mdi:account-student'} />}
                >
                  {student.first_name} | {formatPhoneNumber(student.phone)} |{' '}
                  {student.student_status?.filter((el: any) => el.status === 'active')[0]?.group_name || ''}
                </Alert>
              ))}
            </Box>
          )}

          {step === 'pay' && (
            <FormControl fullWidth>
              <InputLabel
                size='small'
                id='user-view-language-label'
                error={!!payform.errors.group && payform.touched.group}
              >
                {t('Qaysi guruh uchun?')}
              </InputLabel>
              <Select
                size='small'
                label={t('Qaysi guruh uchun?')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='group'
                error={!!payform.errors.group && payform.touched.group}
                value={payform.values.group}
                onChange={payform.handleChange}
                onBlur={payform.handleBlur}
              >
                {!groups?.length ? (
                  <MenuItem
                    sx={{
                      userSelect: 'none',
                      cursor: 'default',
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    <Typography variant='subtitle1'>Guruh mavjud emas</Typography>
                  </MenuItem>
                ) : (
                  groups?.map((group: any) => (
                    <MenuItem
                      onClick={() => {
                        setGroupData(group)
                        payform.setFieldValue('debt_amount', group.last_debt)
                      }}
                      key={group.id}
                      value={group.id}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Typography variant='subtitle1'>{group.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {!!payform.errors.group && payform.touched.group && (
                <FormHelperText error>{payform.errors.group}</FormHelperText>
              )}
            </FormControl>
          )}

          {step === 'pay' && (
            <FormControl fullWidth>
              <InputLabel
                size='small'
                id='user-view-language-label'
                error={!!payform.errors.group && payform.touched.group}
              >
                {t("To'lov turi")}
              </InputLabel>
              <Select
                size='small'
                label={t("To'lov turi")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='payment_type'
                error={!!payform.errors.payment_type && payform.touched.payment_type}
                value={payform.values.payment_type}
                onChange={payform.handleChange}
                onBlur={payform.handleBlur}
              >
                {paymentMethods.map((branch: any) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
              {!!payform.errors.payment_type && payform.touched.payment_type && (
                <FormHelperText error>{payform.errors.payment_type}</FormHelperText>
              )}
            </FormControl>
          )}
          {companyInfo.extra_settings.allow_debt_editing_on_payment == true && groupData && (
            <FormControl fullWidth>
              <AmountInput
                id='user-view-language'
                size='small'
                label={t('Qarzdorlik summasi')}
                error={!!payform.errors.debt_amount && Boolean(payform.touched.debt_amount)}
                name='debt_amount'
                value={payform.values.debt_amount}
                onChange={payform.handleChange}
                onBlur={payform.handleBlur}
              />
              {!!payform.errors.debt_amount && payform.touched.debt_amount && (
                <FormHelperText error>{Boolean(payform.errors.debt_amount)}</FormHelperText>
              )}
            </FormControl>
          )}
          {step === 'pay' && (
            <>
              <FormControl fullWidth>
                <AmountInput
                  size='small'
                  placeholder={t('Summa')}
                  error={!!payform.errors.amount && payform.touched.amount}
                  name='amount'
                  value={payform.values.amount}
                  onChange={payform.handleChange}
                  onBlur={payform.handleBlur}
                />
                {!!payform.errors.amount && payform.touched.amount && (
                  <FormHelperText error>{payform.errors.amount}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  rows={4}
                  type='text'
                  label="O'quvchiga bonus (pul miqdorida)"
                  name='bonus'
                  size='small'
                  value={payform.values.bonus ? `${formatNumber(payform.values.bonus)}` : '0'}
                  onChange={e => {
                    const rawValue = e.target.value.replace(/\D/g, '')
                    payform.handleChange({ target: { name: 'bonus', value: rawValue } })
                  }}
                  onBlur={payform.handleBlur}
                />
              </FormControl>
            </>
          )}

          {step === 'pay' && (
            <FormControl fullWidth>
              <TextField
                size='small'
                placeholder={t('Izoh')}
                rows={4}
                error={!!payform.errors.description && payform.touched.description}
                multiline
                name='description'
                value={payform.values.description}
                onChange={payform.handleChange}
                onBlur={payform.handleBlur}
              />
              {!!payform.errors.description && payform.touched.description && (
                <FormHelperText error>{payform.errors.description}</FormHelperText>
              )}
            </FormControl>
          )}

          {step === 'pay' && (
            <FormControl fullWidth>
              <TextField
                type='date'
                size='small'
                placeholder={t('Sana')}
                error={!!payform.errors.payment_date && payform.touched.payment_date}
                name='payment_date'
                value={payform.values.payment_date}
                onChange={payform.handleChange}
                onBlur={payform.handleBlur}
              />
              {!!payform.errors.payment_date && payform.touched.payment_date && (
                <FormHelperText error>{payform.errors.payment_date}</FormHelperText>
              )}
            </FormControl>
          )}

          {step === 'pay' && (
            <LoadingButton
              loading={loadingBtn}
              sx={{ mt: '20px' }}
              onClick={() => payform.handleSubmit()}
              variant='contained'
            >
              {t("To'lov qilish")}
            </LoadingButton>
          )}
        </form>
      ) : (
        <Box onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Typography variant='h6' sx={{ textAlign: 'center', color: '#757575' }}>
            Ilitmos chekni talab qiluvchiga berishni unutmang!
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <LoadingButton loading={loadingBtn} onClick={() => handleCheckDownload(isCheckId)}>
              Checkni yuklash
            </LoadingButton>

            <LoadingButton loading={loadingBtn} onClick={() => handleCheckPrint(isCheckId)}>
              Checkni chiqarish
            </LoadingButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}
