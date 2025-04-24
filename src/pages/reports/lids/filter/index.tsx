import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import useResponsive from 'src/@core/hooks/useResponsive'
import useBranches from '@hooks/useBranch'
import { useGetBranches } from '@/shared/query-hooks'

const LidsReportsFilter = () => {
  const [duration, setDuration] = useState('3')
  const [branch, setBranch] = useState('')
  const { isMobile } = useResponsive()
  const { data } = useGetBranches()

  const handleApplyFilters = () => {
    console.log('Applied filters:', { duration, branch })
  }

  return (
    <Card sx={{ padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', gap: 5, flexWrap: isMobile ? 'wrap' : '' }}>
        <FormControl fullWidth>
          <InputLabel id='duration-label'>Duration</InputLabel>
          <Select
            labelId='duration-label'
            value={duration}
            size='small'
            onChange={e => setDuration(e.target.value)}
            label='Duration'
          >
            <MenuItem value='3'>3 month</MenuItem>
            <MenuItem value='4'>4 month</MenuItem>
            <MenuItem value='5'>5 month</MenuItem>
            <MenuItem value='6'>6 month</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id='branch-label'>Branch</InputLabel>

          <Select
            size='small'
            labelId='branch-label'
            value={branch}
            onChange={e => setBranch(e.target.value)}
            label='Branch'
          >
            <MenuItem value=''>All branches</MenuItem>
            {data?.results.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button variant='contained' color='primary' onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </Card>
  )
}

export default LidsReportsFilter
