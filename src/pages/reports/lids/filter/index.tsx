'use client'

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from '@/context/AuthContext'
import { ComingSoon } from '@components/ComingSoon'
import { useGetBranches } from '@/shared/query-hooks/branches/branches'
import { uzbekMonths } from '@/shared/constans'

const LidsReportsFilter = () => {
  const [duration, setDuration] = useState('3')
  const [branch, setBranch] = useState<string | number>('')
  const { user } = useContext(AuthContext)
  const { isMobile } = useResponsive()
  const { data } = useGetBranches()
  const router = useRouter()

  const currentDate = new Date()
  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
  const monthUz = uzbekMonths[nextMonthDate.getMonth()]
  const year = nextMonthDate.getFullYear()
  const defaultReleaseDate = `${monthUz}, ${year}`

  useEffect(() => {
    if (user?.active_branch) {
      setBranch(user.active_branch)
    }
  }, [user])

  useEffect(() => {
    const params = new URLSearchParams()

    if (duration) params.set('duration', duration)
    if (branch) params.set('branch', branch.toString())

    router.replace(`?${params.toString()}`)
  }, [duration, branch, router])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: isMobile ? 6 : 0,
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h5">Lidlar Hisoboti</Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 5, flexDirection: isMobile ? 'column' : 'row' }}>
        <ComingSoon releaseDate={defaultReleaseDate} size="small">
          <FormControl fullWidth>
            <InputLabel id="duration-label">Oy</InputLabel>
            <Select
              labelId="duration-label"
              value={duration}
              size="small"
              onChange={(e) => setDuration(e.target.value)}
              label="Oy"
            >
              <MenuItem value="3">3 oy</MenuItem>
              <MenuItem value="4">4 oy</MenuItem>
              <MenuItem value="5">5 oy</MenuItem>
              <MenuItem value="6">6 oy</MenuItem>
            </Select>
          </FormControl>
        </ComingSoon>

        <FormControl fullWidth>
          <InputLabel id="branch-label">Branch</InputLabel>
          <Select
            size="small"
            labelId="branch-label"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            label="Branch"
          >
            {data?.results.map((item) => (
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
