'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CustomAvatar from '../../mui/avatar'
import { CardStatsVerticalProps } from '../types'
import useResponsive from '../../../@core/hooks/useResponsive'
import { formatCurrency } from '@utils/format-currency'
import { useAppSelector } from '@/store'

const CardStatsVertical = ({ title, color, icon, stats, data_key }: CardStatsVerticalProps): JSX.Element => {
  const { eyeVisible } = useAppSelector(state => state.dashboard)
  const { isMobile } = useResponsive()

  const isFinancial = data_key?.includes('amount') || data_key?.includes('debts')
  const formattedTitle = isFinancial ? formatCurrency(title) : title

  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      primary: '#7367F0',
      success: '#28C76F',
      error: '#EA5455',
      warning: '#FF9F43',
      info: '#00CFE8',
      secondary: '#82868B'
    }
    return colorMap[colorName] || colorMap.primary
  }

  const mainColor = getColorValue(color || 'primary')

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: isMobile ? '12px 12px 12px 16px' : '14px 14px 14px 18px',
          '&:last-child': { pb: isMobile ? '12px' : '14px' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CustomAvatar
            sx={{
              width: isMobile ? '24px' : '28px',
              height: isMobile ? '24px' : '28px',
              backgroundColor: `${mainColor}15`,
              color: mainColor
            }}
            skin='light'
            variant='rounded'
          >
            {icon}
          </CustomAvatar>

          <Typography
            variant='caption'
            sx={{
              fontSize: isMobile ? '10px' : '14px',
              color: 'text.secondary',
              textAlign: 'right',
              maxWidth: '70%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {stats}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: isMobile ? '10px' : '14px',
            fontWeight: 600,
            textAlign: 'center',
            color: 'text.primary',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {eyeVisible ? formattedTitle : '***'}
        </Typography>

      </CardContent>
    </Card>
  )
}

export default CardStatsVertical
