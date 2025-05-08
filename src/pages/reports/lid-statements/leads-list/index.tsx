'use client'

import { Box, Button, MenuItem, Select, Typography, Chip, CircularProgress } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataGrid } from '@mui/x-data-grid'
import { useGetReportLeadsList } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReportsLeadsListItemType } from '@/types/report'
import { LidsDragonModal } from '@/views/apps/lids/LidsDragonModal'
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import DataGridWrapper from '@/components/table/dataGridTable'

export const temperateOptions = [
  { value: '', label: 'Barcha haroratlar' },
  { value: 'hot', label: 'Issiq' },
  { value: 'warm', label: 'Iliq' },
  { value: 'cold', label: 'Sovuq' }
]

export const states = [
  { value: '', label: 'Barcha holatlar' },
  { value: 'new', label: 'Yangi' },
  { value: 'connected', label: "Bog'lanilgan" },
  { value: 'not_connected', label: "Bog'lanilmagan" },
  { value: 'test_period', label: 'Sinov darsida' },
  { value: 'enrolled', label: "Sotuv bo'ldi" },
  { value: 'rejected', label: "Yo'qotilgan" }
]

const LeadsList = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { branch } = router.query
  const branchParam = branch && branch !== 'undefined' ? String(branch) : undefined
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageSizeOffset, setPageSizeOffset] = useState(0)
  const [selectedLead, setSelectedLead] = useState<ReportsLeadsListItemType | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [temperateValue, setTemperateValue] = useState('')
  const [stateValue, setStateValue] = useState('')
  const queryClient = useQueryClient()
  const leadsSellers: any = queryClient.getQueryData([QueryKeys.ReportsLeadsSellers])

  const [adminValue, setAdminValue] = useState('')
  const tableRef = useRef<HTMLDivElement | null>(null)
  const { data, isLoading } = useGetReportLeadsList({
    page,
    limit: pageSize,
    branch: branchParam,
    temperature: temperateValue,
    status: stateValue,
    admin: adminValue
  })

  useEffect(() => {
    setPage(1)
    setPageSizeOffset(0)
    setTemperateValue('')
    setStateValue('')
  }, [branchParam])

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [temperateValue, stateValue, adminValue])

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && data?.count && page < Math.ceil(data.count / pageSize)) {
      setPage(prev => prev + 1)
      setPageSizeOffset(prev => prev + pageSize)
    } else if (direction === 'prev' && page > 1) {
      setPage(prev => prev - 1)
      setPageSizeOffset(prev => prev - pageSize)
    }
  }

  const handlePageSizeChange = (event: any) => {
    const newSize = Number(event.target.value)
    setPageSize(newSize)
    setPage(1)
    setPageSizeOffset(0)
  }

  const statusMap: { [key: string]: { label: string; color: string } } = {
    new: { label: 'Yangi', color: 'primary' },
    connected: { label: "Bog'lanildi", color: 'success' },
    not_connected: { label: "Bog'lanilmadi", color: 'error' },
    test_period: { label: 'Sinov darsida', color: 'warning' },
    enrolled: { label: "Sotuv bo'ldi", color: 'success' },
    rejected: { label: "Yo'qotilgan", color: 'error' }
  }

  const temperatureMap: { [key: string]: { label: string; color: string } } = {
    hot: { label: 'Issiq', color: 'success' },
    col: { label: 'Sovuq', color: 'error' },
    warm: { label: 'Iliq', color: 'warning' }
  }

  const columns = [
    {
      field: 'index',
      headerName: t('ID'),
      width: 70,
      valueGetter: (params: any) => `${pageSizeOffset + params.api.getRowIndex(params.id) + 1}`
    },
    {
      field: 'first_name',
      headerName: t('ism'),
      width: 150
    },
    {
      field: 'phone',
      headerName: t('Telefon raqam'),
      width: 150
    },
    {
      field: 'admin',
      headerName: t('admin'),
      width: 150
    },
    {
      width: 150,
      field: 'status',
      headerName: t('Status'),
      renderCell: (params: any) => {
        const status = params.value
        const statusInfo = statusMap[status] || { label: status, color: 'default' }
        return (
          <Chip
            label={statusInfo.label}
            variant='outlined'
            color={statusInfo.color as 'primary' | 'success' | 'error' | 'warning' | 'default'}
          />
        )
      }
    },
    {
      field: 'temperature',
      headerName: 'Harorat',
      width: 200,
      renderCell: (params: any) => {
        const status = params.value
        const statusInfo = temperatureMap[status] || { label: status || 'Belgilanmagan', color: 'default' }
        return (
          <Chip
            label={statusInfo.label}
            variant='outlined'
            color={statusInfo.color as 'success' | 'error' | 'warning'}
          />
        )
      }
    },
    {
      field: 'course',
      headerName: t('Kurs'),
      width: 250
    },
    {
      field: 'source',
      headerName: t('Manba'),
      width: 150
    }
  ]

  if (isLoading || !branchParam) {
    return (
      <Box display='flex' justifyContent='center' py={5}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: '#fff', p: 6, border: '1px solid #e0e0e0', borderRadius: 1, display: 'grid', gap: 3 }}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box>
          <Typography variant='h5' sx={{ mb: 2 }}>
            Lidlar ro'yxati
          </Typography>
        </Box>

        <Chip
          color='default'
          variant='outlined'
          sx={{ borderRadius: 1 }}
          label={`Barcha lidlar - ${data?.count || 0} ta`}
        />
      </Box>

      <Box
        flexDirection={{ xs: 'column', md: 'row' }}
        display='flex'
        alignItems='center'
        justifyContent='center'
        width='100%'
        gap={3}
      >
        <Select size='small' fullWidth value={stateValue} onChange={e => setStateValue(e.target.value)} displayEmpty>
          {states.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <Select size='small' fullWidth value={adminValue} onChange={e => setAdminValue(e.target.value)} displayEmpty>
          <MenuItem value=''>Barcha holatlar</MenuItem>
          {leadsSellers?.map((option: any) => (
            <MenuItem key={option.value} value={option.id}>
              {option.first_name}
            </MenuItem>
          ))}
        </Select>

        <Select
          size='small'
          value={temperateValue}
          fullWidth
          onChange={e => setTemperateValue(e.target.value)}
          displayEmpty
        >
          {temperateOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        ref={tableRef}
        sx={{
          width: '100%',
          overflowY: 'hidden',
          overflowX: 'auto',
          '& .MuiDataGrid-root': {
            overflowY: 'hidden',
            overflowX: 'auto',
            borderRadius: 1,
            border: '1px solid #e0e0e0'
          }
        }}
      >
        <DataGridWrapper
          rows={data?.results || []}
          columns={columns}
          getRowId={row => row.id}
          loading={isLoading}
          disableSelectionOnClick
          localeText={uzbekLocaleText}
          onRowClick={params => {
            setSelectedLead(params.row)
            setOpenModal(true)
          }}
          hideFooter
        />
      </Box>

      <Box display='flex' justifyContent='space-between' alignItems='center' mt={2}>
        <Box display='flex' alignItems='center' gap={1}>
          <Typography>{t('Sahifada:')}</Typography>
          <Select value={pageSize} sx={{ height: '30px', width: '90px' }} onChange={handlePageSizeChange} size='small'>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </Box>

        <Box display='flex' gap={2}>
          <Button
            variant='outlined'
            size='small'
            onClick={() => handlePageChange('prev')}
            startIcon={<ChevronLeft size={18} />}
            disabled={page === 1}
          >
            Oldingi
          </Button>

          <Button
            variant='outlined'
            size='small'
            onClick={() => handlePageChange('next')}
            endIcon={<ChevronRight size={18} />}
            disabled={data?.count ? page >= Math.ceil(data.count / pageSize) : true}
          >
            Keyingi
          </Button>
        </Box>
      </Box>

      <LidsDragonModal selectedLead={selectedLead!} openModal={openModal} handleClose={() => setOpenModal(false)} />
    </Box>
  )
}

export default LeadsList
