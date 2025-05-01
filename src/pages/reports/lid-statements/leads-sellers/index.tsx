'use client'

import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataGrid } from '@mui/x-data-grid'
import SellerDetailModal from '@/components/seller-detail-modal'
import { useGetLeadsSellers } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReposrtLeadsSellers } from '@/types/report'
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants'

const LeadsSellers = () => {
  const { t } = useTranslation()
  const { data = [], isLoading } = useGetLeadsSellers()
  const [sellerId, setSellerId] = useState<number | null>(null)
  const [selectedSeller, setSelectedSeller] = useState<ReposrtLeadsSellers | null>(null)

  const columns = [
    {
      field: 'id',
      headerName: t('ID'),
      width: 70,
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
      field: 'conversion_rate',
      headerName: t('Konversiya stavkasi'),
      flex: 1,
    },
    {
      field: 'worked_lead_count',
      headerName: t('Lidlar soni'),
      flex: 1,
    },
    {
      field: 'lost_leads',
      headerName: t('Yoqotilgan lidlar'),
      flex: 1,
    },
  ]

  useEffect(() => {
    if (sellerId) {
      const found = data.find((seller) => seller.id === sellerId)
      if (found) {
        setSelectedSeller(found)
      }
    }
  }, [sellerId, data])

  return (
    <Box>
      <Typography variant='h5' sx={{ mb: 2 }}>
        {t('Sotuvchilar list')}
      </Typography>

      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          '& .MuiDataGrid-root': {
            overflow: 'hidden',
            borderRadius: 1,
            border: '1px solid #e0e0e0',
          },
        }}
      >
        <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
          localeText={uzbekLocaleText}
          hideFooter
          onRowClick={(params) => setSellerId(params.row.id)}
        />
      </Box>


      <SellerDetailModal
        selectedSeller={selectedSeller}
        sellerId={sellerId}
        setSellerId={setSellerId}
      />
    </Box>
  )
}

export default LeadsSellers
