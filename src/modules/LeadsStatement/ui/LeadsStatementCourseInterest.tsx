import { EmptyContent } from '@components/empty-content'
import { ReportLeadsCourseType } from '@/types/report'
import { Card, Box, Typography, Grid, styled, SxProps, Tooltip } from '@mui/material'
import { FC } from 'react'
import { ComingSoon } from '@components/ComingSoon'
import { CircleHelp } from 'lucide-react'
import { coursesEmpty } from '@/shared/constants'
import { PieChart } from '@components/PieChart'
import { colorSchemes } from '@nivo/colors'

const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '11px',
  color: '#181818',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}))

type Props = {
  data: ReportLeadsCourseType[]
  isCard?: boolean
  sx?: SxProps
}

export const LeadsStatementCourseInterest: FC<Props> = ({ data, isCard = false, sx }) => {
  const isActive = data.some(item => item.count > 0)

  const aggregatedData = data.reduce((acc, item) => {
    const existing = acc.find(entry => entry.name === item.name)
    if (existing) {
      existing.count += item.count
    } else {
      acc.push({ ...item })
    }
    return acc
  }, [] as ReportLeadsCourseType[])

  const courseInterestData = (() => {
    const nameCounts: Record<string, number> = {}

    return (isActive ? aggregatedData : coursesEmpty).map((item, index) => {
      nameCounts[item.name] = (nameCounts[item.name] || 0) + 1

      const label = nameCounts[item.name] === 1 ? item.name : `${item.name}-${nameCounts[item.name]}`

      return {
        id: item.name,
        label,
        value: item.count,
        color: colorSchemes.nivo[index % colorSchemes.nivo.length],

      }
    })

  })()

  console.log('courseInterestData  =>', courseInterestData);

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

          <Tooltip title='Leadlarni kurslarga taqsimoti'>
            <CircleHelp style={{ cursor: 'pointer', color: '#9e9e9e', marginTop: 'auto', marginBottom: 'auto' }} />
          </Tooltip>
        </Box>

        {!courseInterestData.length ? (
          <EmptyContent />
        ) : (
          <Box sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, height: '100%' }}>
              <PieChart 
              data={courseInterestData} legend={[]} />
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

LeadsStatementCourseInterest.displayName = 'LeadsStatementCourseInterest'
