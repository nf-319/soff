'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { StudentPointsFilter } from './ui/StudentPointsFilter'
import { DataGrid, GridPagination } from '@mui/x-data-grid'
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete } from '@mui/material'
import { useGet, usePost } from 'src/hooks/useApi'
import { uzbekLocaleText } from './constants'
import api from 'src/@core/utils/api'
import useDebounce from 'src/hooks/useDebounce'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { useFormik } from 'formik'
import Link from 'next/link'
import { Metadata } from '@/components/Metada'

interface Student {
  id: number
  first_name: string
  phone: string
  total_points: number
  branch?: string
  rank?: number
}

const validationSchema = yup.object({
  points: yup.number().required('Ball majburiy').min(1, "Ball 1 dan kam bo'lmasligi kerak"),
  reason: yup.string().required('Sabab majburiy'),
  selectedStudent: yup.object().nullable().required("O'quvchini tanlash majburiy")
})

export const StudentPoints = () => {
  const router = useRouter()
  const [openAddModal, setOpenAddModal] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [page, setPage] = useState(parseInt(router.query.page as string) || 0)
  const [pageSize, setPageSize] = useState(parseInt(router.query.pageSize as string) || 10)
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 400)
  const { search: searchQuery, branch, start_date, end_date } = router.query

  const { mutate: addMutate } = usePost()
  const {
    data: pointStudents,
    isLoading: pointStudentLoading,
    refetch
  } = useGet(
    `student/points/?limit=${pageSize}&offset=${page * pageSize}&search=${searchQuery || ''}&branch=${
      branch || ''
    }&start_date=${start_date || ''}&end_date=${end_date || ''}`
  )

  const formik = useFormik({
    initialValues: {
      points: '',
      reason: '',
      selectedStudent: null as Student | null
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        if (values.selectedStudent) {
          await addMutate('student/point/', {
            user: values.selectedStudent.id,
            point: values.points,
            description: values.reason
          })
          refetch()
          setOpenAddModal(false)
          toast.success("Muvaffaqiyatli qo'shildi")
          formik.resetForm()
        }
      } catch (e) {
        console.error(e)
        toast.error("Xatolik yuz berdi, iltimos qaytadan urinib ko'ring")
      }
    }
  })

  const handleSearchStudents = async (search: string) => {
    try {
      const response = await api.get(`student/new-list/?status=active&search=${search}`)
      setStudents(response.data.results)
    } catch (error) {
      console.error('Error searching students:', error)
      setStudents([])
    }
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
      field: 'rank',
      headerName: "O'rin",
      width: 100,
      sortable: true
    },
    {
      field: 'first_name',
      headerName: 'Talaba ismi',
      width: 200,
      sortable: true,
      flex: 1,
      renderCell: (params: any) => (
        <Link
          href={`/reports/student-points/[id]`}
          as={`/reports/student-points/${params.row.id}`}
          style={{
            color: '#4c4e64de',
            textDecoration: 'none',
            transition: 'text-decoration 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.textDecoration = 'underline'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          {params.value}
        </Link>
      )
    },
    {
      field: 'branches',
      headerName: 'Filial',
      width: 150,
      sortable: true,
      flex: 1,
      renderCell: (params: any) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {params.value?.map((branch: { id: number; name: string }) => (
            <span key={branch.id}>{branch.name}</span>
          ))}
        </div>
      )
    },

    {
      field: 'total_points',
      headerName: 'Jami ballar',
      width: 150,
      sortable: true,
      flex: 1,
      renderCell: (params: any) => <Chip label={params.value} variant='outlined' />
    },
    {
      field: 'edit',
      headerName: 'Amallar',
      width: 150,
      flex: 1,
      renderCell: (params: any) => (
        <Button
          variant='outlined'
          size='small'
          onClick={() => {
            formik.setFieldValue('selectedStudent', params.row)
            formik.setFieldValue('points', '')
            formik.setFieldValue('reason', '')
            setOpenAddModal(true)
          }}
        >
          Ball berish
        </Button>
      )
    }
  ]

  return (
    <Box component='section'>
      <Metadata title='Talabalar reytingi' />
      <Box display='flex' alignItems='center' justifyContent='space-between' mb={4}>
        <Typography variant='h5'>Talabalar reytingi</Typography>

        <Button
          variant='outlined'
          size='medium'
          onClick={() => {
            formik.resetForm()
            setOpenAddModal(true)
          }}
        >
          Ball berish
        </Button>
      </Box>

      <StudentPointsFilter />

      <Box style={{ height: 'auto', width: '100%', marginTop: 4 }}>
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
            Pagination: GridPagination
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
            {formik.values.selectedStudent && (
              <Box
                style={{
                  marginBottom: 2,
                  marginTop: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start'
                }}
              >
                <Box>
                  <Typography variant='subtitle1'>Talaba: {formik.values.selectedStudent.first_name}</Typography>
                  <Typography variant='body2'>Telefon: {formik.values.selectedStudent.phone}</Typography>
                  <Typography variant='body2'>Joriy ball: {formik.values.selectedStudent.total_points}</Typography>
                </Box>

                <Button variant='outlined' size='small' onClick={() => formik.setFieldValue('selectedStudent', null)}>
                  O'quvchini o'zgartirish
                </Button>
              </Box>
            )}

            {!formik.values.selectedStudent && (
              <Autocomplete
                options={students}
                getOptionLabel={(option: Student) => `${option.first_name} - ${option.phone}`}
                onChange={(event, newValue) => {
                  formik.setFieldValue('selectedStudent', newValue)
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Talabani qidiring'
                    variant='outlined'
                    fullWidth
                    onChange={e => setSearch(e.target.value)}
                    required
                    error={formik.touched.selectedStudent && Boolean(formik.errors.selectedStudent)}
                    helperText={formik.touched.selectedStudent && (formik.errors.selectedStudent as string)}
                  />
                )}
                style={{ marginTop: 2 }}
              />
            )}

            <TextField
              fullWidth
              label='Ball'
              type='number'
              value={formik.values.points}
              onChange={formik.handleChange}
              name='points'
              style={{ marginTop: '10px' }}
              required
              error={formik.touched.points && Boolean(formik.errors.points)}
              helperText={formik.touched.points && formik.errors.points}
            />

            <TextField
              fullWidth
              label='Sabab'
              multiline
              rows={4}
              value={formik.values.reason}
              onChange={formik.handleChange}
              name='reason'
              style={{ marginTop: '10px' }}
              required
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              helperText={formik.touched.reason && formik.errors.reason}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)}>Bekor qilish</Button>
            <Button onClick={() => formik.handleSubmit()} variant='contained'>
              Saqlash
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

StudentPoints.displayName = 'StudentPoints'
