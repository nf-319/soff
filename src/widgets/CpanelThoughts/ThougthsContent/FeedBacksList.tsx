import { DataGridTable } from '@/components/table/DataGridTable'
import { useGet } from '@/hooks/useApi'
import { uzbekLocaleText } from '@/views/apps/StudentsPoints/constants'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

const FeedBacksList = () => {
    const searchParams = new URLSearchParams(window.location.search)
  const paramsObject = Object.fromEntries(searchParams.entries());

    const { t } = useTranslation()
    const { data, isPending } = useGet('owner/feedback/list/',{params:paramsObject})
    const columns = [
    {
      field: 'id',
      headerName: t('ID'),
      width: 70
    },
      {
      field: 'client',
      headerName: t("O'quv markaz nomi"),
      width: 170
    },
    {
      field: 'reviewer_info',
      headerName: t('F.i.o'),
      width: 150
    },
    {
      field:'role',
      headerName:t('Role'),
      width:120
    },
    {
      field: `${searchParams.get('description')||'weaknesses'}`,
      headerName: t('Izoh'),
      width: 150
    },
   
    {
      field: 'status',
      headerName: t('status'),
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
