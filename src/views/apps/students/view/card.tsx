import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Avatar,
  Chip,
  Grid,
  Box,
  styled,
  colors,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  TextField,
  DialogActions,
  IconButton,
  Skeleton
} from '@mui/material'
import CustomAvatar from '../../../../components/mui/avatar'
import * as Yup from 'yup'
import { Edit, Edit2Icon, MessageSquare, Plus, RefreshCw, Wallet } from 'lucide-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { getInitials } from 'src/@core/utils/get-initials'
import useBranches from 'src/hooks/useBranch'
import Form from '../../../../components/form'
import useGroups from 'src/hooks/useGroups'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail, fetchStudentGroups, fetchStudentPayment } from 'src/store/apps/students'
import showResponseError from 'src/@core/utils/show-response-error'
import IconifyIcon from '../../../../components/icon'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { today } from '../../../../components/card-statistics/kanban-item'
import { LoadingButton } from '@mui/lab'
import StudentPaymentForm from './StudentPaymentForm'
import StudentWithDrawForm from './StudentWithdrawForm'
import useSMS from 'src/hooks/useSMS'
import { SendSMSModal } from './UserViewLeft'
import { fetchSmsList } from 'src/store/apps/settings'
import useStudent from 'src/hooks/useStudents'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { Icon } from '@iconify/react'
import { TeacherAvatar, VisuallyHiddenInput } from '../../mentors/AddMentorsModal'
import { reversePhone } from 'src/components/phone-input/format-phone-number'
import api from 'src/@core/utils/api'
import { Add, Delete, Remove } from '@mui/icons-material'
import { useDelete, useGet, usePatch, usePost, usePut } from 'src/hooks/useApi'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import UserSuspendDialog from '../../mentors/view/UserSuspendDialog'
import { useFormik } from 'formik'
import { AccessDeniedModal } from '@components/AccessDeniedModal'

interface StudentCardProps {
  photo?: string
  name?: string
  id?: string | number
  userData?: any
  gpa?: number
  phone?: string
  balance?: string
  school?: string
}

const StyledCard = styled(Card)(() => ({
  width: '100%',
  overflow: 'hidden'
}))

const CardHeaderStyled = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(3)
}))

export type ModalTypes = 'group' | 'withdraw' | 'payment' | 'sms' | 'delete' | 'edit' | 'notes' | 'parent'

