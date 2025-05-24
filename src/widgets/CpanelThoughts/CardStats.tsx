import useResponsive from '@/@core/hooks/useResponsive'
import { TrendCard } from '@/components/TrendCard'
import { Box } from '@mui/material'
import { AlertTriangle, BarChart3, Bell, Lightbulb, UserCheck } from 'lucide-react'

const CpanelStatsCards = () => {
  const {isMobile} = useResponsive()
  const summaryData = [
    {
      icon: Bell,
      iconColor: '#3b82f6', 
      title: "Tizimning o'rtacha bahosi",
      value: '8.7 / 10',
      change: '+3.6%',
      trend: 'up'
    },
    {
      icon: UserCheck,
      iconColor: '#10b981', 
      title: "Texnik bo'lim bahosi",
      value: '9.1 / 10',
      change: '+2.1%',
      trend: 'up'
    },
    {
      icon: BarChart3,
      iconColor: '#8b5cf6', 
      title: 'Javob berish foizi',
      value: '65%',
      change: '+5%',
      trend: 'up'
    },
    {
      icon: AlertTriangle,
      iconColor: '#facc15', 
      title: 'Kelgan kamchiliklar soni',
      value: '24',
      change: '+4%',
      trend: 'up',
      isIssueCard: true
    },
    {
      icon: Lightbulb,
      iconColor: '#f97316', 
      title: "Qo'shimcha funksiya so'rovlari",
      value: '15',
      change: '+8%',
      trend: 'up'
    }
  ]

  return (
    <Box>
      <Box display={'flex'} gap={3} flexDirection={{ xs: 'column',md:'row' }} >
        {summaryData.map((item, index) => (
          <Box key={index} flex='1 1 calc(20% - 16px)' minWidth={150}>
            <TrendCard
              iconColor={item.iconColor}
              title={item.title}
              count={item.value}
              icon={item.icon}
              tooltip={item.title}
              process={item.change}
              trendDirection={'up'}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CpanelStatsCards
