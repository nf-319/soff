'use client'

import { Box, FormControl, InputLabel, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from '@/context/AuthContext'
import { ComingSoon } from '@components/ComingSoon'
import { useGetBranches } from '@/shared/query-hooks/branches/branches'
import { uzbekMonths } from '@/shared/constans'
import { CalendarIcon, BeakerIcon } from 'lucide-react'

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
  const getUzbekMonthName = (monthNumber: number) => uzbekMonths[monthNumber + 1]
  const [currentMonth, setCurrenMonth] = useState(getUzbekMonthName(Number(duration)))

  useEffect(() => {
    setCurrenMonth(getUzbekMonthName(Number(duration)))
  }, [duration])

  useEffect(() => {
    if (user?.role !== 'admin' && user?.active_branch) {
      setBranch(user.active_branch)
    }
  }, [user])

  useEffect(() => {
    if (!branch && branch !== '') return

    const params = new URLSearchParams()
    if (duration) params.set('duration', duration)
    if (branch) params.set('branch', branch.toString())

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [duration, branch, router])

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'start',
        gap: isMobile ? 6 : 3,
        justifyContent: 'space-between'
      }}
    >
      <Box display="flex" justifyContent="center" gap={3} alignItems='center'>
        <Typography variant='h4' sx={{ mb: 2 }}>
          Lidlar Hisoboti
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Tooltip title="Joriy Oy">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              <CalendarIcon size={20} style={{ marginRight: 8 }} />
              {currentMonth}
            </Box>
          </Tooltip>

          <Tooltip title='Hozirda hisobot demo versiyada ishlamoqda'>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'warning.main',
                color: 'white',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              <BeakerIcon size={20} style={{ marginRight: 8 }} />
              BETA
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: { xs: 3, md: 5 },
          width: { xs: '100%', md: 'auto' },
          alignSelf: 'flex-end'
        }}
      >
        <ComingSoon releaseDate={defaultReleaseDate} size='small' blur='0.8px'>
          <FormControl fullWidth>
            <InputLabel id='duration-label'>Oy</InputLabel>
            <Select
              labelId='duration-label'
              value={duration}
              size='small'
              fullWidth
              onChange={e => setDuration(e.target.value)}
              label='Oy'
            >
              <MenuItem value='3'>3 oy</MenuItem>
              <MenuItem value='4'>4 oy</MenuItem>
              <MenuItem value='5'>5 oy</MenuItem>
              <MenuItem value='6'>6 oy</MenuItem>
            </Select>
          </FormControl>
        </ComingSoon>

        <FormControl fullWidth>
          <InputLabel id='branch-label'>Filiallar</InputLabel>
          <Select
            size='small'
            labelId='branch-label'
            label='Filiallar'
            value={branch}
            onChange={e => {
              setBranch(e.target.value)
            }}
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
