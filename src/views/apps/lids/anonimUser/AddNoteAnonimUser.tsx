'use client'

import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { FormControl, FormHelperText, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import { toast } from 'react-hot-toast'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

type Props = {
  user: any
  closeModal: any
}

export const truncateToMinute = (date: Date | null): Date | null => {
  if (!date) return null
  const newDate = new Date(date)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate
}

export default function AddNoteAnonimUser({ user, closeModal }: Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [reminderDate, setReminderDate] = useState<Date | null>(new Date())

  const validationSchema = Yup.object({
    body: Yup.string().required(t('Eslatma matnni kiriting'))
  })

  const initialValues: { body: string } = { body: '' }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true)
      try {
        await api.post(`leads/lead-user-description/${user}/`, {
          anonim_user: user,
          body: values.body,
          date: reminderDate ? truncateToMinute(reminderDate)?.toISOString() : null,
        })
        setLoading(false)
        closeModal()
        toast.success(t("Eslatma muvaffaqiyatli yaratildi"))
        resetForm()
      } catch (error) {
        setLoading(false)
        toast.error(t('Xatolik yuz berdi'))
      }
    }
  })

  useEffect(() => {
    return () => {
      formik.resetForm()
    }
  }, [])

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}
    >
      <FormControl fullWidth>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label={t('Eslatish vaqti')}
            value={reminderDate}
            onChange={newValue => setReminderDate(newValue)}
            disablePast
            format='dd/MM/yyyy HH:mm'
            ampm={false}
            slotProps={{
              textField: {
                size: 'small',
                error: false
              }
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth>
        <TextField
          label={t('Eslatma')}
          multiline
          rows={4}
          size='small'
          name='body'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.body}
          error={!!formik.errors.body && formik.touched.body}
        />
        {formik.errors.body && formik.touched.body && (
          <FormHelperText error={true}>{formik.errors.body}</FormHelperText>
        )}
      </FormControl>

      <LoadingButton loading={loading} type='submit' variant='contained'>
        {t('Yaratish')}
      </LoadingButton>
    </form>
  )
}
