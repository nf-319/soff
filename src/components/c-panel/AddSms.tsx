import api from '@/@core/utils/api'
import { useAppDispatch } from '@/store'
import { fetchCompanyDetails } from '@/store/apps/c-panel/companySlice'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  DialogActions,
  Button
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

type Props = {
  open: boolean
  setOpen: (status: boolean) => void
}

const createSmsPaket = async (data: any) => {
  console.log(data)

  await api.post(`owner/sms-provider/connect/`, data).then(res => {
    return res
  })
}

const SmsPaketModal = ({ open, setOpen }: Props) => {
  const { query } = useRouter()
  const dispatch = useAppDispatch()
  const { mutate, isPending } = useMutation({
    mutationFn: createSmsPaket,
    onSuccess: () => {
      toast.success('SMS paket qo‘shildi')
      setOpen(false)
      formik.resetForm()
      dispatch(fetchCompanyDetails(Number(query?.slug)))
    },
    onError: (err: any) => {
      formik.setErrors(err.response.data)

      toast.error('Xatolik yuz berdi')
    }
  })
  const formik = useFormik({
    initialValues: {
      type: '',
      login: '',
      password: '',
      tenant: query.slug
    },
    validationSchema: Yup.object({
      type: Yup.string().required('Provider tanlanishi shart'),
      login: Yup.string().required('Login kiritilishi shart'),
      password: Yup.string().required('Parol kiritilishi shart')
    }),
    onSubmit: values => {
      mutate(values)
    }
  })
  function onClose() {
    setOpen(false)
    formik.resetForm()
  }

  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={onClose}>
      <DialogTitle>SMS paket qo‘shish</DialogTitle>
      <DialogContent sx={{ marginX: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FormControl fullWidth sx={{ marginTop: 2 }} error={!!formik.errors.type && formik.touched.type}>
          <InputLabel id='provider-label'>Provider</InputLabel>
          <Select
            labelId='provider-label'
            id='provider'
            name='type'
            value={formik.values.type}
            label='Provider'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value='eskiz'>Eskiz</MenuItem>
            <MenuItem value='playmobile'>Play mobile</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label='Login'
          name='login'
          value={formik.values.login}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.login && formik.touched.login}
          helperText={formik.touched.login && formik.errors.login}
        />

        <TextField
          fullWidth
          label='Parol'
          type='password'
          name='password'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.password && formik.touched.password}
          helperText={formik.touched.password && formik.errors.password}
        />
      </DialogContent>
      <DialogActions sx={{ marginX: 3 }}>
        <LoadingButton
          onClick={() => formik.handleSubmit()}
          type='submit'
          size='large'
          variant='contained'
          fullWidth
          loading={isPending}
        >
          {isPending ? 'Saqlanmoqda...' : 'Saqlash'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
export default SmsPaketModal
