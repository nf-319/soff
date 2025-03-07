'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  Button,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { useGet, usePost } from 'src/hooks/useApi'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'

interface Attendance {
  id: number
  is_available: 'attend' | 'not_come' | ''
  description: string
  group: number
}

interface Student {
  id: number
  first_name: string
  grade: string
  attendance: Attendance[]
}

// API response data interface
interface ApiStudent {
  id: number
  first_name: string
  description: string | null
  is_available: boolean | null
  score: number
}

interface Props {
  attendance: { students: Student[] }
}

export default function AttendanceTable({ attendance }: Props) {
  const [students, setStudents] = useState<Student[]>([])
  const { mutate, isPending } = usePost()
  const router = useRouter()
  const { id } = router.query
  const { data, isLoading } = useGet<ApiStudent[]>(`common/teacher/attendance-list/${id as string}/`)

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedStudents = data.map((apiStudent: ApiStudent) => ({
        id: apiStudent.id,
        first_name: apiStudent.first_name,
        grade: apiStudent.score?.toString() || '',
        attendance: [{
          id: apiStudent.id,
          is_available: apiStudent.is_available === true ? 'attend' :
            apiStudent.is_available === false ? 'not_come' : '',
          description: apiStudent.description || '',
          group: Number(id)
        }]
      }))
      // @ts-ignore
      setStudents(formattedStudents)
    }
    else if (attendance?.students?.length > 0) {
      setStudents(attendance.students)
    }
  }, [data, attendance, id])

  const handleChange = (studentId: number, field: keyof Attendance | 'grade', value: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          if (field === 'grade') {
            return {
              ...student,
              grade: value
            }
          } else {
            return {
              ...student,
              attendance: student.attendance.map(att => ({
                ...att,
                [field]: value
              }))
            }
          }
        }
        return student
      })
    )
  }

  const handleSave = () => {
    if (!students.length) {
      toast.error("Davomat ma'lumotlari mavjud emas!")
      return
    }

    const groupId = id || students[0]?.attendance[0]?.group
    if (!groupId) {
      toast.error("Guruh ma'lumoti topilmadi!")
      return
    }

    const payload = students.map(student => ({
      id: student.id,
      is_available: student.attendance[0]?.is_available === 'attend' ? true :
        student.attendance[0]?.is_available === 'not_come' ? false : null,
      description: student.attendance[0]?.description || '',
      score: student.grade ? parseInt(student.grade) : 0
    }))

    mutate(`common/teacher/attendance-list/${groupId}/`, payload, {
      onSuccess: () => toast.success('Davomat saqlandi!'),
      onError: () => toast.error("Xatolik yuz berdi, qayta urinib ko'ring!")
    })
  }

  if (isLoading) {
    return <div className="text-center p-4">Ma'lumotlar yuklanmoqda...</div>
  }

  return (
    <div className='container mt-4'>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Ism</b></TableCell>
              <TableCell><b>Davomati</b></TableCell>
              <TableCell><b>Izoh (kelmagan bo'lsa)</b></TableCell>
              <TableCell><b>Baho (kelgan bo'lsa)</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.first_name}</TableCell>
                <TableCell>
                  <FormControl fullWidth size='small'>
                    <InputLabel id={`attendance-label-${student.id}`}>Davomat</InputLabel>
                    <Select
                      labelId={`attendance-label-${student.id}`}
                      value={student.attendance[0]?.is_available || ''}
                      onChange={e => handleChange(student.id, 'is_available', e.target.value)}
                      label="Davomat"
                    >
                      <MenuItem value='attend'>Keldi</MenuItem>
                      <MenuItem value='not_come'>Kelmagan</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    placeholder='Kelmagani uchun izoh'
                    value={student.attendance[0]?.description || ''}
                    onChange={e => handleChange(student.id, 'description', e.target.value)}
                    disabled={student.attendance[0]?.is_available === 'attend'}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant='outlined'
                    size='small'
                    fullWidth
                    placeholder='Baho kiriting'
                    value={student.grade || ''}
                    disabled={student.attendance[0]?.is_available === 'not_come'}
                    onChange={e => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '')
                      handleChange(student.id, 'grade', numericValue)
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='text-center mt-4'>
        <Button onClick={handleSave} size='medium' variant='contained' disabled={isPending}>
          {isPending ? 'Saqlanmoqda...' : 'Davomatni saqlash'}
        </Button>
      </div>
    </div>
  )
}
