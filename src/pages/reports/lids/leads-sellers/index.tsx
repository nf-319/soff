import SellerDetailModal from '@/components/seller-detail-modal'
import DataTable from '@/components/table'
import { customTableProps } from '@/pages/students'
import { useGetLeadsSellerDetail, useGetLeadsSellers } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReposrtLeadsSellers } from '@/types/report'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { EyeIcon, UserIcon, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LeadsSellers = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useGetLeadsSellers()
  const [sellerId, setSellerId] = useState<number | null>(null)
  const [selectedSeller, setSellectedSeller] = useState<ReposrtLeadsSellers | null>(null)
  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t('ID'),
      dataIndex: 'index'
    },
    {
      xs: 1,
      title: t('ism'),
      dataIndex: 'first_name'
    },
    {
      xs: 1,
      title: t('Telefon raqam'),
      dataIndex: 'phone'
    },
    {
      xs: 1.4,
      title: t('conversion_rate'),
      dataIndex: 'conversion_rate'
    },

    {
      xs: 1,
      title: t('Lidlar soni'),
      dataIndex: 'worked_lead_count'
    },
    {
      xs: 1,
      title: t('Yoqotilgan lidlar'),
      dataIndex: 'lost_leads'
    },
    {
      xs: 0.3,
      title: t("Ko'rish"),
      dataIndex: 'id',
      render: id => (
        <IconButton onClick={() => setSellerId(id)}>
          <EyeIcon />
        </IconButton>
      )
    }
  ]

  useEffect(() => {
    if (sellerId) {
      const selectedSeller = data?.find(item => item.id == sellerId)
      if (selectedSeller) {
        setSellectedSeller(selectedSeller)
      }
    }
  }, [sellerId])

  return (
    <Box>
      <Typography variant='h5'>Sotuvchilar list</Typography>
      <DataTable columns={columns} loading={isLoading} data={data || []} rowClick={(item:number) => setSellerId(item)} />
      <SellerDetailModal selectedSeller={selectedSeller} sellerId={sellerId} setSellerId={setSellerId} />
    </Box>
  )
}

export default LeadsSellers
