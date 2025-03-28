'use client'

import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useTranslation } from 'react-i18next'
import { FormHelperText, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { today } from '../../../../components/card-statistics/kanban-item'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import usePayment from 'src/hooks/usePayment'
import Router, { useRouter } from 'next/router'
import { fetchStudentDetail, fetchStudentGroups, fetchStudentPayment } from 'src/store/apps/students'
import AmountInput, { revereAmount } from 'src/components/amount-input'
import IconifyIcon from 'src/components/icon'
import { getStudents } from 'src/store/apps/groupDetails'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from 'react-hot-toast'

type Props = {
  openEdit: any
  setOpenEdit: any
  student_id?: any
  group?: any
  active_id?: any
}

export default function StudentPaymentForm({ openEdit, setOpenEdit, student_id, group }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const { studentsQueryParams } = useAppSelector(state => state.groupDetails)
  const { t } = useTranslation()
  const { studentData, groupsChecklist } = useAppSelector(state => state.students)
  const userData: any = { ...studentData }
  const { getPaymentMethod, paymentMethods, createPayment } = usePayment()
  const { query } = useRouter()
  const dispatch = useAppDispatch()

  const validationSchema = Yup.object({
    payment_type: Yup.string().required('Tanlash majburiy'),
    group: Yup.string().required('Tanlash majburiy'),
    amount: Yup.string().required('Tanlash majburiy'),
    description: Yup.string(),
    payment_date: Yup.string().required('Tanlash majburiy')
  })

  const initialValues = {
    payment_type: '',
    group: ``,
    amount: '',
    description: '',
    payment_date: dayjs().format('YYYY-MM-DD'),
    bonus: ""
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      const data = {
        ...values,
        student: query?.student || student_id,
        amount: revereAmount(values.amount)
      }
      try {
        await createPayment(data)
        setLoading(false)
        toast.success("To'lov mofaqiyatli to'landi")
        setOpenEdit(null)
        if (query.student) {
          await dispatch(fetchStudentGroups(query.student))
          await dispatch(fetchStudentDetail(userData?.id || student_id))
          await dispatch(fetchStudentPayment(userData?.id || student_id))
        } else {
          const queryString = new URLSearchParams(studentsQueryParams).toString()

          await dispatch(getStudents({ id: query.id, queryString: queryString }))
        }
      } catch (err: any) {
        setLoading(false)
      }
    }
  })

  const { errors, values, handleSubmit, handleBlur, touched, handleChange } = formik

  const handleEditClose = () => {
    setOpenEdit(null)

    setShowWarning(true)
  }
  const handleConfirmCancel = () => {
    setShowWarning(false)
    formik.resetForm()
  }

  const handleDismissWarning = () => {
    setShowWarning(false)
  }

  useEffect(() => {
    if (studentData) {
      formik.setFieldValue('group', group || `${studentData.groups?.[0]?.group_data?.id}`)
    }
  }, [studentData, group])

  useEffect(() => {
    if (student_id && openEdit === 'payment') {
      dispatch(fetchStudentDetail(student_id))
      dispatch(fetchStudentPayment(student_id))
    }
  }, [openEdit, student_id])

  useEffect(() => {
    if (openEdit === 'payment' && paymentMethods.length === 0) {
      void getPaymentMethod()
    }
  }, [openEdit])

   const formatNumber = (num: any) => {
    return new Intl.NumberFormat('uz-UZ').format(num)
  }

  return (
    <div>
      <Dialog
        open={openEdit === 'payment'}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleEditClose()
          }
        }}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t("To'lov")}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}
            id='edifsdt-employee-pay'
          >
            <FormControl fullWidth>
              <InputLabel
                size='small'
                id='user-view-language-label'
                error={!!errors.payment_type && touched.payment_type}
              >
                {t("To'lov usulini tanlang")}
              </InputLabel>
              <Select
                size='small'
                label={t("To'lov usulini tanlang")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='payment_type'
                value={values.payment_type}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {paymentMethods.map((branch: any) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
                <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/settings/ceo/all-settings')}>
                  {t('Yangi yaratish')}
                  <IconifyIcon icon={'ion:add-sharp'} />
                </MenuItem>
              </Select>
              {!!errors.payment_type && touched.payment_type && (
                <FormHelperText error>{errors.payment_type}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label' error={!!errors.group && !!touched.group}>
                {t('Qaysi guruh uchun?')}
              </InputLabel>
              <Select
                size='small'
                label={t('Qaysi guruh uchun?')}
                id='user-view-language'
                labelId='user-view-language-label'
                name='group'
                error={!!errors.group && !!touched.group}
                value={values.group}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {groupsChecklist?.length === 0 ? (
                  <MenuItem>Guruhga biriktirilmagan</MenuItem>
                ) : (
                  groupsChecklist?.map((group: any) => (
                    <MenuItem key={group.id} value={group.id} sx={{ whiteSpace: 'normal', lineHeight: 1.2 }}>
                      {`${group.name} , ${group?.total_payments ? group.total_payments.toLocaleString() : '0'} so'm`}
                    </MenuItem>
                  ))
                )}
              </Select>
              {!!errors.group && touched.group && <FormHelperText error>{!!errors.group}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <AmountInput
                label={t('Summa')}
                size='small'
                name='amount'
                error={!!errors.amount && touched.amount}
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {!!errors.amount && touched.amount && <FormHelperText error>{errors.amount}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                rows={4}
                multiline
                label={t('Izoh')}
                name='description'
                defaultValue={''}
                error={!!errors.description && touched.description}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {!!errors.description && touched.description && (
                <FormHelperText error>{errors.description}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                rows={4}
                type="text"
                label="O'quvchiga bonus"
                name='bonus'
                size='small'
                defaultValue={''}
                value={values.bonus ? `${t('Ball')} ${formatNumber(values.bonus)}` : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '')
                  handleChange({ target: { name: 'bonus', value: rawValue } })
                }}
                onBlur={handleBlur}
              />
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <FormControl sx={{ width: '100%' }}>
                <DatePicker
                  label="To'lov sanasi"
                  value={values.payment_date ? dayjs(values.payment_date) : null}
                  format="DD/MM/YYYY"
                  onChange={newValue => {
                    handleChange({ target: { name: 'payment_date', value: dayjs(newValue).format('YYYY-MM-DD') } });
                  }}
                  // @ts-ignore
                  onBlur={handleBlur}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.payment_date && touched.payment_date,
                      helperText: touched.payment_date && errors.payment_date
                    }
                  }}
                />
                {!!errors.payment_date && touched.payment_date && (
                  <FormHelperText error>{errors.payment_date}</FormHelperText>
                )}
              </FormControl>
            </LocalizationProvider>

            <DialogActions sx={{ justifyContent: 'center' }}>
              <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                {t('Saqlash')}
              </LoadingButton>
              <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                {t('Bekor qilish')}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showWarning}
        onClose={handleDismissWarning}
        aria-labelledby='warning-dialog-title'
        aria-describedby='warning-dialog-description'
      >
        <DialogTitle id='warning-dialog-title' sx={{ textAlign: 'center' }}>
          {t('Eslatma')}
        </DialogTitle>
        <DialogContent>
          <Typography id='warning-dialog-description' sx={{ mt: 1, textAlign: 'center' }}>
            {t(`Bekor qilishga ishonchingiz komilmi?`)} <br />
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setOpenEdit('payment'), setShowWarning(false)
            }}
          >
            {t('Ortga qaytish')}
          </Button>
          <Button variant='contained' color='error' onClick={handleConfirmCancel}>
            {t('Bekor qilish')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