export default function StudentCard({
  userData,
  name,
  id,
  gpa,
  phone,
  balance,
  school
}: StudentCardProps): ReactElement {
  const { getBranches, branches } = useBranches()
  const [openEdit, setOpenEdit] = useState<ModalTypes | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const profilePhoto: any = useRef(null)
  const [open, setOpen] = useState(false)
  const { mergeStudentToGroup, getGroupShort, groupShort } = useGroups()
  const [isDiscount, setIsDiscount] = useState<boolean>(false)
  const router = useRouter()
  const [image, setImage] = useState<any>(null)
  const { companyInfo } = useAppSelector(state => state.user)
  const { updateStudent } = useStudent()
  const [groupDate, setGroupDate] = useState<any>(null)
  const school_type = localStorage.getItem('school_type')
  const [openModal, setOpenModal] = useState(false)
  const { t } = useTranslation()
  const [inputs, setInputs] = useState([{ key: '', value: '' }])
  const dispatch = useAppDispatch()
  const { mutate, isPending } = usePost()
  const [accessModal, setAccessModal] = useState<boolean>(false)
  const { mutate: deleteMutate, isPending: deletePending } = useDelete()
  const [deleteDetailModal, setDeleteDetailModal] = useState<string | number | null>(null)
  const [editItem, setEditItem] = useState<{ key: string; value: string; id: number } | null>(null)
  const queryClient = useQueryClient()
  const { mutate: editMutate, isPending: editPending } = usePatch()
  const { data: studentDetails, isLoading: studentDetailLoading } = useGet(`student/extradata/list/${userData.id}/`, {
    deps: ['student-data']
  })

  const formik = useFormik({
    initialValues: {
      key: editItem?.key || '',
      value: editItem?.value || ''
    },
    validationSchema: Yup.object({
      key: Yup.string().required("Ma'lumot nomini kiritish shart"),
      value: Yup.string().required("Ma'lumotni kiritish shart")
    }),
    onSubmit: values => {
      editMutate(`student/extradata/update/${editItem?.id}/`, values, {
        onSuccess: () => {
          toast.success("Ma'lumot o'zgartirildi")
          setEditItem(null)
          queryClient.invalidateQueries({ queryKey: [`student/extradata/list/${userData.id}/`, 'student-data'] })
        },
        onError: err => {
          toast.error(err.response.data)
        }
      })
    }
  })

  useEffect(() => {
    if (editItem) {
      formik.setFieldValue('key', editItem.key)
      formik.setFieldValue('value', editItem.value)
    }
  }, [editItem])

  const handleAddInput = () => {
    setInputs([...inputs, { key: '', value: '' }])
  }

  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    const newInputs = [...inputs]
    newInputs[index][field] = value
    setInputs(newInputs)
  }

  const onClose = () => {
    setOpen(false)
    setInputs([{ key: '', value: '' }])
  }

  const handleRemoveInput = (index: any) => {
    const newInputs = inputs.filter((_, i) => i !== index)
    setInputs(newInputs)
  }

  const handleMergeToGroup = async (value: any) => {
    setLoading(true)
    const data = {
      ...value,
      student: userData.id,
      groups: [+value.group]
    }

    try {
      const discountConfig = {
        discount_amount: value.fixed_price,
        discount_count: 100,
        discount_description: 'kurs oxirigacha',
        groups: [value?.group],
        student: userData?.id,
        is_discount: isDiscount
      }

      await mergeStudentToGroup({ ...data, ...discountConfig })
      setLoading(false)
      setOpenEdit(null)
      await dispatch(fetchStudentGroups(userData.id))
      await dispatch(fetchStudentDetail(userData.id))
      await dispatch(fetchStudentPayment(userData.id))
    } catch (err: any) {
      showResponseError(err.response.data, setError)
      setLoading(false)
    }
  }

  async function handleSave() {
    mutate(
      `student/extradata/create/`,
      { user_id: userData.id, extra_data: inputs },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [`student/extradata/list/${userData.id}/`, 'student-data'] })
          onClose()
        },
        onError: err => {
          toast.error("Barcha ma'lumotlarni to'ldiring")
        }
      }
    )
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = userData?.qr_code
    link.download = 'qr_code.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEditSubmit = async (values: any) => {
    setLoading(true)
    const newValues = new FormData()

    for (const [key, value] of Object.entries(values)) {
      if (!['image'].includes(key)) {
        if (key === 'phone') {
          newValues.append(key, reversePhone(value as any))
        } else if (key === 'school') {
          newValues.append(key, String(value))
        } else if (Array.isArray(value) || typeof value === 'object') {
          newValues.append(key, JSON.stringify(value))
        } else {
          newValues.append(key, value as any)
        }
      }
    }

    if (image) {
      newValues.append('image', image)
    } else {
      console.error('Invalid image type:', image)
    }

    try {
      await updateStudent(userData?.id, newValues)
      setLoading(false)
      setOpenEdit(null)
      await dispatch(fetchStudentDetail(userData.id))
    } catch (err: any) {
      setLoading(false)
      setError(err?.response?.data)
    }
  }

  function handleDeleteDetail() {
    deleteMutate(`student/extradata/destroy/${deleteDetailModal}/`, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`student/extradata/list/${userData.id}/`, 'student-data'] })

        toast.success("Muvaffaqiyatli o'chirildi")
        setDeleteDetailModal(null)
      },
      onError: err => {
        toast.error(err.response.data)
      }
    })
  }

  const handleEditClose = () => {
    setError({})
    setOpenEdit(null)
  }

  const handleEditClickOpen = (value: ModalTypes) => {
    if (value === 'group') {
      void getBranches()
    }
    setOpenEdit(value)
  }

  const handleOpenModals = () => {
    if(companyInfo.access) {
      dispatch(fetchSmsList());
      handleEditClickOpen('sms')
    } else {
      setAccessModal(true)
    }
  }

  return (
    <StyledCard>
      <CardHeaderStyled
        sx={{ marginBottom: 5 }}
        action={
          <Chip
            sx={{ backgroundColor: 'white' }}
            label={`${formatCurrency(balance ?? 0)} so'm`}
            size='small'
            variant='outlined'
            color={typeof balance === 'number' && balance >= 0 ? 'success' : 'error'}
          />
        }
      />
      <CardContent>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'start'}>
          <Box display='flex' gap={2} mb={3}>
            {userData?.image ? (
              <TeacherAvatar skin='light' color={'info'} variant='rounded' sx={{ width: 70, height: 70 }}>
                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={userData?.image} alt='user' />
              </TeacherAvatar>
            ) : (
              name && (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={'primary'}
                  sx={{ width: 70, height: 70, fontWeight: 600, mb: 1, fontSize: '2rem' }}
                >
                  {getInitials(name)}
                </CustomAvatar>
              )
            )}
            <Box>
              <Typography variant='h6' component='h3' gutterBottom>
                {name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <Chip
                  color='error'
                  label={`Baho: ${gpa?.toFixed(2)}`}
                  variant='outlined'
                  size='small'
                  sx={{
                    color: Number(gpa) >= 4 ? 'green' : Number(gpa) >= 3 ? 'orange' : 'red',
                    borderColor: Number(gpa) >= 4 ? 'green' : Number(gpa) >= 3 ? 'orange' : 'red'
                  }}
                />
                {userData?.qr_code && (
                  <img
                    src={userData?.qr_code}
                    alt=''
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenModal(true)}
                    width={50}
                    height={50}
                  />
                )}
              </Box>
              <Typography variant='body2' color='text.secondary' mt={1}>
                ID: {id}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant='body2' color='text.secondary'>
              Telefon raqam :
            </Typography>
            <Typography variant='body1'>{phone}</Typography>
          </Grid>
          {userData?.birth_date && (
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Tug'ilgan sanasi :
              </Typography>
              <Typography variant='body1'>{userData?.birth_date}</Typography>
            </Grid>
          )}
          {studentDetailLoading ? (
            <Skeleton width={'100%'} height={70} />
          ) : (
            studentDetails?.length !== 0 && (
              <Grid item xs={12}>
                {studentDetails?.map((item: { key: string; value: string; id: number }) => (
                  <Box gap={2} display={'flex'} alignItems={'center'}>
                    <Box
                      width='100%'
                      mb={2}
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: 2 }}
                      gap={2}
                    >
                      <div>
                        <Typography variant='body2' color='text.secondary'>
                          {item.key}:
                        </Typography>
                        <Typography variant='body1' sx={{ wordBreak: 'break-word' }}>
                          {item.value}
                        </Typography>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => setEditItem(item)}>
                          <Edit2Icon width={17} height={17} />
                        </IconButton>
                        <IconButton onClick={() => setDeleteDetailModal(item.id)} style={{ cursor: 'pointer' }}>
                          <Delete sx={{ width: 17, height: 17 }} color='error' />
                        </IconButton>
                      </div>
                    </Box>
                  </Box>
                ))}
              </Grid>
            )
          )}

          {school && (
            <Grid item xs={6}>
              <Typography variant='body2' color='text.secondary'>
                Maktab :
              </Typography>
              <Typography variant='body1'>{school}</Typography>
            </Grid>
          )}
        </Grid>

        {school_type == 'private_school' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
            <Box>
              <Typography color={'black'}>Keyingi to'lov</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon={'mdi:clock'} />
                <Typography fontSize={13}>{userData?.next_payment}</Typography>
              </Box>
            </Box>
            <Box>
              <Typography color={'black'}>To'lov narxi</Typography>
              <Typography color='green' fontSize={13}>
                {formatCurrency(userData?.contract_amount)} so'm
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          bgcolor: 'grey.50',
          borderColor: 'divider',
          padding: '10px'
        }}
      >
        <Box width='100%' gap={1}>
          <Button onClick={() => setOpen(true)} variant='outlined' fullWidth sx={{ marginBottom: 2 }}>
            O'quvchiga qo'shimcha ma'lumot qo'shish
          </Button>
          <Box display='flex' width='100%' marginBottom={2} gap={2}>
            <Button
              variant='contained'
              onClick={() => handleEditClickOpen('group')}
              startIcon={<Plus size={12} />}
              fullWidth
            >
              Guruhga qo'shish
            </Button>
            <Button
              variant='outlined'
              onClick={async () => handleEditClickOpen('payment')}
              startIcon={<Wallet size={12} />}
              fullWidth
            >
              To'lov qilish
            </Button>
          </Box>
          <Button
            variant='outlined'
            onClick={async () => handleEditClickOpen('withdraw')}
            color='error'
            startIcon={<Wallet size={16} />}
            fullWidth
          >
            Pul qaytarish
          </Button>
        </Box>
        <Box display='flex' gap={2} justifyContent='center' width='100%'>
          <Button onClick={handleOpenModals} variant='outlined' fullWidth>
            <MessageSquare size={15} />
          </Button>
          <Button variant='outlined' onClick={() => handleEditClickOpen('edit')} fullWidth>
            <Edit size={15} />
          </Button>
        </Box>
      </Box>
      <Dialog
        open={openEdit === 'group'}
        onClose={handleEditClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
        BackdropProps={{
          onClick: e => e.stopPropagation()
        }}
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t('Guruhga biriktirish')}
        </DialogTitle>
        <DialogContent>
          <Form
            reqiuredFields={['group']}
            setError={setError}
            valueTypes='json'
            sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}
            onSubmit={handleMergeToGroup}
            id='edit-efwemployee-gr'
          >
            <FormControl fullWidth>
              <InputLabel size='small' id='user-view-language-label'>
                {t('branch')}
              </InputLabel>
              <Select
                size='small'
                label={t('branch')}
                sx={{ marginBottom: 0 }}
                id='user-view-language'
                labelId='user-view-language-label'
                onChange={(e: any) => getGroupShort(e.target.value)}
              >
                {branches.map(branch => (
                  <MenuItem key={branch.id} value={branch.id}>{`${branch.name}`}</MenuItem>
                ))}
              </Select>
              <FormHelperText error={error.branch?.error}>{error.branch?.message}</FormHelperText>
            </FormControl>

            {groupShort && (
              <FormControl fullWidth>
                <InputLabel size='small' id='user-view-language-label'>
                  {t('Guruhni tanlang')}
                </InputLabel>
                <Select
                  size='small'
                  label={t('Guruhni tanlang')}
                  id='user-view-language'
                  labelId='user-view-language-label'
                  error={error.group?.error}
                  onChange={(e: any) => setGroupDate(e.target.value)}
                  name='group'
                  sx={{ marginBottom: '0px' }}
                >
                  {groupShort.map(branch => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                  <MenuItem sx={{ fontWeight: 600 }} onClick={() => router.push('/groups')}>
                    {t('Yangi yaratish')}
                    <IconifyIcon icon={'ion:add-sharp'} />
                  </MenuItem>
                </Select>
                <FormHelperText error={error.group}>{error.group?.message}</FormHelperText>
              </FormControl>
            )}

            {groupDate && (
              <FormControl sx={{ width: '100%' }}>
                {/* <InputLabel htmlFor='qwqwq' size='small'>{t('Qo\'shilish sanasi')}</InputLabel> */}
                <TextField
                  type='date'
                  size='small'
                  label={t("Qo'shilish sanasi")}
                  name='start_date'
                  // min={groupShort?.find(el => el.id === groupDate)?.start_date || ''}
                  defaultValue={today}
                  style={{ background: 'transparent', width: '100%' }}
                />
                <FormHelperText sx={{ marginBottom: '0px' }} error={error.start_date?.error}>
                  {error.start_date?.message}
                </FormHelperText>
              </FormControl>
            )}

            {isDiscount && (
              <div>
                <TextField
                  size='small'
                  label={t('Alohida narx')}
                  name='fixed_price'
                  type='number'
                  error={!!error.fixed_price}
                  // onChange={(e: any) => setDiscount(e.target.value)}
                  fullWidth
                />
                <FormHelperText className='mb-2' error={true}>
                  {error.fixed_price}
                </FormHelperText>
              </div>
            )}

            {groupDate && (
              <Button
                onClick={() => setIsDiscount(!isDiscount)}
                type='button'
                variant='outlined'
                size='small'
                color='warning'
              >
                {isDiscount ? "Alohida narxni o'chirish" : 'Alohida narx kiritish'}
              </Button>
            )}

            {groupShort && (
              <FormControl fullWidth>
                <TextField error={error?.body} rows={4} multiline label='Izoh' name='body' defaultValue={''} />
                <FormHelperText error={error.body}>{error.body?.message}</FormHelperText>
              </FormControl>
            )}

            <DialogActions sx={{ justifyContent: 'center' }}>
              <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                {t('Saqlash')}
              </LoadingButton>
              <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                {t('Bekor Qilish')}
              </Button>
            </DialogActions>
          </Form>
        </DialogContent>
      </Dialog>

      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />
      <Dialog
        open={openEdit === 'edit'}
        onClose={handleEditClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [2, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.3rem !important' }}>
          {t("O'quvchi ma'lumotlarini tahrirlash")}
        </DialogTitle>
        <DialogContent>
          {userData && (
            <Form
              reqiuredFields={['group']}
              setError={() => undefined}
              valueTypes='json'
              sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: '15px' }}
              onSubmit={handleEditSubmit}
              id='edit-fwe-fwefwfweepay'
            >
              <TeacherAvatar
                onClick={() => profilePhoto?.current?.click()}
                skin='light'
                color={'info'}
                variant='rounded'
                sx={{ cursor: 'pointer', margin: '0 auto 10px' }}
              >
                {profilePhoto.current?.files?.[0] || userData?.image ? (
                  <img
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    src={image ? URL.createObjectURL(image) : userData?.image ? userData?.image : ''}
                    alt=''
                  />
                ) : (
                  <IconifyIcon fontSize={40} icon={'material-symbols-light:add-a-photo-outline'} />
                )}
                <VisuallyHiddenInput
                  ref={profilePhoto}
                  name='image'
                  onChange={e => setImage(e.target?.files?.[0])}
                  type='file'
                  accept='.png, .jpg, .jpeg, .webp, .HEIC, .heic'
                />
              </TeacherAvatar>
              <FormControl sx={{ width: '100%' }}>
                <TextField
                  size='small'
                  label={t('first_name')}
                  name='first_name'
                  error={error.first_name}
                  defaultValue={userData?.first_name}
                />
                <FormHelperText error={error.first_name}>{error.first_name}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField
                  size='small'
                  label={t('phone')}
                  name='phone'
                  error={error.phone}
                  defaultValue={userData?.phone}
                />
                <FormHelperText error={error.phone}>{error.phone}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '100%' }}>
                <TextField
                  type='date'
                  size='small'
                  label={t('birth_date')}
                  name='birth_date'
                  error={error.birth_date}
                  defaultValue={userData?.birth_date}
                />
                <FormHelperText error={error.birth_date}>{error.birth_date}</FormHelperText>
              </FormControl>

              <DialogActions sx={{ justifyContent: 'center' }}>
                <LoadingButton loading={loading} type='submit' variant='contained' sx={{ mr: 1 }}>
                  {t('Saqlash')}
                </LoadingButton>
                <Button variant='outlined' type='button' color='secondary' onClick={handleEditClose}>
                  {t('Bekor qilish')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>QR Code</DialogTitle>
        <DialogContent className='flex justify-center p-4'>
          <img src={userData?.qr_code} alt='QR Code' className='w-40 h-40' />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownload} fullWidth variant='contained' color='primary'>
            Qr Codeni yuklash
          </Button>
        </DialogActions>
      </Dialog>
      <StudentPaymentForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <StudentWithDrawForm openEdit={openEdit} setOpenEdit={setOpenEdit} />
      <SendSMSModal
        handleEditClose={handleEditClose}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        userData={userData}
      />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Yangi Ma'lumot Qo'shish</DialogTitle>
        <DialogContent>
          {inputs.map((input, index) => (
            <div key={index} className='flex items-center gap-2 mb-2 mt-2'>
              <Box display={'flex'} alignItems={'center'}>
                <Box display={'flex'} width={'100%'} flexDirection={'column'} gap={2} mb={4}>
                  <TextField
                    size='small'
                    fullWidth
                    label="Ma'lumot nomi"
                    value={input.key}
                    onChange={e => handleChange(index, 'key', e.target.value)}
                  />
                  {input.key && (
                    <TextField
                      size='small'
                      fullWidth
                      label="Ma'lumot"
                      value={input.value}
                      onChange={e => handleChange(index, 'value', e.target.value)}
                    />
                  )}
                </Box>
                {index > 0 && (
                  <IconButton sx={{ width: 40, height: 40 }} onClick={() => handleRemoveInput(index)}>
                    <Delete />
                  </IconButton>
                )}
              </Box>
            </div>
          ))}
          <Button fullWidth variant='outlined' startIcon={<Add />} onClick={handleAddInput}>
            Yangi Qo'shish
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={onClose} color='error'>
            Bekor qilish
          </Button>
          <LoadingButton loading={isPending} onClick={handleSave} color='primary' variant='contained'>
            Saqlash
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(editItem)} onClose={() => setEditItem(null)} fullWidth maxWidth='sm'>
        <DialogTitle>Ma'lumotni tahrirlash</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin='dense'
              label="Ma'lumot nomi"
              name='key'
              value={formik.values.key}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.key && Boolean(formik.errors.key)}
              helperText={formik.touched.key && formik.errors.key}
            />

            <TextField
              fullWidth
              margin='dense'
              label="Ma'lumot"
              name='value'
              value={formik.values.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.value && Boolean(formik.errors.value)}
              helperText={formik.touched.value && formik.errors.value}
            />

            <DialogActions>
              <Button onClick={() => setEditItem(null)} color='error' variant='contained'>
                Bekor qilish
              </Button>
              <LoadingButton loading={editPending} variant='contained' color='primary' type='submit'>
                Saqlash
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <UserSuspendDialog
        open={Boolean(deleteDetailModal)}
        setOpen={setDeleteDetailModal}
        handleOk={handleDeleteDetail}
        loading={deletePending}
      />
    </StyledCard>
  )
}
