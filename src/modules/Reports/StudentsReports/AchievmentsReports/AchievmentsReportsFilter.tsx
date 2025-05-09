import { DatePicker } from '@/components/DatePicker'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { Download } from 'lucide-react'
import { useState } from 'react'

export function AchievmentReportsFilter() {
  const [yearValue, setYearValue] = useState<string>('2025')
  const [monthValue, setMonthValue] = useState<string>('5')
  const [groupValue, setGroupValue] = useState<string>('')
  const [teacherValue, setTeacherValue] = useState<string>('')
  const [date, setDate] = useState<Date | null>(null)
  const [courseValue, setCourseValue] = useState<string>('')

  const courseSelectOptions = [
    { value: 1, label: 'Matematika' },
    { value: 2, label: 'Ingliz tili' },
    { value: 3, label: 'Dasturlash asoslari' },
    { value: 4, label: 'Grafik dizayn' },
    { value: 5, label: 'Rus tili' }
  ]

  function handleChange(e: any) {
    setDate(e)
  }

  const teacherOptions = [
    { label: 'Ahmad Aliyev', value: '1' },
    { label: 'Dilnoza Karimova', value: '2' },
    { label: 'Jasur Ergashev', value: '3' }
  ]
  const groupOptions = [
    { label: 'Frontend 101', value: 'frontend-101' },
    { label: 'Backend A', value: 'backend-a' },
    { label: 'Design Guruh', value: 'design-group' }
  ]

  const years = [
    { year: '2020', value: '2020' },
    { year: '2021', value: '2021' },
    { year: '2022', value: '2022' },
    { year: '2023', value: '2023' },
    { year: '2024', value: '2024' },
    { year: '2025', value: '2025' }
  ]

  const months = [
    { id: '1', name: 'Yanvar' },
    { id: '2', name: 'Fevral' },
    { id: '3', name: 'Mart' },
    { id: '4', name: 'Aprel' },
    { id: '5', name: 'May' },
    { id: '6', name: 'Iyun' },
    { id: '7', name: 'Iyul' },
    { id: '8', name: 'Avgust' },
    { id: '9', name: 'Sentyabr' },
    { id: '10', name: 'Oktyabr' },
    { id: '11', name: 'Noyabr' },
    { id: '12', name: 'Dekabr' }
  ]

  return (
    <Box display={'flex'} flexDirection={'column'} gap={5}>
          <Box display={'flex'} flexDirection={{ xs:'column',md:'row'}} gap={3} justifyContent={'space-between'}>
        <Box display={'flex'} flexDirection={{ xs:'column',md:'row'}} gap={3}>
          <FormControl sx={{ minWidth: 180 }} fullWidth size='small'>
            <InputLabel id='year-label'>Yil</InputLabel>
            <Select labelId='year-label' value={yearValue} label='Yil' onChange={e => setYearValue(e.target.value)}>
              {years.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }} fullWidth size='small'>
            <InputLabel id='month-label'>Oy</InputLabel>
            <Select labelId='month-label' value={monthValue} label='Oy' onChange={e => setMonthValue(e.target.value)}>
              {months.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }} fullWidth>
            <DatePicker
              format='MM/dd/yyyy'
              views={['day']}
              onChange={handleChange}
              label='Sana'
              value={date}
            />
          </FormControl>
        </Box>
        <Button startIcon={<Download size={20}/>} variant='contained'>
          Excel
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='group-label'>Guruhlar</InputLabel>
            <Select
              labelId='group-label'
              value={groupValue}
              label='Guruhlar'
              onChange={e => setGroupValue(e.target.value)}
            >
              {groupOptions.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='teacher-label'>Barcha o'qituvchilar</InputLabel>
            <Select
              labelId='teacher-label'
              value={teacherValue}
              label="Barcha o'qituvchilar"
              onChange={e => setTeacherValue(e.target.value)}
            >
              {teacherOptions.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <FormControl fullWidth size='small'>
            <InputLabel id='teacher-label'>Kurslar</InputLabel>
            <Select
              labelId='teacher-label'
              value={courseValue}
              label='Kurslar'
              onChange={e => setCourseValue(e.target.value)}
            >
              {courseSelectOptions.map(item => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}
