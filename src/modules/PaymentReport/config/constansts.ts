import { getTrendDirection } from '@/shared/utils'
import { TrendCardProps } from '@components/TrendCard'
import { Clock, CreditCard, DollarSign, Gift, Percent, RefreshCcw } from 'lucide-react'

export const statsCards: TrendCardProps[] = [
  {
    icon: CreditCard,
    count: '12,450,000',
    process: 12.5,
    trendDirection: getTrendDirection(12.5),
    title: "Jami to'lov summasi",
    tooltip: "Barcha filiallar bo'yicha jami to'lovlar summasi",
    hiddenMoreButton: false
  },
  {
    icon: Percent,
    count: '85.2%',
    process: 12.5,
    trendDirection: getTrendDirection(12.5),
    title: "Vaqtida to'lovlar statistikasi",
    tooltip: "Barcha filiallar bo'yicha jami to'lovlar summasi",
    hiddenMoreButton: false
  },
  {
    icon: Clock,
    count: '14.8%',
    process: -3.8,
    trendDirection: getTrendDirection(-3.8),
    title: "Kechikkan to'lovlar statistikasi",
    tooltip: "Barcha filiallar bo'yicha jami to'lovlar summasi",
    hiddenMoreButton: false
  },
  {
    icon: DollarSign,
    count: '2,350,000',
    process: -8.5,
    trendDirection: getTrendDirection(-8.5),
    title: "Jami to'lov summasi",
    tooltip: "Barcha filiallar bo'yicha jami to'lovlar summasi",
    hiddenMoreButton: false
  },
  {
    icon: Gift,
    count: '12,450,000',
    process: 12.5,
    trendDirection: getTrendDirection(12.5),
    title: "Jami to'lov summasi",
    tooltip: "Barcha filiallar bo'yicha jami to'lovlar summasi",
    hiddenMoreButton: false
  },
  {
    icon: RefreshCcw,
    count: '12,450,000',
    process: 12.5,
    trendDirection: getTrendDirection(12.5),
    title: "Jami to'lov summasi",
    tooltip: "Barcha filiallar bo'yicha jami to'lovlar summasi",
    hiddenMoreButton: false
  }
]

 export const yearlyTrendData = [
    {
      id: 'Income',
      color: 'hsl(205, 70%, 50%)',
      data: [
        { x: 'January', y: 4000 },
        { x: 'February', y: 4200 },
        { x: 'March', y: 3900 },
        { x: 'April', y: 5000 },
        { x: 'May', y: 4800 },
        { x: 'June', y: 5300 },
        { x: 'July', y: 5500 },
        { x: 'August', y: 5800 },
        { x: 'September', y: 6000 },
        { x: 'October', y: 6200 },
        { x: 'November', y: 6400 },
        { x: 'December', y: 7000 }
      ]
    },
    {
      id: 'Expense',
      color: 'hsl(10, 70%, 50%)',
      data: [
        { x: 'January', y: 3000 },
        { x: 'February', y: 3200 },
        { x: 'March', y: 2800 },
        { x: 'April', y: 3500 },
        { x: 'May', y: 3600 },
        { x: 'June', y: 3700 },
        { x: 'July', y: 3900 },
        { x: 'August', y: 4100 },
        { x: 'September', y: 4300 },
        { x: 'October', y: 4500 },
        { x: 'November', y: 4700 },
        { x: 'December', y: 5000 }
      ]
    }
  ]