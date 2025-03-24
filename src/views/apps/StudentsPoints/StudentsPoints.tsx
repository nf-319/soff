'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { StudentPointsFilter } from './ui/StudentPointsFilter'
import { DataGrid, GridPagination } from '@mui/x-data-grid'
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete } from '@mui/material'
import { useGet } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'
import { uzbekLocaleText } from './constants'
import api from 'src/@core/utils/api'
import useDebounce from 'src/hooks/useDebounce'

export const StudentPoints = () => {
  const router = useRouter()
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [points, setPoints] = useState('')
  const [reason, setReason] = useState('')
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [page, setPage] = useState(parseInt(router.query.page as string) || 0)
  const [pageSize, setPageSize] = useState(parseInt(router.query.pageSize as string) || 10)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 400)

  const { data: studentsData } = useGet(ceoConfigs.students)
  const { data: pointStudents, isLoading: pointStudentLoading } = useGet(
    `student/points/?limit=${pageSize}&offset=${page * pageSize}`
  )

  useEffect(() => {
    const query = { ...router.query }
    if (page !== 0) query.page = page.toString()
    else delete query.page
    if (pageSize !== 10) query.pageSize = pageSize.toString()
    else delete query.pageSize

    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true })
  }, [page, pageSize])

  const handleAddPoints = () => {
    setOpenAddModal(false)
    setPoints('')
    setReason('')
    setSelectedStudentId('')
  }

  const handleEditPoints = () => {
    setOpenEditModal(false)
    setSelectedStudent(null)
  }

  const handleSearchStudents = async (search: string) => {
    const response = await api.get(`student/new-list/?status=active&search=${search}`)
    setStudents(response.data.results)
  }

  useEffect(() => {
    if (debounceSearch !== '') {
      handleSearchStudents(debounceSearch)
    } else {
      setStudents([])
    }
  }, [debounceSearch])

  const columns = [
    {
      field: 'id',
      headerName: "O'rin",
      width: 100,
      sortable: true,
      renderCell: (params: any) => (
        <Typography>{params.api.getRowIndex(params.row.id) + 1}</Typography>
      )
    },
    {
      field: 'first_name',
      headerName: 'Talaba ismi',
      width: 200,
      sortable: true,
      flex: 1
    },
    {
      field: 'branch',
      headerName: 'Filial',
      width: 150,
      sortable: true,
      flex: 1
    },
    {
      field: 'total_points',
      headerName: 'Jami ballar',
      width: 150,
      sortable: true,
      flex: 1,
      renderCell: (params: any) => (
        <Chip label={params.value} variant='outlined' />
      )
    },
    {
      field: 'edit',
      headerName: "Amallar",
      width: 150,
      flex: 1,
      renderCell: (params: any) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedStudent(params.row)
            setOpenEditModal(true)
          }}
        >
          O'zgartirish
        </Button>
      )
    },
  ]

  return (
    <Box component='section'>
      <Box display='flex' alignItems='center' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Talabalar reytingi</Typography>

        <Button variant='outlined' size='medium' onClick={() => setOpenAddModal(true)}>
          Ball berish
        </Button>
      </Box>

      <StudentPointsFilter />

      <Box sx={{ height: 'auto', width: '100%', mt: 4 }}>
        <DataGrid
          autoHeight
          rows={pointStudents?.results || []}
          columns={columns}
          loading={pointStudentLoading}
          disableSelectionOnClick
          pagination
          paginationMode='server'
          rowCount={pointStudents?.count || 0}
          localeText={uzbekLocaleText}
          page={page}
          onPageChange={newPage => setPage(newPage)}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          components={{
            Pagination: GridPagination,
          }}
          initialState={{
            pagination: {
              pageSize: 10,
              page: 0
            }
          }}
        
        />

        <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth='sm' fullWidth>
          <DialogTitle>Ball berish</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Autocomplete
                options={students}
                getOptionLabel={(option: any) => `${option.first_name} - ${option.phone}`}
                onInputChange={(event, newInputValue) => {
                  setSearch(newInputValue)
                }}
                onChange={(event, newValue) => {
                  setSelectedStudentId(newValue?.id || '')
                  setSelectedStudent(newValue || null)
                }}
                renderInput={(params) => <TextField {...params} label="Talaba" />}
              />
            </FormControl>

            {selectedStudent && (
              <>
                <TextField
                  fullWidth
                  label='Ball'
                  type='number'
                  value={points}
                  onChange={e => setPoints(e.target.value)}
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label='Sabab'
                  multiline
                  rows={4}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)}>Bekor qilish</Button>
            <Button onClick={handleAddPoints} variant='contained'>
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth='sm' fullWidth>
          <DialogTitle>Ball o'zgartirish</DialogTitle>
          <DialogContent>
            {selectedStudent && (
              <>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography variant='subtitle1'>Talaba: {selectedStudent.first_name}</Typography>
                  <Typography variant='body2'>Telefon: {selectedStudent.phone}</Typography>
                  <Typography variant='body2'>Joriy ball: {selectedStudent.total_points}</Typography>
                </Box>

                <TextField
                  fullWidth
                  label='Ball'
                  size='medium'
                  type='number'
                  value={points}
                  onChange={e => setPoints(e.target.value)}
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label='Sabab'
                  size='small'
                  multiline
                  rows={4}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Bekor qilish</Button>
            <Button onClick={handleEditPoints} variant='contained'>
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

StudentPoints.displayName = 'StudentPoints'
