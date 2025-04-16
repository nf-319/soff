import { formatCurrency } from '@/@core/utils/format-currency'
import { useAppDispatch, useAppSelector } from '@/store'
import { setOpenDebtorsModal } from '@/store/apps/groupDetails'
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Edit2, Save, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { uzbekLocaleText } from '../StudentsPoints/constants'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '@/components/icon'
import { useGroupDebtors } from '@/hooks/useGroupDebtors'
import { useRouter } from 'next/router'
import StudentPaymentEditForm from '../students/view/StudentPaymentEdit'
import api from '@/@core/utils/api'
import { LoadingButton } from '@mui/lab'
import usePayment from '@/hooks/usePayment'

export default function DebtorsModal() {
  const dispatch = useAppDispatch()
  const [deleteId, setDelete] = useState<any>(null)

  const { openDebtorsModal } = useAppSelector(state => state.groupDetails)
  const [isEditing, setIsEditing] = useState(false)
  const [loading,setLoading] = useState(false)
  const router = useRouter()
    const { deletePayment } = usePayment()
  const [edit, setEdit] = useState<any>()
  const { t } = useTranslation()
  const [editSucces, setEditSuccess] = useState(false)
  const { data, isLoading, refetch } = useGroupDebtors(Number(router.query.id), Boolean(edit))

  const handleEdit = async (id: any) => {
    await api.get(`common/student-payment/${id}/`).then(res => {
      setEdit(res.data)
    })
  }
  const onHandleDelete = async () => {
    setLoading(true)
    await deletePayment(deleteId)
    setLoading(false)
    refetch()
    setDelete(false)
  }

  const columns: GridColDef[] = [
    {
      width: 70,
      headerName: t('ID'),
      field: 'id'
    },
    {
      width: 130,
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
      width: 130,
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
      width: 140,
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
      width: 120,
      headerName: t('Bonus'),
      field: 'bonus',
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
      width: 120,
      headerName: t('Guruh'),
      field: 'group_name',
      renderCell: params => (
        <Tooltip title={params.value || ''}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      width: 120,
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
      headerName: t('Amallar'),
      field: '',
      renderCell: params => (
        <Box sx={{ display: 'flex', gap: '5px' }}>
          <IconifyIcon onClick={() => handleEdit(params.row.id)} icon='mdi:pencil-outline' fontSize={20} />
          {Number(params.row.amount) > 0 && (
            <IconifyIcon onClick={() => setDelete(params.row.id)} icon='mdi:delete-outline' fontSize={20} />
          )}
        </Box>
      )
    }
  ]

  const handleSave = () => {
    setIsEditing(false)
  }

  useEffect(() => {
    if (editSucces == true) {
      refetch()
      setEditSuccess(false)
    }
  }, [editSucces])

  return (
    <Dialog
      onClose={() => dispatch(setOpenDebtorsModal(false))}
      aria-labelledby='user-view-edit'
      fullWidth
      maxWidth='lg'
      aria-describedby='user-view-edit-description'
      open={openDebtorsModal}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>Qarzdorlar</Typography>
        <IconButton onClick={() => dispatch(setOpenDebtorsModal(false))}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {data?.response?.map((item: any) => (
          <>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'end' }}>
                <User color='#00a6fb' />
                <Typography fontSize={15}>{item.student.first_name}</Typography>
              </div>
              <div>
                <Chip variant='filled' color='error' label={`Balansi  ${item.student_group_balance} so'm`} />
              </div>
            </div>
            <DataGrid
              autoHeight
              selectionModel={[]}
              hideFooterPagination
              loading={isLoading}
              localeText={uzbekLocaleText}
              rows={item?.debt_data || []}
              columns={columns}
            />
          </>
        ))}
      </DialogContent>
      <StudentPaymentEditForm setEditSuccess={setEditSuccess} openEdit={edit} setOpenEdit={setEdit} />
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
    </Dialog>
  )
}
