import DataTable, { customTableDataProps } from '@/components/table'
import { useGetReportLeadsList } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReportsLeadsListItemType } from '@/types/report'
import { LidsDragonModal } from '@/views/apps/lids/LidsDragonModal'
import { Box, IconButton, Pagination, Typography } from '@mui/material'
import { EyeIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LeadsList = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetReportLeadsList({ page: page })
  const [pageSize, setPageSize] = useState<number>(0)
  const [openModal, setOpenModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<ReportsLeadsListItemType | any>(null)
  const columns: customTableDataProps[] = [
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
      renderItem: item => (
        <IconButton
          onClick={() => {
            setSelectedLead(item)
            setOpenModal(true)
          }}
        >
          <EyeIcon />
        </IconButton>
      )
    }
  ]

  function handleClose() {
    setOpenModal(false)
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPageSize((newPage - 1) * 10)
    setPage(newPage)
  }

  return (
    <Box>
      <Typography variant='h5'>Lidlar list</Typography>
      <DataTable  columns={columns} loading={isLoading} data={data?.results || []} />
      <Pagination
        page={page}
        count={Math.ceil((data?.count || 0) / 10)}
        variant='outlined'
        shape='rounded'
        onChange={handlePageChange}
      />
      <LidsDragonModal selectedLead={selectedLead} openModal={openModal} handleClose={handleClose} />
    </Box>
  )
}

export default LeadsList
