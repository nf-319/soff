import useResponsive from '@/@core/hooks/useResponsive'
import { TrendCard } from '@/components/TrendCard'
import { useGet } from '@/hooks/useApi'
import { Box } from '@mui/material'
import { AlertTriangle, BarChart3, Bell, Lightbulb, UserCheck } from 'lucide-react'

const CpanelStatsCards = () => {
  const { data } = useGet('owner/feedback_card/')

  const summaryData = [
    {
      icon: Bell,
      iconColor: '#3b82f6',
      title: "Tizimning o'rtacha bahosi",
      value: `${data?.avg_rating} / 10`,
      trend: 'up'
    },
    {
      icon: UserCheck,
      iconColor: '#10b981',
      title: "Texnik bo'lim bahosi",
      value: `${data?.avg_tech_rating} / 10`,
      trend: 'up'
    },
    {
      icon: BarChart3,
      iconColor: '#8b5cf6',
      title: 'Javob berish foizi',
      value: `${data?.reply_percentage}%`,
      trend: 'up'
    },
    {
      icon: AlertTriangle,
      iconColor: '#facc15',
      title: 'Kelgan kamchiliklar soni',
      value: data?.suggestions_count,
      trend: 'up',
      isIssueCard: true
    },
    {
      icon: Lightbulb,
      iconColor: '#f97316',
      title: "Qo'shimcha funksiya so'rovlari",
      value: data?.weaknesses_count,
      trend: 'up'
    }
  ]

  return (
    <Box>
      <Box display={'flex'} gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
        {summaryData.map((item, index) => (
          <Box key={index} flex='1 1 calc(20% - 16px)' minWidth={150}>
            <TrendCard
              iconColor={item.iconColor}
              title={item.title}
              count={item.value}
              icon={item.icon}
              tooltip={item.title}
              process={null}
              trendDirection={'up'}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default CpanelStatsCards
