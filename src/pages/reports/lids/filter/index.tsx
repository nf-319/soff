import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from '@/context/AuthContext'
import { useGetBranches } from '@/shared/query-hooks/branches/branches'

const LidsReportsFilter = () => {
  const [duration, setDuration] = useState('3')
  const [branch, setBranch] = useState<string | number>('')
  const { user } = useContext(AuthContext)
  const { isMobile } = useResponsive()
  const { data } = useGetBranches()

  useEffect(() => {
    setBranch(user?.active_branch)
  }, [user])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : '',
        alignItems: 'center',
        gap: isMobile ? 6 : 0,
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Typography variant="h5">Lidlar Hisoboti</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 5, flexWrap: isMobile ? 'wrap' : '' }}>
        <FormControl fullWidth>
          <InputLabel id='duration-label'>Duration</InputLabel>
          <Select
            labelId='duration-label'
            value={duration}
            size='small'
            sx={{ width: '150px' }}
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
            sx={{ width: '150px' }}
            onChange={e => setBranch(e.target.value)}
            label='Branch'
          >
            {data?.results.map(item => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

export default LidsReportsFilter
