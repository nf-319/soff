import { Box, Card, Typography } from '@mui/material'
import { ArrowRightLeft, Clock, Megaphone, TrendingDown, TrendingUp, TriangleAlert, User } from 'lucide-react'
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

  const getProcess = (process?: number): "up" | "down" => {
    const results = (process || 0) > 0
    return results ? "up" : "down"
  }

  const getFillColor = (process?: number): string => {
    const results = (process || 0) > 0
    return results ? "#29bf12" : "#ef233c"
  }

  const cards: DashboardCard[] = [
    {
      icon: User,
      title: 'Yangi lidlar',
      process: data?.new_leads_progress || 0,
      count: data?.new_leads || 0,
      trendDirection: getProcess(data?.new_leads_progress),
      trendColor: '#fff',
      pillColor: getFillColor(data?.new_leads_progress)
    },
    {
      icon: ArrowRightLeft,
      title: 'Jami konversiyalar',
      process: data?.conversion_progress || 0,
      count: data?.conversion || 0,
      trendDirection: getProcess(data?.conversion_progress),
      trendColor: '#fff',
      pillColor: getFillColor(data?.conversion_progress),
      iconColor: '#29bf12'
    },
    {
      icon: TriangleAlert,
      title: "Yo'qotilgan lidlar",
      process: data?.lost_leads_progress || 0,
      count: data?.lost_leads || 0,
      trendDirection: getProcess(data?.lost_leads_progress),
      trendColor: '#fff',
      pillColor: getFillColor(data?.lost_leads_progress),
      iconColor: '#ef233c'
    },
    {
      icon: Megaphone,
      title: 'Eng yaxshi marketing manbasi',
      process: data?.top_lead_source_progress || 0,
      count: data?.top_lead_source || 0,
      trendDirection: getProcess(data?.top_lead_source_progress),
      trendColor: '#fff',
      pillColor: getFillColor(data?.top_lead_source_progress),
      iconColor: '#ffc300'
    },
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
              </Box>
            </Card>
          </Box>
        )
      })}
    </Box>
  )
}

export default LidsReportsCard
