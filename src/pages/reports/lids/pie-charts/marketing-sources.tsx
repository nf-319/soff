import { Card, Typography } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import { ResponsiveBar } from '@nivo/bar'
import { useGetLeadsSourceStatus } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReportLeadsSourceType } from '@/types/report'
import { EmptyContent } from '@/components/empty-content'

// const marketingSourcesData = [
//   { source: 'Facebook', conversionRate: 42 },
//   { source: 'Instagram', conversionRate: 35 },
//   { source: 'Google', conversionRate: 28 },
//   { source: 'Telegram', conversionRate: 22 },
//   { source: 'Referrals', conversionRate: 48 }
// ]

const MarketingSources = ({ data }: { data: ReportLeadsSourceType[] }) => {
  const { settings } = useSettings()

  const marketingSourcesData = data.map(item => ({
    source: item.name,
    conversionRate: item.count
  }))

  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  return (
    <Card sx={{ height: 400 }}>
      <Typography sx={{ px: 6, py: 4 }} color={'black'} fontSize={20} fontWeight={700}>
        Marketing Source
      </Typography>
      {!marketingSourcesData.length ? (
        <EmptyContent />
      ) : (
        <ResponsiveBar
          data={marketingSourcesData}
          keys={['conversionRate']}
          indexBy='source'
          margin={{ top: 10, right: 30, bottom: 100, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]]
          }}
          role='application'
          ariaLabel='Marketing sources conversion rates'
          barAriaLabel={e => `${e.id}: ${e.formattedValue}% for ${e.indexValue}`}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: textColor,
                  strokeWidth: 1
                }
              },
              ticks: {
                line: {
                  stroke: textColor,
                  strokeWidth: 1
                },
                text: {
                  fill: textColor
                }
              },
              legend: {
                text: {
                  fill: textColor,
                  fontSize: 12
                }
              }
            },
            grid: {
              line: {
                stroke: gridColor,
                strokeWidth: 1
              }
            },
            legends: {
              text: {
                fill: textColor
              }
            },
            tooltip: {
              container: {
                background: isDark ? '#1e1e1e' : '#ffffff',
                color: textColor
              }
            }
          }}
        />
      )}
    </Card>
  )
}

export default MarketingSources
