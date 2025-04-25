import { Card, Typography } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import { ResponsiveLine } from '@nivo/line'
import useResponsive from '@/@core/hooks/useResponsive'
import { useGetLeadsYearlyStatus } from '@/shared/query-hooks/report-leads/reportLeads'
import { EmptyContent } from '@/components/empty-content'

const YearlyTrend = () => {
  const { settings } = useSettings()
  const { data, isLoading } = useGetLeadsYearlyStatus()
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const { isMobile } = useResponsive()

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const yearlyTrendData = [
    {
      id: 'Yangi lidlar',
      color: 'hsl(240, 70%, 50%)',
      data: data?.map(item => ({
        x: monthNames[parseInt(item.month, 10) - 1],
        y: parseInt(item.new_count, 10)
      }))
    },
    {
      id: 'Roʻyxatdan oʻtgan',
      color: 'hsl(120, 70%, 50%)',
      data: data?.map(item => ({
        x: monthNames[parseInt(item.month, 10) - 1],
        y: parseInt(item.enrolled_count, 10)
      }))
    },
    {
      id: "Yo'qotilgan Lidlar",
      color: 'hsl(0, 70%, 50%)',
      data: data?.map(item => ({
        x: monthNames[parseInt(item.month, 10) - 1],
        y: parseInt(item.lost_count, 10)
      }))
    }
  ]

  const normalizedData = yearlyTrendData?.map(series => ({
    ...series,
    data: series.data ?? []
  }))

  return (
    <Card
      sx={{
        width: '100%',
        height: { xs: 300, sm: 400, md: 500 },
        p: 2
      }}
    >
      <Typography sx={{ px: 6, py: 4 }} color={'black'} fontSize={20} fontWeight={700}>
        Yillik yetakchi trendi
      </Typography>
      {!normalizedData.length ? (
        <EmptyContent />
      ) : (
        <ResponsiveLine
          data={normalizedData}
          margin={{ top: 20, right: isMobile ? 50 : 140, bottom: isMobile ? 110 : 90, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          yFormat=' >-.0f'
          curve='cardinal'
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: 36,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          enableGridX={false}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableSlices='x'
          crosshairType='cross'
          useMesh={true}
          legends={[
            {
              anchor: isMobile ? 'bottom' : 'bottom-right',
              direction: isMobile ? 'row' : 'column',
              translateX: isMobile ? 0 : 100,
              translateY: isMobile ? 50 : 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          motionConfig='stiff'
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
                color: textColor,
                fontSize: 12,
                borderRadius: 4,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }
            },
            crosshair: {
              line: {
                stroke: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                strokeOpacity: 0.75
              }
            }
          }}
        />
      )}
    </Card>
  )
}

export default YearlyTrend
