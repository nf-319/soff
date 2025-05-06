import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useTranslation } from 'react-i18next'
import { Box, Card, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/store'
import usePayment from 'src/hooks/usePayment'
import { BanknoteIcon, Calendar, User } from 'lucide-react'
import { useGet, usePost } from '@/hooks/useApi'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { fetchStudentPayment } from '@/store/apps/students'
import { formatCurrency } from '@/@core/utils/format-currency'
import AmountInput, { revereAmount } from '@/components/amount-input'

type Props = {
  openEdit: any
  setOpenEdit: any
}

export default function StudentWithDrawForm({ openEdit, setOpenEdit }: Props) {
  const { t } = useTranslation()
  const { query } = useRouter()
  const { getPaymentMethod } = usePayment()
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const { data } = useGet(`common/student-payment/list/${query.student}/?condition=payment`, {
    options: { enabled: !!openEdit }
  })

  const handleEditClose = () => {
    setOpenEdit(null)
  }

  useEffect(() => {
    if (openEdit === 'withdraw') {
      getPaymentMethod()
    }
  }, [openEdit])

  return (
    <div>
      <Dialog
        open={openEdit === 'withdraw'}
        onClose={handleEditClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t("O'quvchi to'lovlari")}
        </DialogTitle>
        <DialogContent>
          {data?.map((item: any, index: number) => (
            <Card
              onClick={() => {
                setSelectedPayment(item)
              }}
              key={index}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1,
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
                transition: '0.3s',
                '&:hover': {
                  borderColor: '#1976d2',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
                  cursor: 'pointer'
                }
              }}
            >
              {/* <Box display='flex' alignItems='center' gap={2} mb={2}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <User size={24} />
                </Box>
                <Typography fontWeight={600} fontSize={18}>
                  {item?.student_name}
                </Typography>
              </Box> */}

              <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                <Box display='flex' alignItems='center' gap={1}>
                  <BanknoteIcon size={18} />
                  <Typography variant='body2' color='text.secondary'>
                    To'lov miqdori
                  </Typography>
                </Box>
                <Typography fontWeight={600} color={item?.amount >= 0 ? 'green' : 'red'}>
                  {formatCurrency(item?.amount)} so'm
                </Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                <Box display='flex' alignItems='center' gap={1}>
                  <Calendar size={16} />
                  <Typography variant='body2' color='text.secondary'>
                    To'lov sanasi
                  </Typography>
                </Box>
                <Typography fontWeight={500}>{item?.payment_date}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box display='flex' alignItems='center' gap={1}>
                  <User size={18} />
                  <Typography variant='body2' color='text.secondary'>
                    Admin
                  </Typography>
                </Box>
                <Typography fontWeight={500}>{item?.admin}</Typography>
              </Box>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} fullWidth variant='contained'>
            Yopish
          </Button>
        </DialogActions>
      </Dialog>
      <ReturnCashModal
        handleClose={handleEditClose}
        paymentData={selectedPayment}
        setPaymentData={setSelectedPayment}
      />
    </div>
  )
}

const ReturnCashModal = ({
  paymentData,
  setPaymentData,
  handleClose
}: {
  handleClose: () => void
  paymentData: any
  setPaymentData: (status: any) => void
}) => {
  const { query } = useRouter()
  const { mutate, isPending } = usePost()
  const dispatch = useAppDispatch()
  const validationSchema = Yup.object({
    amount: Yup.number().typeError('Faqat raqam kiriting').required('Pul miqdori majburiy'),
    description: Yup.string().nullable()
  })


  const formik = useFormik({
    initialValues: {
      amount: '',
      description: ''
    },
    validationSchema,
    onSubmit: async values => {
      mutate(
        'system/refund-payment/',
        {
          ...values,
          payment: paymentData.id
        },
        {
          onSuccess: () => {
            onClose()
            handleClose()
            dispatch(fetchStudentPayment(query.student))
            toast.success('Pul qaytarish muvvafaqiyatli boldi')
          },
          onError: err => {
            console.log(err)
            formik.setErrors(err.response.data)
          }
        }
      )
    }
  })

  function onClose() {
    setPaymentData(null)
    formik.resetForm()
  }

  return (
    <div>
      <Dialog maxWidth='xs' fullWidth open={!!paymentData} onClose={onClose}>
        <DialogTitle>Pul qaytarish</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <AmountInput
              name='amount'
              label='Pul miqdori'
              value={formik.values.amount}
              onChange={e => formik.setFieldValue('amount', revereAmount(e.target.value))}
              onBlur={formik.handleBlur}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
            />
            <Typography color={'red'} fontSize={12}>{`Maksimum  ${formatCurrency(
              paymentData?.amount
            )} so'm qaytarsa bo'ladi`}</Typography>
            <TextField
              fullWidth
              name='description'
              label='Izoh'
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color='secondary'>
              Bekor qilish
            </Button>
            <LoadingButton loading={isPending} type='submit' variant='contained' color='primary'>
              Saqlash
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
