import { EmptyContent } from '@/components/empty-content'
import { ReportLeadsCourseType } from '@/types/report'
import { Card, Box, Typography } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { useSettings } from 'src/@core/hooks/useSettings'

const CourseInterest = ({ data }: { data: ReportLeadsCourseType[] }) => {
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'

  const courseInterestData = data.map(item => ({
    id: item.name,
    label: item.name,
    value: item.count
  }))

  return (
    <Card
      sx={{
        height: { xs: 350, sm: 400 },
        width: '100%',
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography sx={{ px: 6, pt: 4, pb: 2 }} color={'black'} fontSize={20} fontWeight={700}>
        Kurslar
      </Typography>
      {!courseInterestData.length ? (
        <EmptyContent />
      ) : (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <ResponsivePie
            data={courseInterestData}
            margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
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
  )
}

export default CourseInterest
