import { Box } from '@mui/system'
import Typography from '@mui/material/Typography'
import { FormControl, Select } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { useAllBranches } from '@shared/hooks'
import { useState } from 'react'

export const PaymentReportHeader = () => {
  const allBranches = useAllBranches()
  const [branch, setBranch] = useState<string>('')

  return (
    <Box display='flex' justifyContent='center'>
      <Typography variant='h5'>To'lovlar hisoboti</Typography>

      <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
        <FormControl fullWidth>
          <Select
            size='small'
            displayEmpty
            value={branch}
            onChange={event => setBranch(event.target.value as string)}
          >
            {allBranches.map(branch => (
              <MenuItem value={branch.value}>{branch.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

PaymentReportHeader.displayName = 'PaymentReportHeader'
