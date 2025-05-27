import { FC } from 'react'
import { MayHaveLabel, ResponsivePie } from '@nivo/pie'
import { LegendProps } from '@nivo/legends'

type Props =  {
  data: readonly MayHaveLabel[]
  legend?: readonly LegendProps[]
}

export const PieChart: FC<Props> = ({ data }) => (
    <ResponsivePie
      data={data}
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
            background: '#ffffff',
            color: '#181818'
          }
        }
      }}
    />
  )
