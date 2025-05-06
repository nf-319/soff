import { Box, Card, Typography } from '@mui/material'
import { TrendingDown, TrendingUp, LucideIcon } from 'lucide-react'

type TrendCardProps = {
  title: string
  id?: string | number
  count: string | number
  icon: LucideIcon
  iconColor?: string
  process?: string | number
  trendDirection?: 'up' | 'down'
  trendColor?: string
  pillColor?: string
  onClick?: () => void
  hiddenMoreButton?: boolean
}

export const TrendCard = ({
  title,
  count,
  icon: Icon,
  iconColor,
  process,
  trendDirection,
  trendColor,
  pillColor,
  onClick,
  hiddenMoreButton = false,
}: TrendCardProps) => {
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown

  return (
    <Card
      sx={{
        padding: 5,
        height: '100%',
        transition: '0.3s',
        border: '1px solid hsl(240, 5.9%, 90%)',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          cursor: 'pointer'
        }
      }}
      onClick={onClick}
    >
      <Box display='flex' flexDirection='column' gap={3}>
        <Box className='d-flex justify-content-between align-items-start'>
          <Icon size={32} color={iconColor || 'black'} />
          {process !== null && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: pillColor || '#ccc',
                px: 3,
                py: 1,
                borderRadius: 1
              }}
            >
              <TrendIcon size={16} color={trendColor} />
              <Typography color={trendColor} fontSize={13} fontWeight={500}>
                {process}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>{count}</Typography>
        <Typography
          sx={{
            fontSize: 15,
            cursor: 'pointer',
            transition: '0.3s',
            p: 1,
            borderRadius: 1
          }}
        >
          {title}
        </Typography>

        {hiddenMoreButton && (
          <div>
            <Typography
              sx={{
                color: 'black',
                fontSize: 15,
                cursor: 'pointer',
                transition: '0.3s',
                p: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              }}
            >
              To'liqroq malumot
            </Typography>
          </div>
        )}
      </Box>
    </Card>
  )
}

TrendCard.displayName = 'TrendCard'
