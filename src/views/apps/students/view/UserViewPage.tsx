import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import VideoHeader, { videoUrls } from 'src/components/video-header/video-header'
import api from 'src/@core/utils/api'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchStudentDetail, fetchStudentPayment, setGroupChecklist } from 'src/store/apps/students'
import UserViewLeft from 'src/views/apps/students/view/UserViewLeft'
import UserViewRight from 'src/views/apps/students/view/UserViewRight'
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { uzbekLocaleText } from '../../StudentsPoints/constants'
import IconifyIcon from 'src/components/icon'
import { formatCurrency } from 'src/@core/utils/format-currency'
import useResponsive from 'src/@core/hooks/useResponsive'
import StudentPaymentEditForm from './StudentPaymentEdit'
import { LoadingButton } from '@mui/lab'
import usePayment from 'src/hooks/usePayment'

const UserView = ({ tab, student }: any) => {
  const url = tab

  const { studentData, studentId, payments, isLoading } = useAppSelector(state => state.students)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const [edit, setEdit] = useState<any>(null)
  const [deleteId, setDelete] = useState<any>(null)
  const { deletePayment } = usePayment()
  const { isMobile } = useResponsive()
  const [loading, setLoading] = useState<any>(null)
  const { query } = useRouter()
  const columns: GridColDef[] = [
    {
      width: 100,
      headerName: t('ID'),
      field: 'id'
    },
    {
      width: 150,
      headerName: t('Sana'),
      field: 'payment_date',
      renderCell: params => (
        <Tooltip title={params.value || ''}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      headerName: t('Turi'),
      width: 115,
      field: 'condition',
      renderCell: params => (
        <Tooltip title={params.value !== 'debt' ? "To'landi" : 'Qarzdorlik'}>
          <Chip
            size='small'
            label={params.value !== 'debt' ? "To'landi" : 'Qarzdorlik'}
            color={params.value !== 'debt' ? 'success' : Number(params.row.amount) === 0 ? 'secondary' : 'error'}
          />
        </Tooltip>
      )
    },
    {
      width: 150,
      headerName: t('Summa'),
      field: 'amount',
      renderCell: params => (
        <Tooltip title={`${formatCurrency(params?.value)} UZS`}>
          <span>
            {Number(params.value) <= 0
              ? `${formatCurrency(Number(params.value) * -1)} UZS`
              : `${formatCurrency(params.value)} UZS`}
          </span>
        </Tooltip>
      )
    },
    {
      width: 140,
      headerName: t('Guruh'),
      field: 'group_name',
      renderCell: params => (
        <Tooltip title={params.value || ''}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      width: 200,
      headerName: t('Izoh'),
      field: 'description',
      renderCell: params => (
        <Tooltip title={params.value || ''}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      headerName: 'Yaratilgan vaqt',
      width: 160,
      field: 'created_at',
      renderCell: params => (
        <Tooltip title={params.value || ''}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      width: 120,
      headerName: t("To'lov turi"),
      field: 'payment_type_name'
    },
    {
      width: 150,
      headerName: t('Qabul qildi'),
      field: 'admin'
    },
    {
      headerName: t('Amallar'),
      field: '',
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: '5px' }}>
          <IconifyIcon onClick={() => handleEdit(params.row.id)} icon='mdi:pencil-outline' fontSize={20} />
          {Number(params.row.amount) > 0 && (
            <IconifyIcon onClick={() => setDelete(params.row.id)} icon='mdi:delete-outline' fontSize={20} />
          )}
          {Number(params.row.amount) < 0 ? (
            ''
          ) : loading === params.row.id ? (
            <IconifyIcon icon={'la:spinner'} fontSize={20} />
          ) : isMobile ? (
            <IconifyIcon onClick={() => handleDownload(params.row.id)} icon={`ph:receipt-light`} fontSize={20} />
          ) : (
            <IconifyIcon onClick={() => getReceipt(params.row.id)} icon={`ph:receipt-light`} fontSize={20} />
          )}
        </Box>
      )
    }
  ]

  const handlePrint = async (id: number | string) => {
    const subdomain = location.hostname.split('.')
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? process.env.NEXT_PUBLIC_TEST_BASE_URL
            : subdomain.length < 3
            ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
            : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`
        }/common/generate-check/${id}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      const data = await response.blob()
      const blobUrl = URL.createObjectURL(data)
      const printFrame: HTMLIFrameElement | null = document.getElementById('printFrame') as HTMLIFrameElement
      if (printFrame) {
        printFrame.src = blobUrl
        printFrame.onload = function () {
          if (printFrame.contentWindow) {
            printFrame.contentWindow?.print()
          }
        }
      }
    } catch (error) {
      console.error('Print error:', error)
    }
  }

  async function getReceipt(id: any) {
    setLoading(id)
    try {
      await handlePrint(id)
    } catch (err) {
      console.log(err)
    }
    setLoading(null)
  }

  const handleDownload = async (id: number | string) => {
    setLoading(true)
    const subdomain = location.hostname.split('.')
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === 'development'
            ? process.env.NEXT_PUBLIC_TEST_BASE_URL
            : subdomain.length < 3
            ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
            : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}`
        }/common/generate-check/${id}/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      )
      setLoading(false)
      const data = await response.blob()
      const blobUrl = URL.createObjectURL(data)

      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = `check-${id}.pdf`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      setLoading(false)
      console.error('Download error:', error)
    }
  }

  const onHandleDelete = async () => {
    setLoading(true)
    await deletePayment(deleteId)
    setLoading(false)
    setDelete(false)
    await dispatch(fetchStudentPayment(query?.student))
    await dispatch(fetchStudentDetail(Number(query?.student)))
  }

  const handleEdit = (id: any) => {
    setEdit(payments.find((el: any) => el.id === id))
  }

  async function getGroups() {
    await api
      .get(`common/group-check-list/?student=${studentData?.id}`)
      .then(res => dispatch(setGroupChecklist(res.data)))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    if (studentData?.id) {
      getGroups()
    }
  }, [studentData?.id])

  const studentDetailParam = useMemo(() => student || studentId, [student, studentId])

  useEffect(() => {
    if (!user?.role?.some((role: string) => ['ceo', 'admin', 'watcher', 'marketolog'].includes(role))) {
      router.push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
      return
    }
    dispatch(fetchStudentPayment(query?.student))
    dispatch(fetchStudentDetail(studentDetailParam))
  }, [studentDetailParam])

  return (
    <div>
      <VideoHeader item={videoUrls.students} />
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <UserViewLeft userData={studentData} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <UserViewRight studentData={studentData} tab={url} invoiceData={[]} />
        </Grid>
      </Grid>
      <Typography sx={{ my: 3, fontSize: '20px' }}>{t("To'lov tarixi")}</Typography>
      <Box style={{ height: 'auto', width: '100%', marginTop: 2 }}>
        <DataGrid
          autoHeight
          selectionModel={[]}
          hideFooterPagination
          loading={isLoading}
          localeText={uzbekLocaleText}
          rows={payments ?? []}
          columns={columns}
        />
      </Box>
      <StudentPaymentEditForm openEdit={edit} setOpenEdit={setEdit} />
      <Dialog
        open={deleteId}
        onClose={() => setDelete(null)}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 350, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          To'lovni o'chirishni tasdiqlang
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant='contained' onClick={() => setDelete(null)}>
              {t('Bekor qilish')}
            </Button>
            <LoadingButton variant='contained' color='error' onClick={onHandleDelete} loading={loading}>
              {t("O'chirish")}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserView
