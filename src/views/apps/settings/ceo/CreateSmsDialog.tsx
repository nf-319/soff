import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  styled
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'
import { createSms, fetchSmsList, fetchSmsListQuery, setOpenCreateSms } from 'src/store/apps/settings'
import { useAppDispatch, useAppSelector } from 'src/store'
import LoadingButton from '@mui/lab/LoadingButton'
import { disablePage } from 'src/store/apps/page'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { PLACEHOLDERS } from '@/views/apps/sms-settings/constants'
import { TextAreaWithPlaceholders } from '@/components'

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

type Props = {}

export default function CreateSmsDialog({}: Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [editable, setEditable] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  const { openCreateSms, sms_list } = useAppSelector(state => state.settings)

  const setOpenAddGroup = (value: boolean) => {
    dispatch(setOpenCreateSms(value))
  }

  const validationSchema = Yup.object({
    description: Yup.string().required(t('Xabarni kiriting')||'Xabarni kiriting'),
    parent: Yup.string()
      .nullable()
      .required(t('Kategorya tanlanishi shart') || 'Kategorya tanlanishi shart')
  })

  const initialValues = {
    description: '',
    parent: null
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      setLoading(true)
      dispatch(disablePage(true))
      const resp = await dispatch(createSms(values))
      if (resp.meta.requestStatus === 'rejected') {
        formik.setErrors(resp.payload)
      } else {
        dispatch(disablePage(false))
        dispatch(fetchSmsListQuery(formik.values.parent))
        dispatch(fetchSmsList())
        formik.resetForm()
        toast.success('SMS shablon yaratildi')
        setOpenAddGroup(false)
      }
      setLoading(false)
    }
  })

  useEffect(() => {
    dispatch(fetchSmsList())
  }, [])

  const handleTextAreaChange = (value: string) => {
    formik.setFieldValue('description', value)
  }

  const handleTextAreaSave = async () => {
    return Promise.resolve()
  }

  const { errors, values, handleSubmit, handleChange, handleBlur, touched } = formik

  return (
    <Drawer open={openCreateSms} hideBackdrop anchor='right' variant='persistent'>
      <Box
        className='customizer-header'
        sx={{
          position: 'relative',
          p: theme => theme.spacing(3.5, 5),
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {t("SMS shablon qo'shish")}
        </Typography>

        <IconButton
          onClick={() => {
            setOpenAddGroup(false)
            formik.resetForm()
          }}
          sx={{
            right: 20,
            top: '50%',
            position: 'absolute',
            color: 'text.secondary',
            transform: 'translateY(-50%)'
          }}
        >
          <X size={22} />
        </IconButton>
      </Box>
      <p style={{ fontSize: 12 }} className='mb-3 mt-2 px-3'>
          Xabar matniga talaba ismini qo'shish uchun dynamic tugmadan foydalaning.
      </p>
      <form
        onSubmit={handleSubmit}
        id='posts-courses-id'
        style={{
          padding: '10px 20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: '15px',
          marginTop: '5px'
        }}
      >
        <Box display='grid' gap={3}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel size='small' id='demo-simple-select-outlined-label'>
              {t('Kategoriya')}
            </InputLabel>
            <Select
              size='small'
              label={t('Kategoriya')}
              name='parent'
              error={!!errors.parent && touched.parent}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.parent}
              id='demo-simple-select-outlined'
              labelId='demo-simple-select-outlined-label'
            >
              {sms_list?.result?.map(item => (
                <MenuItem value={item.id}>{item.description}</MenuItem>
              ))}
            </Select>
            {!!errors.parent && touched.parent && <FormHelperText error>{errors.parent}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth>
            <Box
              sx={{
                '& .text-area-with-placeholders-editable': {
                  display: 'none !important'
                }
              }}
            >
              <TextAreaWithPlaceholders
                value={values.description}
                editable={true}
                loading={loading}
                label='SMS matni'
                handleChange={handleTextAreaSave}
                setEditable={setEditable}
                placeholders={PLACEHOLDERS.birthdate}
                defaultValue={values.description}
                onChange={handleTextAreaChange}
              />
            </Box>
            {!!errors.description && touched.description && <FormHelperText error>{errors.description}</FormHelperText>}
          </FormControl>
        </Box>

        <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mt: 'auto' }} fullWidth>
          {t('Saqlash')}
        </LoadingButton>
      </form>
    </Drawer>
  )
}
