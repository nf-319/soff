import { DatePicker } from '@/components/DatePicker'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'

export function AttendanceReportsFilter() {
  const [yearValue, setYearValue] = useState<string>('2025')
  const [monthValue, setMonthValue] = useState<string>('5')
  const [date, setDate] = useState<Date | null>(null)
  const [groupValue, setGroupValue] = useState<string>('')
  const [teacherValue, setTeacherValue] = useState<string>('')
  const [statusValue, setStatusValue] = useState<string>('')
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
  const statusOptions = [
    { label: 'Faol', value: 'active' },
    { label: 'Nofaol', value: 'inactive' },
    { label: 'Kutmoqda', value: 'pending' }
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
    <Grid container spacing={2}>
      <Grid item xs={6} sm={6} md={4}>
        <FormControl fullWidth size='small'>
          <InputLabel id='year-label'>Yil</InputLabel>
          <Select labelId='year-label' value={yearValue} label='Yil' onChange={e => setYearValue(e.target.value)}>
            {years.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} sm={6} md={4}>
        <FormControl fullWidth size='small'>
          <InputLabel id='month-label'>Oy</InputLabel>
          <Select labelId='month-label' value={monthValue} label='Oy' onChange={e => setMonthValue(e.target.value)}>
            {months.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} sm={6} md={4}>
        <FormControl fullWidth>
          <DatePicker format='MM/dd/yyyy' views={['day','month','year']} onChange={handleChange} label='Sana' value={date} />
        </FormControl>
      </Grid>

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
          <InputLabel id='status-label'>Statuslar</InputLabel>
          <Select
            labelId='status-label'
            value={statusValue}
            label='Statuslar'
            onChange={e => setStatusValue(e.target.value)}
          >
            {statusOptions.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}
