import { Box, Card, Typography } from '@mui/material'
import { ArrowRightLeft, Clock, TrendingDown, TrendingUp, TriangleAlert, User } from 'lucide-react'
import { useGetReportLeads } from '@/shared/query-hooks/report-leads/reportLeads'

type DashboardCard = {
  title: string
  count: string | number
  icon: any
  iconColor?: string
  process?: string | number
  trendDirection?: 'up' | 'down'
  trendColor?: string
  pillColor?: string
}

const LidsReportsCard = () => {
  const { data } = useGetReportLeads()

  const cards: DashboardCard[] = [
    {
      icon: User,
      title: 'Yangi lidlar',
      process: data?.new_leads_progress || 0,
      count: data?.new_leads || 0,
      trendDirection: 'up',
      trendColor: '#fff',
      pillColor: '#29bf12'
    },
    {
      icon: ArrowRightLeft,
      title: 'Total Conversions',
      process: '12.5%',
      count: 1245,
      trendDirection: 'up',
      trendColor: '#fff',
      pillColor: '#29bf12',
      iconColor: '#29bf12'
    },
    {
      icon: TriangleAlert,
      title: 'Failed Leads',
      process: '12.5%',
      count: 1245,
      trendDirection: 'down',
      trendColor: '#fff',
      pillColor: '#ef233c',
      iconColor: '#ef233c'
    },
    {
      icon: Clock,
      title: 'Response Time',
      process: '12.5%',
      count: '12 min',
      trendDirection: 'down',
      trendColor: '#fff',
      pillColor: '#ef233c',
      iconColor: '#ffc300'
    },
    {
      icon: TriangleAlert,
      title: 'Lost Leads',
      process: '12.5%',
      count: 1245,
      trendDirection: 'down',
      trendColor: '#fff',
      pillColor: '#ef233c',
      iconColor: '#ef233c'
    }
  ]

  return (
    <Box
      display='flex'
      alignItems='stretch'
      justifyContent='space-between'
      flexWrap='wrap'
      sx={{ width: '100%', gap: 2 }}
    >
      {cards.map((item, index) => {
        const Icon = item.icon
        const TrendIcon = item.trendDirection === 'up' ? TrendingUp : TrendingDown

        return (
          <Box key={index} flex='1 1 calc(20% - 16px)' minWidth={200}>
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
            >
              <Box display='flex' flexDirection='column' gap={5}>
                <Box className='d-flex justify-content-between align-items-start'>
                  <Icon size={40} color={item.iconColor || 'black'} />
                  {item.process && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        background: item.pillColor || '#ccc',
                        px: 3,
                        py: 1,
                        borderRadius: 1
                      }}
                    >
                      <TrendIcon size={16} color={item.trendColor} />
                      <Typography color={item.trendColor} fontSize={13} fontWeight={500}>
                        {item.process}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>{item.count}</Typography>
                <Typography sx={{ fontSize: 15 }}>{item.title}</Typography>
                <Typography
                  sx={{
                    fontSize: 15,
                    color: 'black',
                    marginTop: 2,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }}
                >
                  View Details
                </Typography>
              </Box>
            </Card>
          </Box>
        )
      })}
    </Box>
  )
}

export default LidsReportsCard
