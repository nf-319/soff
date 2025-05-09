import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { editDepartmentStudent } from 'src/store/apps/leads'
import { reversePhone } from '@components/phone-input/format-phone-number'
import PhoneInput from '@components/phone-input'
import { useQueryClient } from '@tanstack/react-query'
import { LEAD_STATEMENTS_TEMPERATURE } from '@modules/LeadsStatement'
import { lidStatusOption } from '@/shared/constans/lid-statements'

type Props = {
  item: any
  department: any
  onClose: () => void
  laed?: boolean
}

export default function EditAnonimUserForm({ item, onClose, laed }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(state => state.leads)
  const queryClient = useQueryClient()
  const [temperateValue, setTemperateValue] = useState(item.temperature || '')
  const [stateValue, setStateValue] = useState(item.status)

  const validationSchema = Yup.object({
    first_name: Yup.string().required('Ism kiriting'),
    phone: Yup.string().required('Telefon raqam kiriting')
  })

  console.log(item)

  const initialValues: {
    first_name: string
    phone: string
  } = {
    first_name: laed ? item.first_name : item.title,
    phone: item.phone
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      try {
        const resp = await dispatch(
          editDepartmentStudent({ id: item.id, ...values, temperate: temperateValue, status: stateValue, phone: reversePhone(values.phone) })
        )

        if (resp.meta.requestStatus === 'rejected') {
          formik.setErrors(resp.payload)
        } else {
          formik.resetForm()
          await queryClient.invalidateQueries({ queryKey: ['departments-leads'] })
        }
      } catch (error) {
        console.error('Error updating department:', error)
      } finally {
        onClose()
      }
    }
  })

  const { values, errors, touched, handleBlur, handleChange } = formik

  useEffect(() => {
    return () => {
      formik.resetForm()
    }
  }, [])

  const filteredOptions = (() => {
    if (stateValue === 'new') {
      return lidStatusOption
    }

    return lidStatusOption?.filter((o: any) => o.value !== 'new' && o.value !== '')
  })()

  const newState = { value: '', label: '----' }

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}
    >
      <FormControl fullWidth>
        <TextField
          fullWidth
          size='small'
          label={t('first_name')}
          name='first_name'
          error={!!errors.first_name && touched.first_name}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.first_name}
        />
        {!!errors.first_name && touched.first_name && <FormHelperText error>{formik.errors.first_name}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel error={!!errors.phone && touched.phone} htmlFor='login-input'>
          {t('phone')}
        </InputLabel>

        <PhoneInput
          fullWidth
          label={t('phone')}
          id='login-input'
          error={!!errors.phone && touched.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.phone}
        />
        {!!errors.phone && touched.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel size='small'>Holat</InputLabel>
        <Select
          label='Holat'
          placeholder='Holatni tanlang'
          size='small'
          fullWidth
          value={stateValue}
          onChange={e => setStateValue(e.target.value as string)}
          displayEmpty
        >
          {filteredOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel id="temperature-label" shrink>
          Harorat
        </InputLabel>
        <Select
          labelId="temperature-label"
          value={temperateValue}
          onChange={e => setTemperateValue(e.target.value)}
          input={<OutlinedInput notched label="Harorat" />}
          displayEmpty
          renderValue={selected => {
            if (selected === '') {
              return <span style={{ color: '#aaa' }}>{newState.label}</span>
            }

            const selectedOption = LEAD_STATEMENTS_TEMPERATURE.find(option => option.value === selected)
            return selectedOption?.label ?? ''
          }}
        >
          {[newState, ...LEAD_STATEMENTS_TEMPERATURE.slice(1, 4)].map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LoadingButton loading={loading} type='submit' variant='outlined'>
        {t('Saqlash')}
      </LoadingButton>
    </form>
  )
}
