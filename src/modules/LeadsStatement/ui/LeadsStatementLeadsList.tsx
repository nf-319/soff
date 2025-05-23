'use client'

import { Box, Button, MenuItem, Select, Typography, Chip, CircularProgress } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetReportLeadsList } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReportsLeadsListItemType } from '@/types/report'
import { LidsDragonModal } from '@/views/apps/lids/LidsDragonModal'
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/router'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { DataGridTable } from '@components/table/DataGridTable'
import {
  LEAD_STATEMENTS_STATES,
  LEAD_STATEMENTS_TEMPERATURE,
  LEADS_STATE_MAP,
  LEADS_TEMPERATURE_MAP
} from '../config/constants'

export const LeadsStatementLeadsList = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { branch } = router.query
  const branchParam = branch && branch !== 'undefined' ? String(branch) : undefined
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)
  const [selectedLead, setSelectedLead] = useState<ReportsLeadsListItemType | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [temperateValue, setTemperateValue] = useState('')
  const [stateValue, setStateValue] = useState('')
  const queryClient = useQueryClient()
  const leadsSellers: any = queryClient.getQueryData([QueryKeys.ReportsLeadsSellers])

  const [adminValue, setAdminValue] = useState('')
  const tableRef = useRef<HTMLDivElement | null>(null)
  const { data, isLoading } = useGetReportLeadsList({
    offset,
    limit,
    branch: branchParam,
    temperature: temperateValue,
    status: stateValue,
    admin: adminValue
  })

  useEffect(() => {
    setOffset(0)
    setTemperateValue('')
    setStateValue('')
  }, [branchParam])

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [temperateValue, stateValue, adminValue])

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && data?.count && offset + limit < data.count) {
      setOffset(prev => prev + limit)
    } else if (direction === 'prev' && offset > 0) {
      setOffset(prev => prev - limit)
    }
  }

  const handleLimitChange = (event: any) => {
    const newLimit = Number(event.target.value)
    setLimit(newLimit)
    setOffset(0)
  }

  const columns = [
    {
      field: 'index',
      headerName: t('ID'),
      width: 70,
      valueGetter: (params: any) => `${offset + params.api.getRowIndex(params.id) + 1}`
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
        const statusInfo = LEADS_STATE_MAP[status] || { label: status, color: 'default' }
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
        const statusInfo = LEADS_TEMPERATURE_MAP[status] || { label: status || 'Belgilanmagan', color: 'default' }
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
          {LEAD_STATEMENTS_STATES.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <Select
          size='small'
          fullWidth
          value={adminValue}
          onChange={e => setAdminValue(e.target.value)}
          displayEmpty
        >
          <MenuItem value=''>Barcha adminlar</MenuItem>
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
          {LEAD_STATEMENTS_TEMPERATURE.map(option => (
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
        <DataGridTable
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
          <Select value={limit} sx={{ height: '30px', width: '90px' }} onChange={handleLimitChange} size='small'>
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
            disabled={offset === 0}
          >
            Oldingi
          </Button>

          <Button
            variant='outlined'
            size='small'
            onClick={() => handlePageChange('next')}
            endIcon={<ChevronRight size={18} />}
            disabled={data?.count ? offset + limit >= data.count : true}
          >
            Keyingi
          </Button>
        </Box>
      </Box>

      <LidsDragonModal selectedLead={selectedLead!} openModal={openModal} handleClose={() => setOpenModal(false)} />
    </Box>
  )
}

LeadsStatementLeadsList.displayName = 'LeadsStatementLeadsList'
