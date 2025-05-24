import {
  Box,
  Typography,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DataTable from '../../../components/table'
import api from 'src/@core/utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchGroupChecklist } from 'src/store/apps/groups'
import { Metadata } from '@/components/Metada'

export interface customTableProps {
  xs: number
  title: string | React.ReactNode
  dataIndex?: string | React.ReactNode
  render?: (source: any) => any | undefined
}

export default function GraduatesPage() {
  const { t } = useTranslation()
  const [graduatesData, setGraduatesData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedGroup, setSelectedGroup] = useState<string>('all')

  const dispatch = useAppDispatch()
  const { groupChecklist } = useAppSelector(state => state.groups)

  async function getGraduates() {
    setLoading(true)

    let url = `common/group/students/?status=graduates&group=${encodeURIComponent(
      selectedGroup === 'all' ? '' : selectedGroup
    )}&page=${page}`

    try {
      const res = await api.get(url)

      setGraduatesData(res.data.response)
      setTotalPages(Math.ceil(res.data.response.length / 10))
    } catch (error) {
      console.error('Error fetching graduates:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    void getGraduates()
  }, [page, selectedGroup])

  useEffect(() => {
    dispatch(fetchGroupChecklist(''))
  }, [])

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeGroupFilter = (event: SelectChangeEvent<string>) => {
    setSelectedGroup(event.target.value)
    setPage(1)
  }

  const columns: customTableProps[] = [
    {
      title: 'ID',
      dataIndex: 'index',
      xs: 0.3
    },
    {
      title: 'Ism',
      dataIndex: 'student',
      xs: 3,
      render: (student: any) => <>{student.first_name}</>
    },
    {
      title: 'Guruhi',
      dataIndex: 'group_name',
      xs: 3
    },
    {
      title: "Qo'shilgan sanasi",
      dataIndex: 'added_at',
      xs: 2
    },
    {
      title: 'Tugatkan sanasi',
      dataIndex: 'deleted_at',
      xs: 2
    }
  ]

  return (
    <div>
      <Metadata title='Bitiruvchilar' />
      <Box
        className='groups-page-header'
        sx={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0' }}
        py={2}
      >
        <Typography variant='h5'>{t('Bitiruvchilar')}</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id='group-filter-label'>Guruhlar</InputLabel>
          <Select
            size='small'
            labelId='group-filter-label'
            value={selectedGroup}
            label='Guruhlar'
            onChange={handleChangeGroupFilter}
          >
            <MenuItem value={'all'}>Barchasi</MenuItem>
            {groupChecklist?.map((group: any) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DataTable columns={columns} data={graduatesData} loading={loading} minWidth='1200px' maxWidth='1500px' />

      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'start' }}>
        <Pagination count={totalPages} page={page} onChange={handleChangePage} color='primary' shape='rounded' />
      </Box>
    </div>
  )
}
