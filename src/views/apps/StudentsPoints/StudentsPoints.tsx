'use client'

import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { StudentPointsFilter } from './ui/StudentPointsFilter'
import { DataGrid } from '@mui/x-data-grid'
import { Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import Icon from 'src/components/icon'
import { useGet } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'

export const StudentPoints = () => {
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [points, setPoints] = useState('')
  const [reason, setReason] = useState('')
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState('')

  const { data: studentsData, isLoading } = useGet(ceoConfigs.students)

  useEffect(() => {
    if (studentsData?.results) {
      setStudents(studentsData.results)
    }
  }, [studentsData])

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

  const columns = [
    {
      field: 'position',
      headerName: "O'rin",
      width: 100,
      sortable: true,
      renderCell: (params: any) => (
        <Typography>{params.api.getRowIndex(params.row.id) + 1}</Typography>
      )
    },
    {
      field: 'fullName',
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
      field: 'totalPoints',
      headerName: 'Jami ballar',
      width: 150,
      sortable: true,
      flex: 1,
      renderCell: (params: any) => (
        <Chip label={params.value} color="primary" />
      )
    },
    {
      field: 'edit',
      headerName: "O'zgartirish",
      width: 150,
      flex: 1,
      renderCell: (params: any) => (
        <Button 
          variant="contained" 
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
    {
      field: 'actions',
      headerName: 'Amallar',
      width: 100,
      flex: 0.5,
      renderCell: () => (
        <IconButton>
          <Icon icon="mdi:dots-vertical" />
        </IconButton>
      )
    }
  ]

  return (
    <Box component='section'>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant='h5'>Talabalar reytingi</Typography>

        <Button variant='contained' size="medium" onClick={() => setOpenAddModal(true)}>
          Ball berish
        </Button>
      </Box>

      <StudentPointsFilter />

      <Box sx={{ height: 'auto', width: '100%', mt: 4 }}>
        <DataGrid
          autoHeight
          rows={[]}
          columns={columns}
          loading={isLoading}
          disableSelectionOnClick
          initialState={{
            pagination: {
              page: 0,
              pageSize: 10
            }
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal'
            }
          }}
        />
      </Box>

      {/* Add Points Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ball berish</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Talaba</InputLabel>
            <Select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              label="Talaba"
            >
              {students.map((student: any) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.first_name} - {student.phone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Ball"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Sabab"
            multiline
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)}>Bekor qilish</Button>
          <Button onClick={handleAddPoints} variant="contained">Saqlash</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Points Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ball o'zgartirish</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <>
              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography variant="subtitle1">
                  Talaba: {selectedStudent.fullName}
                </Typography>
                <Typography variant="body2">
                  Telefon: {selectedStudent.phone}
                </Typography>
                <Typography variant="body2">
                  Joriy ball: {selectedStudent.totalPoints}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Ball"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                label="Sabab"
                multiline
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)}>Bekor qilish</Button>
          <Button onClick={handleEditPoints} variant="contained">Saqlash</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

StudentPoints.displayName = 'StudentPoints'
