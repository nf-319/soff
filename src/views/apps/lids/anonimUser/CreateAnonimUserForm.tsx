import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  createDepartmentStudent,
  fetchDepartmentList,
  setAddSource,
  setDragonLoading,
  setLeadItems,
  setOpenItem,
  setSectionId
} from 'src/store/apps/leads'
import IconifyIcon from '../../../../components/icon'
import PhoneInput from '../../../../components/phone-input'
import { reversePhone } from '@components/phone-input/format-phone-number'
import Router, { useRouter } from 'next/router'
import api from 'src/@core/utils/api'
import { useGet } from 'src/hooks/useApi'
import { LeadsResult } from '@/entities/lids/LeadsKanban'
import { LeadsType } from 'src/entities/lids'
import { useAuth } from 'src/hooks/useAuth'
import { Ellipsis } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { LeadKanbanItem } from '@/entities/lids/LeadKanbanItem'
import { LEAD_STATEMENTS_TEMPERATURE } from '@modules/LeadsStatement'
import { lidStatusOption } from '@/shared/constans/lid-statements'
import { toast } from 'react-hot-toast'

type Props = {
  source?: any
  defaultId?: string
}

export default function CreateAnonimUserForm({ source, defaultId }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [skipLid, setSkipLid] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [temperateValue, setTemperateValue] = useState('')
  const [stateValue, setStateValue] = useState('new')
  const query = window.location?.search?.split('?slug=')[1]
  const { id } = router.query
  const { sectionId, loading, openLid } = useAppSelector(state => state.leads)

  const { data: leadData } = useGet<LeadsType<LeadsResult[]>>('leads/departments/leads/', {
    params: { branch: user?.active_branch, parent: id || defaultId },
    deps: ['departments-leads']
  })

  const { data: sourceData } = useGet('leads/statistic/')

  const validationSchema = Yup.object({
    department: Yup.string().required("Bo'lim tanlang"),
    source: Yup.string().required('Manbani kiritiing'),
    first_name: Yup.string().required('Ism kiriting'),
    phone: Yup.string().required('Telefon raqam'),
    body: Yup.string()
  })

  const initialValues: {
    department: string
    source: string | number
    first_name: string
    phone: string
    body?: string
    user: {
      phone: string
      first_name: string
      id: number
      department: number
      is_active: boolean
    } | null
  } = {
    department: sectionId || source || '',
    source: '',
    first_name: '',
    phone: '',
    user: null
  }
  async function handleGetLealdItems() {
    if (!query) return
    dispatch(setDragonLoading(true))

    try {
      const res = await api.get(`leads/department/${query}`)
      dispatch(setLeadItems(res.data))
    } catch (err) {
      console.error('Error fetching leads:', err)
    } finally {
      await  queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
      dispatch(setDragonLoading(false))
    }
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      const resp = await dispatch(
        createDepartmentStudent({
          ...values,
          skip_error: skipLid,
          temperate: temperateValue,
          status: stateValue,
          phone: reversePhone(values.phone)
        })
      )

      if (resp.meta.requestStatus === 'rejected') {
        formik.setErrors(resp.payload)
        setSkipLid(true)
      } else {
        formik.resetForm()
        dispatch(setSectionId(null))
        toast.success("Muvaffaqiyatli")
        await  queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
        await handleGetLealdItems()
        await dispatch(fetchDepartmentList())
      }
    }
  })

  const { values, errors, touched, handleBlur, handleChange } = formik
  const newErrors: any = { ...errors }

  useEffect(() => {
    return () => {
      formik.resetForm()
    }
  }, [])

  const newState = { value: '', label: '----' }

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ padding: '5px 0', width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}
    >
      <FormControl fullWidth>
        <InputLabel error={!!errors.department && touched.department} size='small' id='user-view-language-label'>
          {t("Bo'lim")}
        </InputLabel>

        <Select
          size='small'
          label={t("Bo'lim")}
          id='user-view-language'
          labelId='user-view-language-label'
          name='department'
          sx={{ mb: 1 }}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.department}
          error={!!errors.department && touched.department}
        >
          {leadData?.results.map((lead: any) => (
            <MenuItem key={lead.id} value={Number(lead.id)}>
              {lead.name}
            </MenuItem>
          ))}
          <MenuItem sx={{ fontWeight: 600 }} onClick={() => dispatch(setOpenItem(openLid))}>
            {t('Yangi yaratish')}

            <IconButton>
              <Ellipsis />
            </IconButton>
          </MenuItem>
        </Select>
        {!!errors.department && touched.department && (
          <FormHelperText error={true}>{formik.errors.department}</FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel size='small' id='sourse-label'>
          {t('Manba')}
        </InputLabel>

        <Select
          size='small'
          label={t('Manba')}
          labelId='sourse-label'
          name='source'
          sx={{ mb: 1 }}
          onChange={(e: any) => {
            handleChange(e)
            dispatch(setAddSource(e?.target?.value === 0))
          }}
          error={!!errors.source && touched.source}
          onBlur={handleBlur}
          value={values.source}
        >
          {sourceData &&
            sourceData.result.map((lead: any) => (
              <MenuItem key={lead.id} value={lead.id}>
                {lead.name}
              </MenuItem>
            ))}
          <MenuItem sx={{ fontWeight: 600 }} onClick={() => Router.push('/lids/stats')}>
            {t('Yangi yaratish')}
            <IconifyIcon icon={'ion:add-sharp'} />
          </MenuItem>
        </Select>
        {!!errors.source && touched.source && <FormHelperText error>{formik.errors.source}</FormHelperText>}
      </FormControl>

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
          id='login-input'
          label={t('phone')}
          error={!!errors.phone && touched.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.phone}
        />
        {!!errors.phone && touched.phone && <FormHelperText error>{formik.errors.phone}</FormHelperText>}
      </FormControl>

      {errors?.user && <LeadKanbanItem onClose lead={newErrors.user} />}

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
          {lidStatusOption.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size='small' variant='outlined'>
        <InputLabel id='temperature-label' shrink>
          Harorat
        </InputLabel>
        <Select
          labelId='temperature-label'
          value={temperateValue}
          onChange={e => setTemperateValue(e.target.value)}
          input={<OutlinedInput notched label='Harorat' />}
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

      <FormControl fullWidth>
        <TextField
          fullWidth
          multiline
          rows={4}
          size='small'
          label={t('Izoh')}
          name='body'
          onChange={handleChange}
          value={values.body}
        />
        <FormHelperText error={!!errors.body}>{formik.errors.body}</FormHelperText>
      </FormControl>

      <LoadingButton loading={loading} type='submit' variant='outlined'>
        {skipLid ? 'Qayta yaratish' : 'Yaratish'}
      </LoadingButton>
    </form>
  )
}
