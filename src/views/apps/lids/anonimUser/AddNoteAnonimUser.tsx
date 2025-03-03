'use client'

import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { FormControl, FormHelperText, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import api from 'src/@core/utils/api'
import { useAppDispatch } from 'src/store'
import { setAddSource, setOpenLid, setSectionId } from 'src/store/apps/leads'

type Props = {
  user: any
  closeModal: any
}

export default function AddNoteAnonimUser({ user, closeModal }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<any>(false)

  const validationSchema = Yup.object({
    body: Yup.string().required('Eslatma matnni kiriting')
  })

  const initialValues: { body: string } = { body: '' }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      try {
        await api.post(`leads/lead-user-description/${user}/`, {
          anonim_user: user,
          body: values.body
        })
        setLoading(false)
        closeModal()

        dispatch(setOpenLid(null))
        dispatch(setAddSource(false))
        dispatch(setSectionId(null))
        formik.resetForm()
      } catch {
        setLoading(false)
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

      <LoadingButton loading={loading} type='submit' variant='outlined'>
        {t('Yaratish')}
      </LoadingButton>
    </form>
  )
}
