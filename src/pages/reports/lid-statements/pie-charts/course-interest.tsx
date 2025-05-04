import { EmptyContent } from '@/components/empty-content'
import { ReportLeadsCourseType } from '@/types/report'
import { Card, Box, Typography, Grid, styled, SxProps, Tooltip } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { useSettings } from 'src/@core/hooks/useSettings'
import { FC } from 'react'
import { ComingSoon } from '@components/ComingSoon'
import { CircleHelp } from 'lucide-react'
import { coursesEmpty } from '@/pages/reports/lid-statements/constants'

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '11px',
  color: '#181818',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))

type Props = {
  data: ReportLeadsCourseType[]
  isCard?: boolean
  sx?: SxProps
}

const CourseInterest: FC<Props> = ({ data, isCard = false, sx }) => {
  const { settings } = useSettings()
  const isDark = settings.mode === 'dark'
  const isActive = data.some(item => item.count > 0)

  const aggregatedData = data.reduce((acc, item) => {
    const existing = acc.find((entry) => entry.name === item.name)
    if (existing) {
      existing.count += item.count
    } else {
      acc.push({ ...item })
    }
    return acc
  }, [] as ReportLeadsCourseType[])

  const courseInterestData = (isActive ? aggregatedData : coursesEmpty).map((item, index) => ({
    id: `${index}-${item?.name?.replace(/\s+/g, '-')}`,
    label: `${item?.name}-${index + 1}`,
    value: item.count,
    color: `hsl(${((index * 360) / aggregatedData.length) % 360}, 50%, 60%)`
  }))


  return (
    <ComingSoon
      text='Kurslarda malumot yetarli emas'
      brightness='0.9'
      size='medium'
      active={isActive}
      sx={{
        height: isCard ? 300 : '100%',
        width: '100%'
      }}
    >
      <Card
        sx={{
          height: isCard ? 300 : '100%',
          width: '100%',
          boxShadow: isCard ? 'none' : 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
          border: isCard ? '1px solid lightgray' : 'none',
          display: 'flex',
          flexDirection: 'column',
          ...sx
        }}
      >
        <Box display='flex' gap={3} sx={{ px: 6, py: 4 }}>
          <Typography color='black' fontSize={20} fontWeight={700}>
            Kurslar
          </Typography>

          <Tooltip title="Bu kurslar haqida malumot">
            <CircleHelp style={{ cursor: 'pointer', color: '#9e9e9e', marginTop: 'auto', marginBottom: 'auto' }} />
          </Tooltip>
        </Box>

        {!courseInterestData.length ? (
          <EmptyContent />
        ) : (
          <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, height: '100%' }}>
              <ResponsivePie
                data={courseInterestData}
                margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                colors={{ scheme: 'nivo' }}
                arcLinkLabelsSkipAngle={12}
                arcLinkLabelsTextColor='#181818'
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={12}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
                arcLinkLabel='label'
                arcLabel='value'
                defs={[
                  {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                  },
                  {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                  }
                ]}
                legends={[]}
                theme={{
                  tooltip: {
                    container: {
                      background: isDark ? '#1e1e1e' : '#ffffff',
                      color: '#181818'
                    }
                  }
                }}
              />
            </Box>
            <Box sx={{ px: 6, pb: 4 }}>
              <Grid container spacing={1}>
                {courseInterestData.map(item => (
                  <Grid item xs={6} key={item.id}>
                    <LegendItem>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: item.color
                        }}
                      />
                      <Typography variant='caption'>{item.label}</Typography>
                    </LegendItem>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Card>
    </ComingSoon>
  )
}

export default CourseInterest
