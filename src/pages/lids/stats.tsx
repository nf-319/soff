'use client'
import { useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
  IconButton as IconButtonMui,
  Tabs,
  Tab,
  Card
} from '@mui/material'
import api from 'src/@core/utils/api'
import { DateRangePicker, IconButton } from 'rsuite'
import 'rsuite/DateRangePicker/styles/index.css'
import Router, { useRouter } from 'next/router'
import format from 'date-fns/format'
import IconifyIcon from '../../components/icon'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'
import dynamic from 'next/dynamic'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import SourceStatsVertical from '../../components/card-statistics/card-source-vertical'
import { EmptyContent } from '../../components/empty-content'
import { Metadata } from '@/components/Metada'

const CustomeDrawer = dynamic(() => import('../settings/office/courses').then(mod => mod.CustomeDrawer))

const Stats = () => {
  const [sources, setSources] = useState<{ id: number; name: string; count: number }[]>([])
  const [date, setDate] = useState<any>('')
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const getSources = async () => {
    const start_date = date?.[0] ? format(date?.[0], 'yyyy-MM-dd') : ''
    const end_date = date?.[1] ? format(date?.[1], 'yyyy-MM-dd') : ''

    await api
      .get(`leads/statistic/`, { params: { start_date, end_date, branch: user?.active_branch } })
      .then(resp => setSources(resp.data.result))
      .catch(err => console.error(err))
  }

  const handleChangeDate = (e: any) => {
    setDate(e)
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Nom kiriting')
  })

  const initialValues = { name: '' }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async valuess => {
      setLoading(true)
      try {
        await api.post(`leads/source/`, valuess)
        await getSources()
        formik.resetForm()
        setOpen(false)
      } catch (err: any) {
        if (err?.response?.data) {
          formik.setErrors(err?.response?.data)
        }
      }
      setLoading(false)
    }
  })

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      void router.push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    void getSources()
  }, [date])

  return (
    <div>
      <Metadata title='Manba' />

      <Box>
        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center' }}>
          <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Manbalar hisoboti')}</Typography>
          <Button
            onClick={() => setOpen(true)}
            variant='contained'
            sx={{ marginLeft: 'auto' }}
            size='small'
            startIcon={<IconifyIcon icon={'carbon:add'} />}
          >
            {t('Yangi Manba')}
          </Button>
        </Box>
        <Box sx={{ alignItems: 'center', paddingBottom: '20px', flexWrap: 'nowrap', width: '100%', display: 'flex' }}>
          <DateRangePicker
            format='yyyy-MM-dd'
            onChange={handleChangeDate}
            translate={'yes'}
            size='sm'
            style={{ marginRight: 20 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {sources.length ? (
            sources.map((el, i) => (
              <Box key={i} className='' sx={{ cursor: 'pointer', minHeight: '100px', minWidth: '180px' }}>
                <SourceStatsVertical title={el.name} stats={String(el.count)} color={'success'} />
              </Box>
            ))
          ) : (
            <EmptyContent />
          )}
        </Box>
      </Box>

      <CustomeDrawer open={open} variant='temporary' anchor='right'>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t('Yangi manba yaratish')}
          </Typography>

          <IconButton
            aria-label='close'
            onClick={() => {
              setOpen(false), formik.resetForm()
            }}
            icon={<IconifyIcon icon={'mdi:close'} />}
          />
        </DialogTitle>

        <DialogContent sx={{ minWidth: '320px' }}>
          <form style={{ paddingTop: '10px' }} onSubmit={formik.handleSubmit}>
            <FormControl sx={{ width: '100%', marginBottom: '10px' }}>
              <TextField
                fullWidth
                size='small'
                label={t('Manba nomi')}
                name='name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={!!formik.errors.name && formik.touched.name}
              />
              {formik.errors.name && formik.touched.name && (
                <FormHelperText error={true}>{formik.errors.name}</FormHelperText>
              )}
            </FormControl>

            <LoadingButton type='submit' loading={loading} fullWidth variant='contained'>
              {t('Saqlash')}
            </LoadingButton>
          </form>
        </DialogContent>
      </CustomeDrawer>
    </div>
  )
}

export default Stats
