import api from '@/@core/utils/api'
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
import { useState } from 'react'
import toast from 'react-hot-toast'
import * as Yup from 'yup'

type Props = {
  open: boolean
  setOpen: (status: boolean) => void
}

const createSmsPaket = async (data: any) => {
  await api.post(`wedwed`, data).then(res => {
    return res
  })
}

const SmsPaketModal = ({ open, setOpen }: Props) => {
  const { mutate, isPending } = useMutation({
    mutationFn: createSmsPaket,
    onSuccess: () => {
      toast.success('SMS paket qo‘shildi')
      setOpen(false)
    },
    onError: () => {
      toast.error('Xatolik yuz berdi')
    }
  })
  const formik = useFormik({
    initialValues: {
      provider: '',
      login: '',
      parol: ''
    },
    validationSchema: Yup.object({
      provider: Yup.string().required('Provider tanlanishi shart'),
      login: Yup.string().required('Login kiritilishi shart'),
      parol: Yup.string().required('Parol kiritilishi shart')
    }),
    onSubmit: values => {
      mutate(values)
    }
  })

  return (
    <Dialog open={open} maxWidth='xs' fullWidth onClose={() => setOpen(false)}>
      <DialogTitle>SMS paket qo‘shish</DialogTitle>
      <DialogContent sx={{ marginX: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FormControl fullWidth sx={{ marginTop: 2 }} error={!!formik.errors.provider && formik.touched.provider}>
          <InputLabel id='provider-label'>Provider</InputLabel>
          <Select
            labelId='provider-label'
            id='provider'
            name='provider'
            value={formik.values.provider}
            label='Provider'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value='eskiz'>Eskiz</MenuItem>
            <MenuItem value='playMobile'>Play mobile</MenuItem>
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
          name='parol'
          value={formik.values.parol}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={!!formik.errors.parol && formik.touched.parol}
          helperText={formik.touched.parol && formik.errors.parol}
        />
      </DialogContent>
      <DialogActions sx={{ marginX: 3 }}>
        <LoadingButton type='submit' size='large' variant='contained' fullWidth loading={isPending}>
          {isPending ? 'Saqlanmoqda...' : 'Saqlash'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
export default SmsPaketModal
