import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DateRangePicker } from 'rsuite'

export function StudentReportFilter() {
  const [branchValue, setBranchValue] = useState<string>('')
  const [yearValue, setYearValue] = useState<string>('2025')
  const [monthValue, setMonthValue] = useState<string>('5')
  const { t } = useTranslation()
  const [date, setData] = useState<[Date, Date] | null>()
  const branches = [
    { name: 'Samarqand', id: '2' },
    { name: 'Buxoro', id: '3' },
    { name: 'Toshkent', id: '4' }
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
    <Box display={'flex'} gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
      <FormControl fullWidth size='small'>
        <InputLabel id='branch-label'>Branch</InputLabel>
        <Select
          labelId='branch-label'
          value={branchValue}
          label='Branch'
          onChange={e => setBranchValue(e.target.value)}
        >
          <MenuItem value=''>Barchasi</MenuItem>
          {branches.map(item => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
      {/* <FormControl fullWidth>
        <DateRangePicker
          showOneCalendar
          placement='bottom'
          locale={{
            last7Days: t('Oxirgi hafta'),
            sunday: t('Yak'),
            monday: t('Du'),
            tuesday: t('Se'),
            wednesday: t('Chor'),
            thursday: t('Pa'),
            friday: t('Ju'),
            saturday: t('Sha'),
            ok: t('Saqlash'),
            today: t('Bugun'),
            yesterday: t('Kecha'),
            hours: t('Soat'),
            minutes: t('Minut'),
            seconds: t('Sekund')
          }}
          format='yyyy-MM-dd'
          onChange={e => setData(e)}
          translate={'yes'}
          size='md'
          value={date}
        />
      </FormControl> */}
    </Box>
  )
}
