'use client'

import { Box, Dialog, DialogContent, FormControl, TextField, Typography } from '@mui/material'
import { Dispatch, FC, SetStateAction } from 'react'
import { MenuOpenType } from '../LeadsKanban'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { useFormik } from 'formik'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from 'src/@core/utils/api'
import { setAddSource, setOpenLid, setSectionId } from '../../../store/apps/leads'
import { useAppDispatch } from '../../../store'
import { useRouter } from 'next/router'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string
  leadFirstName: string
  leadPhone: string
  onClose?: boolean
  defaultId?: any
  isAmo?: boolean
}

export const LeadDeleteModal: FC<Props> = ({ defaultId, open, onClose, setOpen, leadId, leadFirstName, leadPhone }) => {
  const { query } = useRouter()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const deleteAmoLead = useMutation({
    mutationFn: async (dataId: string) => {
      return api.post('amocrm/delete/', {
        condition: 'lead',
        data_id: dataId
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amocrm/pipelines/?with_steps=true'] })
      queryClient.invalidateQueries({ queryKey: [`amocrm/leads/?pipeline_id=${defaultId}`] })
      handleClose()
    }
  })

  const deleteNormalLead = useMutation({
    mutationFn: async (body: any) => {
      return api.patch(`leads/anonim-user/update/${leadId}/`, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
      handleClose()
    }
  })

  const formik = useFormik({
    initialValues: {
      reason: ''
    },
    validationSchema: query.is_amocrm
      ? null
      : Yup.object({
          reason: Yup.string().required('Sabab kiritilishi shart')
        }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (query.is_amocrm) {
        await deleteAmoLead.mutateAsync(leadId)
      } else {
        await deleteNormalLead.mutateAsync({
          first_name: leadFirstName,
          phone: leadPhone,
          is_active: false,
          ...values
        })
      }
      setSubmitting(false)
      resetForm()
    }
  })

  const handleClose = () => {
    setOpen(null)
    if (onClose) {
      dispatch(setOpenLid(null))
      dispatch(setAddSource(false))
      dispatch(setSectionId(null))
    }
  }

  return (
    <Dialog open={open === 'delete'} onClose={handleClose}>
      <DialogContent sx={{ minWidth: '300px', maxWidth: '350px' }}>
        <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
          {t("Rostdan ham o'chirib tashlamoqchimisiz?")}
        </Typography>

        <form
          onSubmit={formik.handleSubmit}
          style={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          {!query.is_amocrm && (
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
          )}

          <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
            <LoadingButton variant='outlined' size='small' color='error' onClick={handleClose}>
              {t('Bekor qilish')}
            </LoadingButton>

            <LoadingButton
              loading={formik.isSubmitting || deleteAmoLead.isPending || deleteNormalLead.isPending}
              type='submit'
              size='small'
              variant='contained'
            >
              {t("O'chirish")}
            </LoadingButton>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
