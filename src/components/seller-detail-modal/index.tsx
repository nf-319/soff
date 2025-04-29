import { useSettings } from '@/@core/hooks/useSettings'
import { useGetLeadsSellerDetail } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReposrtLeadsSellers } from '@/types/report'
import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Typography
} from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { UserIcon, X } from 'lucide-react'
import { EmptyContent } from '../empty-content'
import { useGet } from '@/hooks/useApi'
import { ResponsiveLine } from '@nivo/line'
import useResponsive from '@/@core/hooks/useResponsive'

const SellerDetailModal = ({
  sellerId,
  setSellerId,
  selectedSeller
}: {
  sellerId: number | null
  setSellerId: (status: any) => void
  selectedSeller: ReposrtLeadsSellers | null
}) => {
  const { data: sellerDetailCourse, isLoading: corseLoading } = useGetLeadsSellerDetail({ id: String(sellerId) })
  const { data, isLoading } = useGet(`leads/seller-conversion/${sellerId}/`, { options: { enabled: !!sellerId } })
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const { isMobile } = useResponsive()
  const textColor = isDark ? '#ffffff' : '#333333'
  const courseInterestData = sellerDetailCourse?.map(item => ({
    id: item.name,
    label: item.name,
    value: item.count
  }))

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const yearlyTrendData = [
    {
      id: 'Lidlar',
      color: 'hsl(240, 70%, 50%)',
      data: data?.map((item: any) => ({
        x: monthNames[parseInt(item.month, 10) - 1],
        y: parseInt(item.conversion_rate, 10)
      }))
    }
  ]

  const normalizedData = yearlyTrendData?.map(series => ({
    ...series,
    data: series.data ?? []
  }))

  return (
    <Dialog maxWidth='md' fullWidth onClose={() => setSellerId(null)} open={!!sellerId}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Sotuvchi detaili</Typography>
        <IconButton onClick={() => setSellerId(null)}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} alignItems={'center'} gap={3}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UserIcon />
          </div>
          <Typography>{selectedSeller?.first_name}</Typography>
        </Box>
        <Box mt={5} display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          <Card
            sx={{
              height: { xs: 300, sm: 300 },
              padding: 4,
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography sx={{ px: 6, py: 4 }} color={'black'} fontSize={20} fontWeight={700}>
              Yillik lidlar foizi
            </Typography>
            {isLoading ? (
              <Skeleton height={350} sx={{ px: 3 }} />
            ) : !normalizedData.length ? (
              <EmptyContent />
            ) : (
              <ResponsiveLine
                data={normalizedData}
                margin={{ top: 20, right: 20, bottom: 50, left: 30 }}
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
            )}
          </Card>
          <Card
            sx={{
              padding: 4,
              height: { xs: 300, sm: 300 },
              width: '100%',
              boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography sx={{ pb: 2 }} color={'black'} fontSize={20} fontWeight={700}>
              Kurslar
            </Typography>
            {corseLoading ? (
              <Skeleton height={350} sx={{ px: 3 }} />
            ) : !courseInterestData?.length ? (
              <EmptyContent />
            ) : (
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <ResponsivePie
                  data={courseInterestData}
                  margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                  }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor={textColor}
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
                  }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 40,
                      itemsSpacing: 0,
                      itemWidth: 80,
                      itemHeight: 18,
                      itemTextColor: textColor,
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 14,
                      symbolShape: 'circle',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: '#3f51b5'
                          }
                        }
                      ]
                    }
                  ]}
                  theme={{
                    tooltip: {
                      container: {
                        background: isDark ? '#1e1e1e' : '#ffffff',
                        color: textColor
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Card>
        </Box>
        <Box mt={5}>
          <Card>
            <Grid sx={{ paddingX: 5, paddingY: 5 }} container spacing={5}>
              <Grid item xs={12} sm={6} md={6}>
                <Card className='shadow-sm border-0' style={{ backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant='subtitle2' color='textSecondary'>
                      Konversatsiya raytingi
                    </Typography>
                    <Typography variant='h5' className='fw-bold mt-2'>
                      {selectedSeller?.conversion_rate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card className='shadow-sm border-0' style={{ backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant='subtitle2' color='textSecondary'>
                      Lidlar soni
                    </Typography>
                    <Typography variant='h5' className='fw-bold mt-2'>
                      {selectedSeller?.worked_lead_count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card className='shadow-sm border-0' style={{ backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant='subtitle2' color='textSecondary'>
                      Ishlagan vaqti
                    </Typography>
                    <Typography variant='h5' className='fw-bold mt-2'>
                      {selectedSeller?.conversion_rate}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card className='shadow-sm border-0' style={{ backgroundColor: '#f9f9f9' }}>
                  <CardContent>
                    <Typography variant='subtitle2' color='textSecondary'>
                      Yo'qotilgan lidlar
                    </Typography>
                    <Typography variant='h5' className='fw-bold mt-2'>
                      {selectedSeller?.lost_leads}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SellerDetailModal
