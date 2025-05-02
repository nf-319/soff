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
import { uzbekMonths } from '@/shared/constans'

const SellerDetailModal = ({
  sellerId,
  setSellerId,
  selectedSeller
}: {
  sellerId: number | null
  setSellerId: (status: any) => void
  selectedSeller: any | null
}) => {
  const { data: sellerData, isLoading } = useGet(`leads/sellers/${sellerId}/`, { options: { enabled: !!sellerId } })
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const textColor = isDark ? '#ffffff' : '#333333'

  const courseInterestData = sellerData?.course_distribution?.map((item: any) => ({
    id: item.name,
    label: item.name,
    value: item.count
  }))

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()

  const yearlyTrendData = [
    {
      id: 'Lidlar',
      color: 'hsl(240, 70%, 50%)',
      data: uzbekMonths.slice(0, currentMonth + 1).map((monthName, index) => {
        const found = sellerData?.conversion_graph?.find((item: any) => parseInt(item.month, 10) === index + 1)

        return {
          x: monthName,
          y: found ? parseInt(found.conversion_rate, 10) : 0
        }
      })
    }
  ]

  type Series = {
    id: string
    color: string
    data: any[]
  }

  const normalizedData: Series[] | undefined = yearlyTrendData?.map(series => ({
    ...series,
    data: series.data ?? []
  }))

  return (
    <Dialog maxWidth='md' fullWidth onClose={() => setSellerId(null)} open={!!sellerId}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h5' fontWeight={700}>
          Eng yaxshi sotuvchi
        </Typography>
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
              color: 'white',
              backgroundColor: '#666CFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UserIcon />
          </div>
          <Box display='flex' flexDirection='column' alignItems='start'>
            <Typography variant='body1' sx={{ fontWeight: '600' }}>
              {selectedSeller?.first_name}
            </Typography>
            <Typography variant='subtitle1' sx={{ fontSize: '12px' }}>
              {selectedSeller?.phone}
            </Typography>
          </Box>
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
            <Typography color={'black'} fontSize={20} fontWeight={700}>
              Yillik lidlar foizi
            </Typography>
            {isLoading ? (
              <Skeleton height={350} sx={{ px: 3 }} />
            ) : normalizedData?.[0]?.data?.length < 1 ? (
              <EmptyContent />
            ) : (
              <ResponsiveLine
                data={normalizedData}
                margin={{ top: 20, right: 20, bottom: 30, left: 30 }}
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
            {isLoading ? (
              <Skeleton height={350} sx={{ px: 3 }} />
            ) : !courseInterestData?.length ? (
              <EmptyContent />
            ) : (
              <Box sx={{ height: 300, flexGrow: 1, width: '100%' }}>
                <ResponsivePie
                  data={courseInterestData}
                  margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
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
                      translateY: 66,
                      itemsSpacing: 16,
                      itemWidth: 120,
                      itemHeight: 20,
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
                <Card style={{ backgroundColor: '#f9f9f9', boxShadow: 'none', border: '1px solid lightgray' }}>
                  <CardContent>
                    <Typography variant='subtitle2' color='textSecondary'>
                      Konversatsiya raytingi
                    </Typography>
                    <Typography variant='h5' className='fw-bold mt-2'>
                      {sellerData?.average_conversion}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Card style={{ backgroundColor: '#f9f9f9', boxShadow: 'none', border: '1px solid lightgray' }}>
                  <CardContent>
                    <Typography variant='subtitle2' color='textSecondary'>
                      Lidlar soni
                    </Typography>
                    <Typography variant='h5' className='fw-bold mt-2'>
                      {sellerData?.total_worked_leads}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Card style={{ backgroundColor: '#f9f9f9', boxShadow: 'none', border: '1px solid lightgray' }}>
                  <CardContent>
                    <Typography variant='subtitle2' color='textSecondary'>
                      Yo'qotilgan lidlar
                    </Typography>
                    <Typography variant='h5' className='fw-bold mt-2'>
                      {sellerData?.lost_leads}
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
