import { Card, Typography } from '@mui/material'
import { ResponsiveBar } from '@nivo/bar'
import { useSettings } from 'src/@core/hooks/useSettings'

const marketingSourcesData = [
  { source: 'Facebook', conversionRate: 42 },
  { source: 'Instagram', conversionRate: 35 },
  { source: 'Google', conversionRate: 28 },
  { source: 'Telegram', conversionRate: 22 },
  { source: 'Referrals', conversionRate: 48 }
]

const MarketingSources = () => {
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  return (
    <Card sx={{ height: 500, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;'  }}>
      <Typography sx={{ paddingX: 6, paddingTop: 4 }} color={'black'} fontSize={20} fontWeight={700}>
        Best Marketing Sources
      </Typography>
      <div style={{ height: 450 }}>
        <ResponsiveBar
          data={marketingSourcesData}
          keys={['conversionRate']}
          indexBy='source'
          margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
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
      </div>
    </Card>
  )
}

export default MarketingSources
