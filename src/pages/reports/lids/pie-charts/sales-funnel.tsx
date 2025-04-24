import { Box, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useState } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { ResponsiveFunnel } from '@nivo/funnel'

const SalesFunnel = () => {
  const [duration, setDuration] = useState('3')
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  const updatedFunnelData = [
    { id: 'All Leads', value: 1245, label: 'All Leads' },
    { id: 'Contacted', value: 850, label: 'Contacted' },
    { id: 'Demo Given', value: 520, label: 'Demo Given' },
    { id: 'Enrolled', value: 320, label: 'Enrolled' }
  ]
  return (
    <Card style={{ height: 500, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;' }}>
      <Typography sx={{ paddingX: 6, paddingY: 4 }} color={'black'} fontSize={20} fontWeight={700}>
        Sales Funnel
      </Typography>
      <Box sx={{ paddingX: 5 }}>
        <FormControl>
          <InputLabel id='duration-label'>Duration</InputLabel>
          <Select
            size='small'
            labelId='duration-label'
            value={duration}
            onChange={e => setDuration(e.target.value)}
            label='Duration'
          >
            <MenuItem value={'3'}>3 month</MenuItem>
            <MenuItem value={'4'}>4 month</MenuItem>
            <MenuItem value={'5'}>5 month</MenuItem>
            <MenuItem value={'6'}>6 month</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div style={{ height: '100%' }}>
        <ResponsiveFunnel
          data={updatedFunnelData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          valueFormat='>-.0f'
          colors={{ scheme: 'blues' }}
          borderWidth={20}
          labelColor={textColor}
          beforeSeparatorLength={100}
          beforeSeparatorOffset={20}
          afterSeparatorLength={100}
          afterSeparatorOffset={20}
          currentPartSizeExtension={10}
          currentBorderWidth={40}
          motionConfig='gentle'
          shapeBlending={0.6}
          enableLabel={true}
          theme={{
            labels: {
              text: {
                fontSize: 14,
                fontWeight: 'bold',
                fill: textColor
              }
            },
            tooltip: {
              container: {
                background: isDark ? '#1e1e1e' : '#ffffff',
                color: textColor,
                fontSize: 12,
                borderRadius: 4,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }
            }
          }}
          animate={true}
        />
      </div>
    </Card>
  )
}

export default SalesFunnel
