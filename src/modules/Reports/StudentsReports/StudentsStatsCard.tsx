import { ComingSoon } from '@/components/ComingSoon'
import { TrendCard } from '@/components/TrendCard'
import { LeadsStatementCardType } from '@modules/LeadsStatement'
import { Box } from '@mui/material'
import { Award, BookOpen, Clock, Percent, Users } from 'lucide-react'

export function StudentsStatsCard() {
  const getFillColor = (process?: number): string => {
    const results = (process || 0) > 0
    return results ? '#29bf12' : '#ef233c'
  }
  const getProcess = (process?: number): 'up' | 'down' => {
    const results = (process || 0) > 0
    return results ? 'up' : 'down'
  }
  const data = {
    new_leads: 25,
    new_leads_progress: 10,
    conversion: 40,
    conversion_progress: -5,
    lost_leads: 12,
    lost_leads_progress: 2,
    top_lead_source: 'Instagram',
    top_lead_source_count: 30,
    top_lead_source_progress: 8,
    best_seller: {
      id: '123',
      first_name: 'Ali'
    },
    best_seller_leads_count: 20,
    best_seller_progress: 15
  }

  const cards: LeadsStatementCardType[] = [
    {
      id: 'new',
      icon: Users,
      title: "Jami o'quvchilari",
      process: data?.new_leads_progress || 0,
      count: data?.new_leads || 0,
      trendDirection: getProcess(data?.new_leads_progress),
      trendColor: '#fff',
      hidden: false,
      pillColor: getFillColor(data?.new_leads_progress),
      iconColor: '#0096c7'
    },
    {
      icon: BookOpen,
      title: "2 va undan ortiq kursda o'qiyotkanlar",
      process: data?.conversion_progress || 0,
      count: data?.conversion || 0,
      trendDirection: getProcess(data?.conversion_progress),
      trendColor: '#fff',
      hidden: true,
      pillColor: getFillColor(data?.conversion_progress),
      iconColor: '#0096c7'
    },
    {
      id: 'rejected',
      icon: Clock,
      title: "Umumiy davomat",
      process: data?.lost_leads_progress || 0,
      count: data?.lost_leads || 0,
      trendDirection: getProcess(data?.lost_leads_progress),
      trendColor: '#fff',
      hidden: false,
      pillColor: getFillColor(data?.lost_leads_progress),
      iconColor: '#029b49'
    },
    {
      id: 'source',
      icon: Award,
      title: "O'rtacha baho",
      process: data?.top_lead_source_progress || 0,
      count: `${data?.top_lead_source_count}` || 0,
      trendDirection: getProcess(data?.top_lead_source_progress),
      trendColor: '#fff',
      hidden: false,
      pillColor: getFillColor(data?.top_lead_source_progress),
      iconColor: '#ffc300'
    },
    {
      id: data?.best_seller?.id,
      icon: Percent,
      title: `${data?.best_seller?.first_name} - eng yaxshi sotuvchi`,
      process: data?.best_seller_progress || 0,
      count: `${data?.best_seller?.first_name}: ${data?.best_seller_leads_count || 0}`,
      trendColor: '#fff',
      hidden: false,
      trendDirection: getProcess(data?.best_seller_leads_count),
      pillColor: getFillColor(data?.best_seller_progress),
      iconColor: '#7209b7'
    }
  ]
  return (
    <Box
      display='flex'
      flexDirection={{ md: 'row', xs: 'column' }}
      justifyContent='space-between'
      sx={{ width: '100%', gap: 2 }}
    >
      {cards.map((item, index) => (
        <Box key={index} flex='1 1 calc(20% - 16px)' minWidth={150}>
          {!item.process ? (
            <ComingSoon brightness='0.9' sx={{ height: '100%' }} size='small' title={'Malumot yetarli emas'}>
              <TrendCard
                title={item.title}
                id={item.id}
                count={item.count}
                icon={item.icon}
                hiddenMoreButton={!item.hidden}
                iconColor={item.iconColor}
                process={item.process}
                trendDirection={item.trendDirection}
                trendColor={item.trendColor}
                pillColor={item.pillColor}
              />
            </ComingSoon>
          ) : (
            <TrendCard
              title={item.title}
              id={item.id}
              count={item.count}
              icon={item.icon}
              hiddenMoreButton={!item.hidden}
              iconColor={item.iconColor}
              process={item.process}
              trendDirection={item.trendDirection}
              trendColor={item.trendColor}
              pillColor={item.pillColor}
            />
          )}
        </Box>
      ))}
    </Box>
  )
}
