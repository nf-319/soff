import { Card, Typography } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import { ResponsiveBar } from '@nivo/bar'
import { ReportLeadsSourceType } from '@/types/report'
import { EmptyContent } from '@/components/empty-content'
import { truncateLabel } from '@/shared/utils'

const MarketingSources = ({ data }: { data: ReportLeadsSourceType[] }) => {
  const { settings } = useSettings()

  const marketingSourcesData = data.map(item => ({
    source: item.name,
    conversionRate: item.count,
  }))

  const isDark = settings.mode === 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography sx={{ px: 6, py: 4 }} color={'black'} fontSize={20} fontWeight={700}>
        Marketing manbasi
      </Typography>

      {!marketingSourcesData.length ? (
        <EmptyContent />
      ) : (
        <ResponsiveBar
          data={marketingSourcesData}
          keys={['conversionRate']}
          indexBy="source"
          margin={{ top: 10, right: 30, bottom: 70, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 30,
            legendPosition: 'middle',
            legendOffset: 32,
            format: (value) => truncateLabel(value),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          role="application"
          ariaLabel="Marketing sources conversion rates"
          barAriaLabel={(e) => `${e.id}: ${e.formattedValue} for ${e.indexValue}`}
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: textColor,
                  strokeWidth: 1,
                },
              },
              ticks: {
                line: {
                  stroke: textColor,
                  strokeWidth: 1,
                },
                text: {
                  fill: textColor,
                  fontSize: 11,
                },
              },
              legend: {
                text: {
                  fill: textColor,
                  fontSize: 12,
                },
              },
            },
            grid: {
              line: {
                stroke: gridColor,
                strokeWidth: 1,
              },
            },
            legends: {
              text: {
                fill: textColor,
              },
            },
            tooltip: {
              container: {
                background: isDark ? '#1e1e1e' : '#ffffff',
                color: textColor,
              },
            },
          }}
        />
      )}
    </Card>
  )
}

export default MarketingSources
