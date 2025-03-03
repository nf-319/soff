import { Box, Dialog, DialogContent, FormControl, TextField, Typography } from '@mui/material'
import { Dispatch, FC, SetStateAction } from 'react'
import { MenuOpenType } from '../LeadsKaban'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { useFormik } from 'formik'
import api from 'src/@core/utils/api'
import { useQueryClient } from '@tanstack/react-query'
import { setAddSource, setOpenLid, setSectionId } from 'src/store/apps/leads'
import { useAppDispatch } from 'src/store'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string
  leadFirstName: string
  onClose?: () => void
  leadPhone: string
}

export const LeadDeleteModal: FC<Props> = ({ open, onClose, setOpen, leadId, leadFirstName, leadPhone }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      reason: ''
    },
    validationSchema: Yup.object({
      reason: Yup.string().required('Sabab kiritilishi shart')
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      await handleDelete(values, setSubmitting, resetForm)
    }
  })

  const handleEditLead = async (id: any, values: any) => {
    const newValues = { ...values }

    if (values.phone) {
      const newPhone: string = values.phone.split(' ').join('')

      if (newPhone.length === 9) {
        Object.assign(newValues, { phone: `+998${newPhone}` })
      } else {
        Object.assign(newValues, { phone: `${newPhone}` })
      }
    }
    try {
      const resp = await api.patch(`leads/anonim-user/update/${id}/`, newValues)
      queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
      return Promise.resolve(resp)
    } catch (err: any) {
      return Promise.reject(err)
    }
  }

  const handleDelete = async (values: any, setSubmitting: any, resetForm: any) => {
    try {
      await handleEditLead(leadId, { first_name: leadFirstName, phone: leadPhone, is_active: false, ...values })
      setSubmitting(false)
      resetForm()
      setOpen(null)
      dispatch(setOpenLid(null))
      dispatch(setAddSource(false))
      dispatch(setSectionId(null))
      if (onClose) onClose()
    } catch (err: any) {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open === 'delete'} onClose={() => setOpen(null)}>
      <DialogContent sx={{ minWidth: '300px', maxWidth: '350px' }}>
        <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
          {t("Rostdan ham o'chirib tashlamoqchimisiz?")}
        </Typography>

        <form
          onSubmit={formik.handleSubmit}
          style={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <FormControl fullWidth>
            <TextField
              label={t('Sabab (majburiy)')}
              multiline
              rows={4}
              size='small'
              name='reason'
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              helperText={formik.touched.reason && formik.errors.reason}
            />
          </FormControl>

          <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
            <LoadingButton variant='outlined' size='small' color='error' onClick={() => setOpen(null)}>
              {t('Bekor qilish')}
            </LoadingButton>

            <LoadingButton loading={formik.isSubmitting} type='submit' size='small' variant='contained'>
              {t("O'chirish")}
            </LoadingButton>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
