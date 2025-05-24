import { DataGridTable } from '@/components/table/DataGridTable'
import { useGet } from '@/hooks/useApi'
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const FeedBacksList = () => {
  const { t } = useTranslation()
  const { data, isPending } = useGet('owner/feedback/list/')
  const columns = [
    {
      field: 'id',
      headerName: t('ID'),
      width: 70
    },
    {
      field: 'reviewer_info',
      headerName: t('F.i.o'),
      width: 150
    },
    {
      field: 'phone',
      headerName: t('Telefon raqam'),
      width: 250
    },
    {
      field: 'worked_lead_count',
      headerName: t('Lidlar soni'),
      width: 150
    },
    {
      field: 'enrolled_leads',
      headerName: 'Sotuvlar soni',
      width: 150
    },
    {
      field: 'lost_leads',
      headerName: t('Yoqotilgan lidlar soni'),
      width: 250
    }
  ]

  return (
    <Box>
      <DataGridTable
        rows={data?.results || []}
        columns={columns}
        loading={isPending}
        localeText={uzbekLocaleText}
        // onRowClick={(params: any) => setSellerId(params.row.id)}
        hideFooter
      />
    </Box>
  )
}

export default FeedBacksList
