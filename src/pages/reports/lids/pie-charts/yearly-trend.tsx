import { Card } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
// import { ResponsiveLine } from '@nivo/line'

const YearlyTrend = () => {
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

  const yearlyTrendData = [
    {
      id: 'New Leads',
      color: 'hsl(240, 70%, 50%)',
      data: [
        { x: 'Jan', y: 120 },
        { x: 'Feb', y: 140 },
        { x: 'Mar', y: 160 },
        { x: 'Apr', y: 180 },
        { x: 'May', y: 200 },
        { x: 'Jun', y: 220 },
        { x: 'Jul', y: 240 },
        { x: 'Aug', y: 260 },
        { x: 'Sep', y: 280 },
        { x: 'Oct', y: 300 },
        { x: 'Nov', y: 320 },
        { x: 'Dec', y: 340 }
      ]
    },
    {
      id: 'Enrolled',
      color: 'hsl(120, 70%, 50%)',
      data: [
        { x: 'Jan', y: 40 },
        { x: 'Feb', y: 45 },
        { x: 'Mar', y: 50 },
        { x: 'Apr', y: 55 },
        { x: 'May', y: 60 },
        { x: 'Jun', y: 65 },
        { x: 'Jul', y: 70 },
        { x: 'Aug', y: 75 },
        { x: 'Sep', y: 80 },
        { x: 'Oct', y: 85 },
        { x: 'Nov', y: 90 },
        { x: 'Dec', y: 95 }
      ]
    },
    {
      id: 'Lost Leads',
      color: 'hsl(0, 70%, 50%)',
      data: [
        { x: 'Jan', y: 20 },
        { x: 'Feb', y: 22 },
        { x: 'Mar', y: 24 },
        { x: 'Apr', y: 26 },
        { x: 'May', y: 28 },
        { x: 'Jun', y: 30 },
        { x: 'Jul', y: 32 },
        { x: 'Aug', y: 34 },
        { x: 'Sep', y: 36 },
        { x: 'Oct', y: 38 },
        { x: 'Nov', y: 40 },
        { x: 'Dec', y: 42 }
      ]
    }
  ]
  return (
    <Card style={{height:'100%'}}>
      {/*<ResponsiveLine*/}
      {/*  data={yearlyTrendData}*/}
      {/*  margin={{ top: 50, right: 110, bottom: 50, left: 60 }}*/}
      {/*  xScale={{ type: 'point' }}*/}
      {/*  yScale={{*/}
      {/*    type: 'linear',*/}
      {/*    min: 'auto',*/}
      {/*    max: 'auto',*/}
      {/*    stacked: false,*/}
      {/*    reverse: false*/}
      {/*  }}*/}
      {/*  yFormat=' >-.0f'*/}
      {/*  curve='cardinal'*/}
      {/*  axisTop={null}*/}
      {/*  axisRight={null}*/}
      {/*  axisBottom={{*/}
      {/*    tickSize: 5,*/}
      {/*    tickPadding: 5,*/}
      {/*    tickRotation: 0,*/}
      {/*    legendOffset: 36,*/}
      {/*    legendPosition: 'middle',*/}
      {/*    truncateTickAt: 0*/}
      {/*  }}*/}
      {/*  axisLeft={{*/}
      {/*    tickSize: 5,*/}
      {/*    tickPadding: 5,*/}
      {/*    tickRotation: 0,*/}
      {/*    legendOffset: -40,*/}
      {/*    legendPosition: 'middle',*/}
      {/*    truncateTickAt: 0*/}
      {/*  }}*/}
      {/*  enableGridX={false}*/}
      {/*  colors={{ scheme: 'category10' }}*/}
      {/*  lineWidth={3}*/}
      {/*  pointSize={10}*/}
      {/*  pointColor={{ theme: 'background' }}*/}
      {/*  pointBorderWidth={2}*/}
      {/*  pointBorderColor={{ from: 'serieColor' }}*/}
      {/*  pointLabelYOffset={-12}*/}
      {/*  enableSlices='x'*/}
      {/*  crosshairType='cross'*/}
      {/*  useMesh={true}*/}
      {/*  legends={[*/}
      {/*    {*/}
      {/*      anchor: 'bottom-right',*/}
      {/*      direction: 'column',*/}
      {/*      justify: false,*/}
      {/*      translateX: 100,*/}
      {/*      translateY: 0,*/}
      {/*      itemsSpacing: 0,*/}
      {/*      itemDirection: 'left-to-right',*/}
      {/*      itemWidth: 80,*/}
      {/*      itemHeight: 20,*/}
      {/*      itemOpacity: 0.75,*/}
      {/*      symbolSize: 12,*/}
      {/*      symbolShape: 'circle',*/}
      {/*      symbolBorderColor: 'rgba(0, 0, 0, .5)',*/}
      {/*      effects: [*/}
      {/*        {*/}
      {/*          on: 'hover',*/}
      {/*          style: {*/}
      {/*            itemBackground: 'rgba(0, 0, 0, .03)',*/}
      {/*            itemOpacity: 1*/}
      {/*          }*/}
      {/*        }*/}
      {/*      ]*/}
      {/*    }*/}
      {/*  ]}*/}
      {/*  motionConfig='stiff'*/}
      {/*  theme={{*/}
      {/*    axis: {*/}
      {/*      domain: {*/}
      {/*        line: {*/}
      {/*          stroke: textColor,*/}
      {/*          strokeWidth: 1*/}
      {/*        }*/}
      {/*      },*/}
      {/*      ticks: {*/}
      {/*        line: {*/}
      {/*          stroke: textColor,*/}
      {/*          strokeWidth: 1*/}
      {/*        },*/}
      {/*        text: {*/}
      {/*          fill: textColor*/}
      {/*        }*/}
      {/*      },*/}
      {/*      legend: {*/}
      {/*        text: {*/}
      {/*          fill: textColor,*/}
      {/*          fontSize: 12*/}
      {/*        }*/}
      {/*      }*/}
      {/*    },*/}
      {/*    grid: {*/}
      {/*      line: {*/}
      {/*        stroke: gridColor,*/}
      {/*        strokeWidth: 1*/}
      {/*      }*/}
      {/*    },*/}
      {/*    legends: {*/}
      {/*      text: {*/}
      {/*        fill: textColor*/}
      {/*      }*/}
      {/*    },*/}
      {/*    tooltip: {*/}
      {/*      container: {*/}
      {/*        background: isDark ? '#1e1e1e' : '#ffffff',*/}
      {/*        color: textColor,*/}
      {/*        fontSize: 12,*/}
      {/*        borderRadius: 4,*/}
      {/*        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'*/}
      {/*      }*/}
      {/*    },*/}
      {/*    crosshair: {*/}
      {/*      line: {*/}
      {/*        stroke: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',*/}
      {/*        strokeWidth: 1,*/}
      {/*        strokeOpacity: 0.75*/}
      {/*      }*/}
      {/*    }*/}
      {/*  }}*/}
      {/*/>*/}
    </Card>
  )
}


export default YearlyTrend
