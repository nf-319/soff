import { useSettings } from '@/@core/hooks/useSettings'
import { useGetReportLeadsChart } from '@/shared/query-hooks/report-leads/reportLeads'
import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { ResponsiveLine } from '@nivo/line'
import { X } from 'lucide-react'
import { EmptyContent } from '../empty-content'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { uzbekMonths } from '@/shared/constans'

const LeadsDashboardCardModal = ({ id, setOpen }: { id: string | null; setOpen: (status: any) => void }) => {
  const router = useRouter()
  const { branch } = router.query
  const branchParam = branch && branch !== "undefined" ? String(branch) : undefined
  const { data, isLoading } = useGetReportLeadsChart({ status: String(id), branch: branchParam })
  const { settings } = useSettings()
  const { t } = useTranslation()
  const isDark = settings.mode === 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1

  const formatChartData = () => {
    if (!data?.results) return []

    const monthData = Array.from({ length: currentMonth }, (_, i) => {
      const month = i + 1
      const found = data.results.find(item => parseInt(item.month, 10) === month)
      return {
        x: uzbekMonths[i],
        y: found ? parseInt(found.count, 10) : 0
      }
    })

    return [
      {
        id: t(String(id)) || 'status',
        data: monthData
      }
    ]
  }

  const formattedData = formatChartData()

  const isDataEmpty = !formattedData.length || formattedData[0].data.length === 0 ||
    formattedData[0].data.every(item => item.y === 0)

  return (
    <Dialog fullWidth maxWidth='md' open={id === 'new' || id === 'rejected'} onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>{id === 'new' ? 'Yangi lidlar' : "Yo'qotilgan lidlar"}</Typography>
        <IconButton
          edge='end'
          color='inherit'
          onClick={() => setOpen(null)}
          aria-label='close'
          sx={{
            color: textColor
          }}
        >
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box display='flex' alignItems='center' justifyContent='center' height='100%'>
            <CircularProgress />
          </Box>
        ) : isDataEmpty ? (
          <Box display='flex' alignItems='center' justifyContent='center' height='100%'>
            <EmptyContent />
          </Box>
        ) : (
          <Box style={{ height: '400px', width: '100%' }}>
            <ResponsiveLine
              data={formattedData}
              margin={{ top: 20, right: 40, bottom: 50, left: 60 }}
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
              enableArea={false}
              areaBaselineValue={0}
              colors={{ scheme: 'category10' }}
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
