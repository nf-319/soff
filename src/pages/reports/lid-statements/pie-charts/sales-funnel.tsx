import { Box, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useState } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { ResponsiveFunnel } from '@nivo/funnel'
import { useGet } from '@/hooks/useApi'
import { EmptyContent } from '@/components/empty-content'
import { useRouter } from 'next/router'

const SalesFunnel = () => {
  const { settings } = useSettings()
  const router = useRouter()
  const { branch } = router.query
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const { data } = useGet('leads/sales-funnel/', { params: { branch: String(branch) }, options: { enabled: !!branch } })

  const labelMap: { [key: string]: string } = {
    all_leads: 'All Leads',

    connected_leads: 'Contacted',
    test_period: 'Demo Given',
    enrolled_leads: 'Enrolled'
  }

  const updatedFunnelData = data
    ? Object.entries(data).map(([key, value]) => ({
        id: labelMap[key],
        value: Number(value),
        label: labelMap[key]
      }))
    : []

  return (
    <Card
      sx={{
        height: { xs: 400, sm: 500 },
        width: '100%',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography sx={{ px: 6, py: 4 }} color={'black'} fontSize={20} fontWeight={700}>
        Savdo voronkasi
      </Typography>
      {!updatedFunnelData?.length ? (
        <EmptyContent />
      ) : (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <ResponsiveFunnel
            data={updatedFunnelData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            valueFormat='>-.0f'
            colors={{ scheme: 'nivo' }}
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
        </Box>
      )}
    </Card>
  )
}

export default SalesFunnel
