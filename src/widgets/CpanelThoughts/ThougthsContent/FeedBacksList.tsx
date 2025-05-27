import { DataGridTable } from '@/components/table/DataGridTable'
import { useGet, usePatch } from '@/hooks/useApi'
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const FeedBacksList = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const paramsObject = Object.fromEntries(searchParams.entries())
  const [selectedData, setSelectedData] = useState<any | null>(null)
  const { t } = useTranslation()
  const { mutate: updateStatusMutate, isPending: updateLoading } = usePatch()
  const { data, isPending, refetch } = useGet('owner/feedback/list/', { params: paramsObject })
  const [status, setSelectedStatus] = useState<string>('')
  const renderStatusChip = (status: string) => {
    switch (status) {
      case 'new':
        return <Chip label='Yangi' color='info' variant='outlined' />
      case 'in_process':
        return <Chip label='Jarayonda' color='primary' variant='outlined' />
      case 'accepted':
        return <Chip label='Qabul qilindi' color='success' variant='outlined' />
      case 'resolved':
        return <Chip label='Hal qilindi' sx={{ backgroundColor: '#4caf50', color: 'white' }} />
      case 'rejected':
        return <Chip label='Rad etildi' color='error' variant='outlined' />
      default:
        return <Chip label='Nomaʼlum' variant='outlined' />
    }
  }

  const columns = [
    {
      field: 'id',
      headerName: t('ID'),
      flex: 0.5 
    },
    {
      field: 'client',
      headerName: t("O'quv markaz nomi"),
      flex: 1.2
    },
    {
      field: 'reviewer_info',
      headerName: t('F.i.o'),
      flex: 1
    },
    {
      field: 'role',
      headerName: t('Role'),
      flex: 1
    },
    {
      field: `${searchParams.get('description') || 'weaknesses'}`,
      headerName: t('Izoh'),
      flex: 1.5
    },
    {
      renderCell: (params: any) => {
        const status = params.value
        return renderStatusChip(status)
      },
      field: `${searchParams.get('description') === 'weaknesses' ? 'weakness_status' : 'suggestion_status'}`,
      headerName: t('status'),
      flex: 1
    }
  ]
  

  function onCLose() {
    setSelectedData(null)
    setSelectedStatus('')
  }

  function updateStatus() {
    const statusKey = searchParams.get('description') === 'weaknesses' ? 'weakness_status' : 'suggestion_status'

    const payload = {
      [statusKey]: status
    }

    updateStatusMutate(
      `owner/feedback/${selectedData.id}`,
      { ...payload },
      {
        onSuccess: () => {
          toast.success("Status o'zgartirildi")
          refetch()
          onCLose()
        },
        onError: () => {
          toast.error('Xatolik')
        }
      }
    )
  }

  useEffect(() => {
    if (selectedData) {
      const status =
        searchParams.get('description') == 'weaknesses'
          ? selectedData?.weakness_status
          : selectedData?.suggestion_status

      setSelectedStatus(status)
    }
  }, [selectedData])

  return (
    <Box>
      <DataGridTable
        rows={data?.results || []}
        columns={columns}
        loading={isPending}
        onRowClick={e => {
          searchParams.get('description') != 'strengths' && setSelectedData(e.row)
        }}
        localeText={uzbekLocaleText}
        hideFooter
      />
      <Dialog onClose={onCLose} maxWidth='xs' fullWidth open={Boolean(selectedData)}>
        <DialogTitle>Statusni o'zgartirish</DialogTitle>
        <DialogContent>
          <FormControl sx={{ marginTop: 3 }} fullWidth size='small'>
            <InputLabel id='status-label'>Status</InputLabel>
            <Select
              labelId='status-label'
              value={status}
              label='Status'
              onChange={(e: SelectChangeEvent) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value='new'>Yangi</MenuItem>
              <MenuItem value='in_process'>Jarayonda</MenuItem>
              <MenuItem value='accepted'>Qabul qilindi</MenuItem>
              <MenuItem value='resolve'>Hal qilindi</MenuItem>
              <MenuItem value='rejected'>Rad etildi</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={updateLoading} onClick={() => updateStatus()} fullWidth variant='contained'>
            O'zgartirish
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FeedBacksList
