import { useSettings } from '@/@core/hooks/useSettings'
import { useGetReportLeadsChart } from '@/shared/query-hooks/report-leads/reportLeads'
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { ResponsiveLine } from '@nivo/line'
import { X } from 'lucide-react'
import { EmptyContent } from '../empty-content'

const LeadsDashboardCardModal = ({ id, setOpen }: { id: string | null; setOpen: (status: any) => void }) => {
  const { data, isLoading } = useGetReportLeadsChart({ status: String(id) })
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const textColor = settings.mode == 'dark' ? '#ffffff' : '#333333'
  const gridColor = settings.mode == 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const formattedData = [
    {
      id: id || 'status',
      data:
        data?.results.map(item => ({
          x: monthNames[parseInt(item.month, 10) - 1],
          y: parseInt(item.count, 10)
        })) || []
    }
  ]

  return (
    <Dialog fullWidth open={id == 'new' || id == 'rejected'} onClose={() => setOpen(null)}>
      <DialogTitle sx={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Typography> {id == 'new' ?  'Yangi lidlar':"Yo'qotilgan lidlar"}</Typography>
        <IconButton
          edge='end'
          color='inherit'
          onClick={() => setOpen(null)} // Close the modal when clicked
          aria-label='close'
          sx={{
            color: textColor
          }}
        >
          <X />
        </IconButton>
      </DialogTitle>{' '}
      <DialogContent>
        {isLoading ? (
          <Box display='flex' alignItems='center' justifyContent='center' height='100%'>
            <CircularProgress />
          </Box>
        ) : formattedData[0].data.length === 0 ? (
          <Box display='flex' alignItems='center' justifyContent='center' height='100%'>
            <EmptyContent/>
          </Box>
        ) : (
          <Box style={{ height: '400px', width: '100%' }}>
            {' '}
            {/* Set fixed height here */}
            <ResponsiveLine
              data={formattedData}
              margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
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
                legend: 'Oylar',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Lidlar',
                legendOffset: -40,
                legendPosition: 'middle'
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
                    color: textColor
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
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default LeadsDashboardCardModal
