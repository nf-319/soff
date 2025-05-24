import * as Yup from 'yup'
import { useContext, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { customTableProps } from 'src/pages/groups'
import DataTable from '../../../components/table'
import IconifyIcon from '../../../components/icon'
import Form from '../../../components/form'
import api from 'src/@core/utils/api'
import LoadingButton from '@mui/lab/LoadingButton'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import showResponseError from 'src/@core/utils/show-response-error'
import CustomDialog from 'src/views/apps/settings/form/CustomDialog'
import { useFormik } from 'formik'
import { AuthContext } from 'src/context/AuthContext'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { FormUpdateModal } from '@/entities/FormsUpdateModal'
import { useGet } from '@/hooks/useApi'
import { resetForm } from '@store/apps/form'
import { useAppDispatch } from '@/store'
import { Metadata } from '@/components/Metada'

export default function FormsPage() {
  const [open, setOpen] = useState<null | 'new' | 'integration' | 'delete' | 'edit'>(null)
  const [departments, setDepartments] = useState<any[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [error, setError] = useState<any>({})
  const dispatch = useAppDispatch()
  const [deleteId, setDeleteId] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { data, refetch, isPending } = useGet('leads/form/list/', {
    deps: ['form-list'],
    options: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  })
  const [sourceData, setSourceData] = useState<any>([])
  const [selectedForm, setSelectedForm] = useState<any>(null)
  const [updateOpen, setUpdateOpen] = useState<boolean>(false)
  const [addSource, setAddSource] = useState<boolean>(false)
  const router = useRouter()
  const bgColors = UseBgColor()
  const { t } = useTranslation()
  const { push } = useRouter()
  const { user } = useContext(AuthContext)

  const columns: customTableProps[] = [
    {
      xs: 0.1,
      title: '#',
      dataIndex: 'index'
    },
    {
      xs: 1,
      title: t('Nomi'),
      dataIndex: 'title'
    },
    {
      xs: 1,
      title: t("Lid bo'limi"),
      dataIndex: 'source_department',
      render: (source_department: any) => source_department.department
    },
    {
      xs: 1,
      title: t('Manba'),
      dataIndex: 'source_department',
      render: (source_department: any) => source_department.source
    },
    {
      xs: 1,
      title: t('Tushgan lidlar soni'),
      dataIndex: 'user_count'
    },
    {
      xs: 2.4,
      title: t('Link'),
      dataIndex: 'uuid',
      render: (link: string) => `${link}`
    },
    {
      xs: 1,
      title: t('Integratsiya'),
      dataIndex: 'id',
      render: id => (
        <Button size='small' onClick={() => (setDeleteId(id), setOpen('integration'))}>
          <IconifyIcon icon={'oui:integration-general'} />
        </Button>
      )
    },
    {
      xs: 0.5,
      title: t('Amallar'),
      dataIndex: 'id',
      render: id => (
        <Box display='flex' alignItems='center'>
          <Tooltip title="O'zgartirish" enterDelay={500}>
            <IconButton
              size='medium'
              color='primary'
              onClick={() => {
                router.push({
                  pathname: '/settings/forms/[id]',
                  query: { id }
                })
              }}
            >
              <Edit color='blue' size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title="O'chirish" enterDelay={500} leaveDelay={200}>
            <IconButton size='medium' color='error' onClick={() => (setDeleteId(id), setOpen('delete'))}>
              <Trash2 color='red' size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const subdomain = location.hostname.split('.')
  const baseURL = subdomain.length < 3 ? `test` : `${subdomain[0]}`

  const handleClick = (id: string) => {
    const value = data?.find((el: any) => el.id === id)
    const textArea = document.createElement('textarea')
    textArea.value = `https://forms.soffcrm.uz/form/${value.uuid}/${baseURL}/`
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Unable to copy to clipboard', err)
    }
    document.body.removeChild(textArea)
    toast.success('Link nusxalandi', { position: 'top-center' })
  }

  async function onSubmit(values: any) {
    setLoading(true)
    try {
      await api.post('leads/application-form/create/', values)
      setOpen(null)
      setLoading(false)
      refetch()
    } catch (err: any) {
      showResponseError(err?.response.data, setError)
      setLoading(false)
    }
  }

  async function onDelete() {
    setLoading(true)
    try {
      await api.delete(`leads/form/delete/${deleteId}/`)
      setOpen(null)
      setLoading(false)
      refetch()
    } catch (err: any) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      void push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
  }, [])

  const formik: any = useFormik({
    initialValues: {
      pixel_script: ''
    },
    validationSchema: Yup.object({
      pixel_script: Yup.string().required('Script kod majburiy')
    }),
    onSubmit: async values => {
      setLoading(true)
      try {
        const response = await api.patch(`leads/application-form/update/${deleteId}/`, values)
        if (response.status == 200) {
          setOpen(null)
          toast.success('Kod saqlandi', { position: 'top-center' })
          formik.resetForm()
        }
      } catch (error: any) {
        formik.setErrors(error.response.data)
      } finally {
        setLoading(false)
      }
    }
  })

  const handleAddClick = ()=> {
    dispatch(resetForm())
    void push(`/settings/forms/create`)
  }

  return (
    <Box>
      <Metadata title='Formalar'/>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <Typography variant='h5'>{t('Formalar')}</Typography>
        <Button
          variant='contained'
          startIcon={<Plus size={20} />}
          onClick={handleAddClick}
        >
          Yangi
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column', mt: '10px' }}>
        <Alert icon={false} sx={{ py: 2, mb: 0, ...bgColors.primaryLight, '& .MuiAlert-message': { p: 0 } }}>
          <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>
            {t('Linkni nusxalash uchun qatorning istalgan joyiga bosing')}
          </Typography>
        </Alert>
      </Box>

      <DataTable loading={isPending} columns={columns} data={data || []} rowClick={handleClick} />

      <FormUpdateModal
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        formData={selectedForm}
        onSuccess={() => refetch()}
      />

      <Dialog open={open === 'new'} onClose={() => setOpen(null)}>
        <DialogTitle minWidth={'300px'} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontSize={'18px'}>{t('Yangi forma')}</Typography>
          <span onClick={() => setOpen(null)}>
            <IconifyIcon icon={'ic:baseline-add'} style={{ transform: 'rotate(45deg)', cursor: 'pointer' }} />
          </span>
        </DialogTitle>

        <DialogContent>
          <Form
            setError={setError}
            reqiuredFields={['department', 'departmentParent', 'title']}
            id='create-form'
            onSubmit={onSubmit}
            sx={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}
          >
            <FormControl fullWidth>
              <TextField size='small' label='Nomi' name='title' error={error?.title?.error} />
              <FormHelperText error={error.title?.error}>{error.title?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t("Bo'lim")}
              </InputLabel>

              <Select
                size='small'
                error={error.departmentParent?.error}
                label={t("Bo'lim")}
                id='user-view-language'
                labelId='user-view-language-label'
                name='departmentParent'
                defaultValue={''}
                onChange={(e: any) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText error={error.departmentParent?.error}>{error.departmentParent?.message}</FormHelperText>
            </FormControl>

            {selectedDepartment && (
              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t("Quyi bo'lim")}
                </InputLabel>
                <Select
                  size='small'
                  error={error.department?.error}
                  label={t("Quyi bo'lim")}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  name='department'
                  defaultValue={''}
                >
                  {departments
                    .find(el => Number(el.id) === selectedDepartment)
                    .children.map((item: any) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText error={error.department?.error}>{error.department?.message}</FormHelperText>
              </FormControl>
            )}

            {!addSource ? (
              <FormControl fullWidth>
                <InputLabel size='small' id='fsdgsdgsgsdfsd-label'>
                  {t('Manba')}
                </InputLabel>
                <Select
                  size='small'
                  error={error.source?.error}
                  label={t('Manba')}
                  id='fsdgsdgsgsdfsd'
                  labelId='fsdgsdgsgsdfsd-label'
                  name='source'
                  onChange={(e: any) => setAddSource(e?.target?.value === 0)}
                  sx={{ mb: 1 }}
                >
                  {sourceData.map((lead: any) => (
                    <MenuItem key={lead.id} value={lead.id}>
                      {lead.name}
                    </MenuItem>
                  ))}
                  {/* <MenuItem value={0} sx={{ fontWeight: '600' }}><IconifyIcon icon={'ic:baseline-add'} /> Yangi qo'shish</MenuItem> */}
                </Select>
                <FormHelperText error={error.source?.error}>{error.source?.message}</FormHelperText>
              </FormControl>
            ) : null}

            {addSource ? (
              <FormControl fullWidth>
                <TextField fullWidth error={error.first_name?.error} size='small' label={t('Manba')} name='source' />
                <FormHelperText error={error.source?.error}>{error.source?.message}</FormHelperText>
              </FormControl>
            ) : null}

            <LoadingButton loading={loading} variant='contained' type='submit'>
              {t('Yaratish')}
            </LoadingButton>
          </Form>
        </DialogContent>
      </Dialog>

      <CustomDialog
        open={open === 'delete'}
        onClose={() => setOpen(null)}
        title={t("Formani o'chirmoqchimisiz")}
        content={
          <Typography sx={{ fontSize: '20px', margin: '30px 20px' }}>{t("Formani o'chirmoqchimisiz")}?</Typography>
        }
        loading={loading}
        onConfirm={onDelete}
        confirmText={t("O'chirish")}
        cancelText={t('Bekor qilish')}
      />
      <CustomDialog
        open={open === 'delete'}
        onClose={() => setOpen(null)}
        title={t("Formani o'chirmoqchimisiz")}
        content={
          <Typography sx={{ fontSize: '20px', margin: '30px 20px' }}>{t("Formani o'chirmoqchimisiz")}?</Typography>
        }
        loading={loading}
        onConfirm={onDelete}
        confirmText={t("O'chirish")}
        cancelText={t('Bekor qilish')}
      />

      <CustomDialog
        open={open === 'integration'}
        onClose={() => setOpen(null)}
        title={t('Facebook Pixel Script')}
        content={
          <div>
            <TextField
              label='Script kod'
              name='pixel_script'
              multiline
              sx={{ width: '100%', mb: 2 }}
              rows={4}
              value={formik.values.pixel_script}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pixel_script && Boolean(formik.errors.pixel_script)}
              helperText={formik.touched.pixel_script && formik.errors.pixel_script}
            />
          </div>
        }
        loading={loading}
        onConfirm={formik.handleSubmit}
        confirmText={t('Saqlash')}
        cancelText={t('Bekor qilish')}
      />
    </Box>
  )
}
