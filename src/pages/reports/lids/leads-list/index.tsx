import DataTable from '@/components/table'
import { customTableProps } from '@/pages/students'
import { useGetReportLeadsList } from '@/shared/query-hooks/report-leads/reportLeads'
import { Box, IconButton, Pagination, Typography } from '@mui/material'
import { EyeIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LeadsList = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetReportLeadsList({ page: page })
  const [pageSize, setPageSize] = useState<number>(0)

  const columns: customTableProps[] = [
    {
      xs: 0.3,
      title: t('ID'),
      dataIndex: 'index',
      render: index => `${pageSize + index}`
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
      title: t('admin'),
      dataIndex: 'admin'
    },

    {
      xs: 1,
      title: t('Status'),
      dataIndex: 'status'
    },
    {
      xs: 1,
      title: t('Kurs'),
      dataIndex: 'course'
    },
    {
      xs: 1,
      title: t('Manba'),
      dataIndex: 'source'
    },
    {
      xs: 0.3,
      title: t("Ko'rish"),
      dataIndex: 'id',
      render: () => (
        <IconButton>
          <EyeIcon />
        </IconButton>
      )
    }
  ]
  const handlePageChange = (_: unknown, newPage: number) => {
    setPageSize((newPage - 1) * 10)
    setPage(newPage)
  }

  return (
    <Box>
      <Typography variant='h5'>Lidlar list</Typography>
      <DataTable columns={columns} loading={isLoading} data={data?.results || []} />
      <Pagination
        page={page}
        count={Math.ceil((data?.count || 0) / 10)}
        variant='outlined'
        shape='rounded'
        onChange={handlePageChange}
      />
    </Box>
  )
}

export default LeadsList
