import { Box, Card, Tooltip, Typography } from '@mui/material'
import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react'

export type TrendCardProps = {
  title: string
  id?: string | number
  count: string | number
  icon: LucideIcon
  iconColor?: string
  process?: string | number
  trendDirection?: 'up' | 'down'
  onClick?: () => void
  tooltip?: string
  hiddenMoreButton?: boolean
  titleLineClamp?: number
}

export const TrendCard = ({
  title,
  count,
  icon: Icon,
  iconColor,
  process,
  trendDirection,
  onClick,
  tooltip,
  hiddenMoreButton = false,
  titleLineClamp
}: TrendCardProps) => {

  const up = trendDirection === 'up'
  const TrendIcon = trendDirection === 'up' ? ArrowUp : ArrowDown

  return (
    <Tooltip title={tooltip}>
      <Card
        sx={{
          padding: 3,
          height: '100%',
          transition: '0.3s',
          border: '1px solid hsl(240, 5.9%, 90%)',
          boxShadow: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'start',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        <Box display='flex' flexDirection='column' width="100%" gap={{ xs: 1, md: 2 }}>
          <Box className='d-flex justify-content-between align-items-start'>
            <Box
              sx={{
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f1f5f9',
                width: '36px',
                height: '36px',
                padding: 2
              }}
            >
              <Icon size={24} color={iconColor || 'black'} />
            </Box>

            {process !== null && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: up ? '#D1FAE5' : '#FEE2E2',
                  borderRadius: '8px',
                  px: 1,
                  py: 1
                }}
              >
                <TrendIcon size={16} color={up ? '#059669' : '#DC2626'} />
                <Typography color={up ? '#059669' : '#DC2626'} fontSize={12} fontWeight={500}>
                  {process}%
                </Typography>
              </Box>
            )}
          </Box>

          <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'black' }}>{count}</Typography>

          <Typography
            sx={{
              fontSize: 14,
              cursor: 'pointer',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              ...(titleLineClamp && { WebkitLineClamp: titleLineClamp })
            }}
          >
            {title}
          </Typography>
        </Box>

        {hiddenMoreButton && (
          <Typography
            component="span"
            sx={{
              color: 'primary.main',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              py: '6px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'inline-block',
              '&:hover': {
                textDecoration: 'underline',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          >
            To'liqroq ma'lumot
          </Typography>
        )}
      </Card>
    </Tooltip>
  )
}

TrendCard.displayName = 'TrendCard'
