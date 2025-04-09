import { Card, Typography } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { useSettings } from 'src/@core/hooks/useSettings'

const CourseInterest = () => {
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'

  const courseInterestData = [
    { id: 'Web Development', label: 'Web Development', value: 20 },
    { id: 'Data Science', label: 'Data Science', value: 25 },
    { id: 'Mobile App Dev', label: 'Mobile App Dev', value: 20 },
    { id: 'UI/UX Design', label: 'UI/UX Design', value: 15 },
    { id: 'Digital Marketing', label: 'Digital Marketing', value: 5 }
  ]

  return (
    <Card sx={{ height: 500, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;' }}>
      <Typography sx={{ paddingX: 6, paddingTop: 4 }} color={'black'} fontSize={20} fontWeight={700}>
        Course Interest
      </Typography>
      <div style={{ height: 450 }}>
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
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: textColor,
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemTextColor: isDark ? '#3f51b5' : '#3f51b5'
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
      </div>
    </Card>
  )
}

export default CourseInterest
