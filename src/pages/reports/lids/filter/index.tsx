import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import { FilterIcon } from 'lucide-react'
import { useState } from 'react'
import useResponsive from 'src/@core/hooks/useResponsive'

const LidsReportsFilter = () => {
  const [duration, setDuration] = useState('3')
  const [branch, setBranch] = useState('')
  const { isMobile } = useResponsive()
  const [isOpenFilterModal, setOpenFilterModal] = useState(false)
  const handleApplyFilters = () => {
    console.log('Applied filters:', { duration, branch })
  }

  function onClose() {
    setOpenFilterModal(false)
  }

  return (
    <>
      <Card sx={{ padding: 4, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;' }}>
        <Box sx={{ display: 'flex', flexWrap: isMobile ? 'wrap' : '', alignItems: 'center', gap: isMobile ? 2 : 35 }}>
          <Box
            sx={{ width: '100%' }}
            flexWrap={isMobile ? 'wrap' : 'nowrap'}
            display={'flex'}
            alignItems={'center'}
            gap={2}
          >
            <FormControl fullWidth>
              <InputLabel id='duration-label'>Davomiyligi</InputLabel>
              <Select
                labelId='duration-label'
                value={duration}
                onChange={e => setDuration(e.target.value)}
                label='Duration'
              >
                <MenuItem value={'3'}>3 oy</MenuItem>
                <MenuItem value={'4'}>4 oy</MenuItem>
                <MenuItem value={'5'}>5 oy</MenuItem>
                <MenuItem value={'6'}>6 oy</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id='branch-label'>Fillial</InputLabel>
              <Select labelId='branch-label' value={branch} onChange={e => setBranch(e.target.value)} label='Fillial'>
                <MenuItem value={''}>Hamma filliallar</MenuItem>
                <MenuItem value={'4'}>Test</MenuItem>
                <MenuItem value={'5'}>Test</MenuItem>
                <MenuItem value={'6'}>Test</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            size='medium'
            startIcon={<FilterIcon size={16} />}
            onClick={() => setOpenFilterModal(true)}
            variant='contained'
          >
            Filter
          </Button>
        </Box>
      </Card>
      <Dialog onClose={onClose} fullWidth open={isOpenFilterModal}>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <FormControl sx={{ marginTop: 2 }} fullWidth>
            <InputLabel id='duration-label'>Davomiyligi</InputLabel>
            <Select
              labelId='duration-label'
              value={duration}
              onChange={e => setDuration(e.target.value)}
              label='Duration'
            >
              <MenuItem value={'3'}>3 oy</MenuItem>
              <MenuItem value={'4'}>4 oy</MenuItem>
              <MenuItem value={'5'}>5 oy</MenuItem>
              <MenuItem value={'6'}>6 oy</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='duration-label'>Filliallar</InputLabel>
            <Select
              labelId='duration-label'
              value={duration}
              onChange={e => setDuration(e.target.value)}
              label='Duration'
            >
              <MenuItem value={'3'}>3 oy</MenuItem>
              <MenuItem value={'4'}>4 oy</MenuItem>
              <MenuItem value={'5'}>5 oy</MenuItem>
              <MenuItem value={'6'}>6 oy</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant='contained' fullWidth>
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LidsReportsFilter
