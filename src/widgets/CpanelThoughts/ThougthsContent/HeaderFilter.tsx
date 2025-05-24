import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import SearchInput from '../../../components/SearchInput'
import { useState } from 'react'

const HeadingFilter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [branch, setBranch] = useState('')
  const [status, setStatus] = useState('')
  const [selectVal, setSelectedValue] = useState('problems')
  const handleBranchChange = (event: SelectChangeEvent) => {
    setBranch(event.target.value)
  }

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
  }

  return (
    <Box display='flex' gap={3}>
      <FormControl sx={{ maxWidth: 200 }} fullWidth size='small'>
        <InputLabel id='branch-label'>Filial</InputLabel>
        <Select labelId='branch-label' value={branch} label='Filial' onChange={handleBranchChange}>
          <MenuItem value=''>Barcha Markazlar</MenuItem>
          <MenuItem value='novza'>Novza filiali</MenuItem>
          <MenuItem value='bodomzor'>Bodomzor filiali</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ maxWidth: 200 }} fullWidth size='small'>
        <InputLabel id='status-label'>Status</InputLabel>
        <Select labelId='status-label' value={status} label='Status' onChange={handleStatusChange}>
          <MenuItem value=''>Barcha Statuslar</MenuItem>
          <MenuItem value='jarayonda'>Jarayonda</MenuItem>
          <MenuItem value='qabul-qilindi'>Qabul qilindi</MenuItem>
          <MenuItem value='rad-etildi'>Rad etildi</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ maxWidth: 200 }} fullWidth size='small'>
        <InputLabel id='status-label'>Filter</InputLabel>
        <Select
          labelId='status-label'
          value={selectVal}
          label='Filter'
          onChange={e => setSelectedValue(e.target.value)}
        >
          <MenuItem value='problems'>Muammolar</MenuItem>
          <MenuItem value='functions'>Qo'shimcha funksiyalar</MenuItem>
          <MenuItem value='differents'>Farqimiz</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <SearchInput
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </FormControl>
    </Box>
  )
}

export default HeadingFilter
