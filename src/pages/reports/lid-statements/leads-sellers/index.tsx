'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGrid } from '@mui/x-data-grid';
import SellerDetailModal from '@/components/seller-detail-modal';
import { useGetLeadsSellers } from '@/shared/query-hooks/report-leads/reportLeads';
import { ReposrtLeadsSellers } from '@/types/report';
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants';
import { useRouter } from 'next/router';

const LeadsSellers = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { branch } = router.query;
  const branchParam = branch && branch !== 'undefined' ? String(branch) : undefined;

  const { data = [], isLoading } = useGetLeadsSellers(branchParam);
  const [sellerId, setSellerId] = useState<number | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<ReposrtLeadsSellers | null>(null);

  const columns = [
    {
      field: 'id',
      headerName: t('ID'),
      width: 70,
    },
    {
      field: 'first_name',
      headerName: t('ism'),
      width:150,
    },
    {
      field: 'phone',
      headerName: t('Telefon raqam'),
      width:250,
    },
    {
      field: 'worked_lead_count',
      headerName: t('Lidlar soni'),
      width:250,
    },
    {
      field: 'lost_leads',
      headerName: t('Yoqotilgan lidlar soni'),
      width:250,
    },
    {
      field: 'conversion_rate',
      headerName: 'Konversiya stavkasi',
      width: 250,
      renderCell: (params: any) => {
        const value = Number(params.value);

        return (
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='body2'>{value}%</Typography>
            <Box sx={{ width: '100%', mt: 0.5 }}>
              <Box
                sx={{
                  height: 6,
                  borderRadius: 5,
                  backgroundColor: '#f0f0f0',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${value}%`,
                    height: '100%',
                    backgroundColor: value >= 70 ? '#4caf50' : value >= 40 ? '#ff9800' : '#f44336'
                  }}
                />
              </Box>
            </Box>
          </Box>
        )
      },
    },
  ];

  useEffect(() => {
    if (sellerId) {
      const found = data.find((seller) => seller.id === sellerId);
      if (found) {
        setSelectedSeller(found);
      }
    }
  }, [sellerId, data]);

  if (isLoading || !branchParam) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ backgroundColor: '#fff', p: 6, border: '1px solid #e0e0e0', borderRadius: 1 }}>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Sotuvchilar ro'yxati
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
          disableSelectionOnClick
          getRowId={(row) => row.id}
          localeText={uzbekLocaleText}
          hideFooter
          onRowClick={(params) => setSellerId(params.row.id)}
          sx={{
            '.MuiDataGrid-row': {
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-selected': {
                backgroundColor: 'transparent !important',
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
              },
            },
          }}
        />
      </Box>

      <SellerDetailModal
        selectedSeller={selectedSeller}
        sellerId={sellerId}
        setSellerId={setSellerId}
      />
    </Box>
  );
};

export default LeadsSellers;
