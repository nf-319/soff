'use client'

import { Box, Pagination, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataGrid } from '@mui/x-data-grid'
import { useGetReportLeadsList } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReportsLeadsListItemType } from '@/types/report'
import { LidsDragonModal } from '@/views/apps/lids/LidsDragonModal'
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants'

const LeadsList = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [pageSizeOffset, setPageSizeOffset] = useState(0)
  const [selectedLead, setSelectedLead] = useState<ReportsLeadsListItemType | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const { data, isLoading } = useGetReportLeadsList({ page })

  const handlePageChange = (_: unknown, newPage: number) => {
    setPageSizeOffset((newPage - 1) * 10)
    setPage(newPage)
  }

  const columns = [
    {
      field: 'index',
      headerName: t('ID'),
      width: 70,
      valueGetter: (params: any) => `${pageSizeOffset + params.api.getRowIndex(params.id) + 1}`,
    },
    {
      field: 'first_name',
      headerName: t('ism'),
      flex: 1,
    },
    {
      field: 'phone',
      headerName: t('Telefon raqam'),
      flex: 1,
    },
    {
      field: 'admin',
      headerName: t('admin'),
      flex: 1.4,
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1,
    },
    {
      field: 'course',
      headerName: t('Kurs'),
      flex: 1,
    },
    {
      field: 'source',
      headerName: t('Manba'),
      flex: 1,
    },
  ]

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        {t('Lidlar list')}
      </Typography>

      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          '& .MuiDataGrid-root': {
            overflow: 'hidden',
            borderRadius: 1,
            border: '1px solid #e0e0e0'
          }
        }}
      >
        <DataGrid
          autoHeight
          rows={data?.results || []}
          columns={columns}
          loading={isLoading}
          getRowId={row => row.id}
          localeText={uzbekLocaleText}
          hideFooter
          onRowClick={params => {
            setSelectedLead(params.row)
            setOpenModal(true)
          }}
        />
      </Box>

      <Box display='flex' justifyContent='center' mt={2}>
        <Pagination
          page={page}
          count={Math.ceil((data?.count || 0) / 10)}
          variant='outlined'
          shape='rounded'
          onChange={handlePageChange}
        />
      </Box>

      <LidsDragonModal selectedLead={selectedLead!} openModal={openModal} handleClose={() => setOpenModal(false)} />
    </Box>
  )
}

export default LeadsList
