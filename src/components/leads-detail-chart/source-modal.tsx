import { useGet } from '@/hooks/useApi'
import { Box, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { EmptyContent } from '../empty-content'
import { ResponsiveBar } from '@nivo/bar'
import { useSettings } from '@/@core/hooks/useSettings'
import { ResponsivePie } from '@nivo/pie'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CourseInterest from '@/pages/reports/lid-statements/pie-charts/course-interest'
import { truncateLabel } from '@/shared/utils'
import { useRouter } from 'next/router'

const ReportLeadsSourceModal = ({ open, setOpen }: { open: boolean; setOpen: (status: boolean) => void }) => {
  const router = useRouter()
  const { branch } = router.query

  const { data } = useGet('leads/source-stats/all/', { params: { branch: String(branch) }, options: { enabled: open } })
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const { t } = useTranslation()
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  const marketingSourcesData = data?.sources.map((item: any) => ({
    source: item.name,
    conversionRate: item.conversion_rate
  }))

  return (
    <Box>
      <Dialog onClose={() => setOpen(false)} maxWidth='md' fullWidth open={open}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5'>Marketing Statistikasi</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box flexDirection='column' sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Card sx={{ border: '1px solid lightgray ', boxShadow: 'none', width: '100%', height: 300 }}>
              <Typography sx={{ px: 6, pt: 4, pb: 2 }} color={'black'} fontSize={20} fontWeight={700}>
                Manba
              </Typography>

              {!marketingSourcesData?.length ? (
                <EmptyContent />
              ) : (
                <ResponsiveBar
                  data={marketingSourcesData}
                  keys={['conversionRate']}
                  indexBy='source'
                  margin={{ top: 30, right: 40, bottom: 120, left: 30 }}
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
                    tickRotation: 30,
                    legendPosition: 'middle',
                    legendOffset: 50,
                    format: value => truncateLabel(value)
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: t('Konversiya (%)'),
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                  }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 4,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      symbolSize: 12,
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: '#000'
                          }
                        }
                      ]
                    }
                  ]}
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
            <CourseInterest isCard data={data?.courses || []} sx={{ height: 500 }} />
          </Box>

          <Card sx={{ p: 4, mt: 4 }}>
            <Typography variant='h5' pb={3}>
              Manba ma'lumotlari
            </Typography>
            <Grid container spacing={3}>
              {!data?.sources?.length ? (
                <EmptyContent title="Manba ma'lumotlari yo'q" />
              ) : (
                data?.sources?.map((item: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        boxShadow: 'none',
                        backgroundColor: '#f9f9f9',
                        borderRadius: 1,
                        border: '1px solid lightgray',
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Typography sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>{item?.name}</Typography>
                        <Typography sx={{ mb: 0.5 }}>
                          Umumiy lidlar:{' '}
                          <Typography component='span' sx={{ fontWeight: 600, color: '#1976d2' }}>
                            {item?.total_count}
                          </Typography>
                        </Typography>
                        <Typography>
                          Konversatsiya:{' '}
                          <Typography component='span' sx={{ fontWeight: 600, color: '#1976d2' }}>
                            {item?.conversion_rate}
                          </Typography>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Card>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ReportLeadsSourceModal
