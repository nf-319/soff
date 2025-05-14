import { ComingSoon } from '@/components/ComingSoon'
import { TrendCard } from '@/components/TrendCard'
import { Box } from '@mui/material'
import { statsCards, yearlyTrendData } from '../config/constansts'
import { useState } from 'react'
import { ReportsChartModal } from '@/components/ReportsChartModal'

export function PaymentReportCards() {
  const [open, setOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<any>(null)
 
  return (
    <Box
      display='flex'
      flexDirection={{ md: 'row', xs: 'column' }}
      justifyContent='space-between'
      sx={{ width: '100%', gap: 2 }}
    >
      {statsCards.map((item, index) => (
        <Box key={index} flex='1 1 calc(20% - 16px)' minWidth={150}>
          {!item.process ? (
            <ComingSoon brightness='0.9' sx={{ height: '100%' }} size='small' title={'Malumot yetarli emas'}>
              <TrendCard
                title={item.title}
                id={item.id}
                count={item.count}
                icon={item.icon}
                hiddenMoreButton={!item.hiddenMoreButton}
                iconColor={item.iconColor}
                process={item.process}
                trendDirection={item.trendDirection}
              />
            </ComingSoon>
          ) : (
            <TrendCard
              onClick={() => {
                setOpen(true), setSelectedCard(item)
              }}
              title={item.title}
              id={item.id}
              count={item.count}
              icon={item.icon}
              hiddenMoreButton={!item.hiddenMoreButton}
              iconColor={item.iconColor}
              process={item.process}
              trendDirection={item.trendDirection}
            />
          )}
        </Box>
      ))}
      <ReportsChartModal type='chart' data={yearlyTrendData || []} modalTitle={selectedCard?.title || ''} open={open} setOpen={setOpen} />
    </Box>
  )
}
