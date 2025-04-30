import { useGet } from '@/hooks/useApi'
import { Box, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { EmptyContent } from '../empty-content'
import { ResponsiveBar } from '@nivo/bar'
import { useSettings } from '@/@core/hooks/useSettings'
import { ResponsivePie } from '@nivo/pie'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ReportLeadsSourceModal = ({ open, setOpen }: { open: boolean; setOpen: (status: boolean) => void }) => {
  const { data } = useGet('leads/source-stats/all/', { options: { enabled: open } })
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const { t } = useTranslation()
  const textColor = isDark ? '#ffffff' : '#333333'
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const marketingSourcesData = data?.sources.map((item: any) => ({
    source: item.name,
    conversionRate: item.conversion_rate
  }))

  const courseInterestData = data?.courses?.map((item: any, index: any) => ({
    id: `${item.name}_${item.id}`,
    label: item.name,
    value: item.count
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
          <Box flexDirection={{ xs: 'column', md: 'row' }} sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Card sx={{ border: '1px solid lightgray ', boxShadow: 'none', padding: 6, width: '100%', height: 300 }}>
              {!marketingSourcesData?.length ? (
                <EmptyContent />
              ) : (
                <ResponsiveBar
                  data={marketingSourcesData}
                  keys={['conversionRate']}
                  indexBy='source'
                  margin={{ top: 30, right: 30, bottom: 70, left: 30 }} // bottom marginni oshirdik
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
                    tickRotation: -30, // burish bilan bir-biridan ajratamiz
                    legend: t('Manba'),
                    legendPosition: 'middle',
                    legendOffset: 50
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
            <Card sx={{ border: '1px solid lightgray ', boxShadow: 'none', padding: 4, width: '100%', height: 300 }}>
              {!courseInterestData?.length ? (
                <EmptyContent />
              ) : (
                <ResponsivePie
                  data={courseInterestData}
                  margin={{ top: 40, right: 40, bottom: 120, left: 40 }}
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
                      translateY: 100, // pastga tushurish
                      itemsSpacing: 10, // itemlar orasiga masofa
                      itemWidth: 120, // yozuvlar uzun bo‘lsa kenglik oshirish
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
              )}
            </Card>
          </Box>
          <Card sx={{ p: 4, mt: 4 }}>
            <Typography variant='h5' pb={3}>
              Manba ma'lumotlari
            </Typography>
            <Grid container spacing={3}>
              {data?.sources?.map((item: any, index: number) => (
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
              ))}
            </Grid>
          </Card>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ReportLeadsSourceModal
