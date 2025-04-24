'use client'

import { ArrowDown, ArrowUp } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Box,
  SxProps,
} from '@mui/material'
import { FC, ReactElement } from 'react'
import { MiniChart } from './ui/MiniChart'
import { TypographyProps } from '@mui/material/Typography'

type MetricCardProps = {
  title?: string
  value: string
  icon?: ReactElement
  size?: 'small' | 'medium' | 'large'
  description?: string
  statistic?: string
  tooltip?: string
  trend?: 'up' | 'down'
  onClick: () => void
  sx?: SxProps
  isCenter?: boolean
}

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  icon,
  size = 'medium',
  description,
  statistic,
  tooltip,
  trend,
  onClick,
  sx,
  isCenter = false
}) => {
  const isUp = trend === 'up'

  const fontSizeMap: Record<string, TypographyProps['variant']> = {
    small: 'body2',
    medium: 'body1',
    large: 'h6'
  }

  const valueFontMap: Record<string, TypographyProps['variant']> = {
    small: 'body1',
    medium: 'h6',
    large: 'h5'
  }

  return (
    <Card
      onClick={onClick}
      sx={{
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4
        },
        ...sx
      }}
    >
      <CardHeader
        sx={{
          display: 'flex',
          alignItems: isCenter ? 'center' : 'flex-start',
          justifyContent: isCenter ? 'center' : 'space-between',
          flexDirection: isCenter ? 'column' : 'row',
          textAlign: isCenter ? 'center' : 'left',
          pb: 1,
          gap: isCenter ? 1 : 0
        }}
        title={
          <Box display='flex' alignItems='center' gap={1} justifyContent={isCenter ? 'center' : 'flex-start'}>
            {icon && <Box>{icon}</Box>}
            {title && (
              <Typography variant='body2' fontWeight={500}>
                {title}
              </Typography>
            )}
          </Box>
        }
        action={
          trend && !isCenter ? (
            <Tooltip title={tooltip || ''}>
              <IconButton
                sx={{
                  backgroundColor: isUp ? '#dcfce7' : '#fee2e2',
                  color: isUp ? '#16a34a' : '#dc2626',
                  p: '4px'
                }}
              >
                {isUp ? <ArrowUp style={{ width: 16, height: 16 }} /> : <ArrowDown style={{ width: 16, height: 16 }} />}
              </IconButton>
            </Tooltip>
          ) : null
        }
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCenter ? 'center' : 'flex-start',
          textAlign: isCenter ? 'center' : 'left'
        }}
      >
        <Typography variant={valueFontMap[size]} fontWeight='bold'>
          {value}
        </Typography>

        {(description || statistic) && (
          <Box
            mt={1}
            mb={1.5}
            display='flex'
            alignItems='center'
            justifyContent={isCenter ? 'center' : 'space-between'}
            flexDirection={isCenter ? 'column' : 'row'}
            flexWrap='wrap'
            gap={1}
            width='100%'
          >
            {description && (
              <Typography
                variant={fontSizeMap[size]}
                color='text.secondary'
                sx={{
                  minWidth: 0,
                  flex: '1 1 auto',
                  textAlign: isCenter ? 'center' : 'left'
                }}
              >
                {description}
              </Typography>
            )}
            {statistic && (
              <Typography
                variant={fontSizeMap[size]}
                fontWeight={500}
                sx={{
                  minWidth: 0,
                  flexShrink: 0,
                  maxWidth: '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  textAlign: isCenter ? 'center' : 'left'
                }}
              >
                {statistic}
              </Typography>
            )}
          </Box>
        )}

        {trend && <MiniChart trend={trend} />}
      </CardContent>
    </Card>
  )
}
