import { Box } from '@mui/system'
import { PaymentReportCards } from './ui/PaymentReportCards'
import { FormControl, Select } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { WidgetHeader } from '@components/WidgetHeader'
import { useAllBranches } from '@shared/hooks'
import { useState } from 'react'

export const PaymentReport = () => {
  const allBranches = useAllBranches()
  const [branch, setBranch] = useState<string>('')

  return (
    <Box component='section'>
      <WidgetHeader titleSize="large" title="To'lovlar hisoboti" isDemo>
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
      </WidgetHeader>
      payment
    </Box>
  )
}

PaymentReport.displayName = 'PaymentReport'
