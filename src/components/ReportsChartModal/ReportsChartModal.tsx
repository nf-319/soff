import useResponsive from '@/@core/hooks/useResponsive'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { ResponsiveLine } from '@nivo/line'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  setOpen: (status: boolean) => void
  modalTitle: string
  data: any[]
  type: 'chart' | 'table'
}

export const ReportsChartModal = ({ open, type, setOpen, modalTitle, data }: Props) => {
  const { isMobile } = useResponsive()

  return (
    <Dialog maxWidth='lg' fullWidth open={open} onClose={() => setOpen(false)}>
      <DialogTitle display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant='h6'>{modalTitle}</Typography>
        <IconButton onClick={() => setOpen(false)}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {type == 'chart' ? (
          <Box width={'100%'} height={500}>
            <ResponsiveLine
              data={data || []}
              margin={{ top: 20, right: isMobile ? 50 : 100, bottom: isMobile ? 90 : 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 0,
                max: 'auto',
                stacked: false,
                reverse: false,
                clamp: true
              }}
              yFormat=' >-.0f'
              curve='monotoneX'
              axisTop={null}
              enableArea={false}
              areaBaselineValue={0}
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
                      stroke: '#333333',
                      strokeWidth: 1
                    }
                  },
                  ticks: {
                    line: {
                      stroke: '#333333',
                      strokeWidth: 1
                    },
                    text: {
                      fill: '#333333'
                    }
                  },
                  legend: {
                    text: {
                      fill: '#333333',
                      fontSize: 12
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: 'rgba(0, 0, 0, 0.1)',
                    strokeWidth: 1
                  }
                },
                legends: {
                  text: {
                    fill: '#333333'
                  }
                },
                tooltip: {
                  container: {
                    background: '#ffffff',
                    color: '#333333',
                    fontSize: 12,
                    borderRadius: 4,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }
                },
                crosshair: {
                  line: {
                    stroke: 'rgba(0, 0, 0, 0.5)',
                    strokeWidth: 1,
                    strokeOpacity: 0.75
                  }
                }
              }}
            />
          </Box>
        ) : (
          'Table'
        )}
      </DialogContent>
    </Dialog>
  )
}

