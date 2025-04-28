import DataTable from '@/components/table'
import { customTableProps } from '@/pages/students'
import { useGetLeadsSellers } from '@/shared/query-hooks/report-leads/reportLeads'
import { Box, IconButton, Typography } from '@mui/material'
import { EyeIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const LeadsSellers = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useGetLeadsSellers()
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
      render: () => (
        <IconButton>
          <EyeIcon/>
        </IconButton>
      )
    }
  ]

  return (
    <Box>
      <Typography variant='h5'>Sotuvchilar list</Typography>
      <DataTable columns={columns} loading={isLoading} data={data || []} />
    </Box>
  )
}

export default LeadsSellers
