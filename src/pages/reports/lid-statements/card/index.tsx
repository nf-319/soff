import { Box, Skeleton } from '@mui/material'
import { ArrowRightLeft, Megaphone, TriangleAlert, User, LucideIcon } from 'lucide-react'
import { useGetReportLeads } from '@/shared/query-hooks/report-leads/reportLeads'
import { useState } from 'react'
import LeadsDashboardCardModal from '@/components/leads-detail-chart'
import ReportLeadsSourceModal from '@/components/leads-detail-chart/source-modal'
import SellerDetailModal from '@/components/seller-detail-modal'
import useResponsive from '@/@core/hooks/useResponsive'
import { TrendCard } from '@components/TrendCard'
import { useRouter } from 'next/router'

type DashboardCard = {
  title: string
  id?: string | number
  count: string | number
  icon: LucideIcon
  iconColor?: string
  process?: string | number
  trendDirection?: 'up' | 'down'
  trendColor?: string
  pillColor?: string
}

const LidsReportsCard = () => {
  const router = useRouter()
  const { branch } = router.query
  const branchParam = branch && branch !== "undefined" ? String(branch) : undefined
  const { data, isLoading } = useGetReportLeads(branchParam)
  const [modalContent, setModalContent] = useState<string | null>(null)
  const [sourceModal, setSourceModal] = useState<boolean>(false)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const [sellerId, setSellerId] = useState<number | null>(null)
  const { isMobile } = useResponsive()

  const getProcess = (process?: number): 'up' | 'down' => {
    const results = (process || 0) > 0
    return results ? 'up' : 'down'
  }

  const getFillColor = (process?: number): string => {
    const results = (process || 0) > 0
    return results ? '#29bf12' : '#ef233c'
  }

  const handleOpenModal = (content?: string | number) => {
    if (typeof content == 'number') {
      setSellerId(content)
      setSelectedSeller(data?.best_seller)
    }
    if (content == 'source') {
      setSourceModal(true)
    } else {
      if (content) {
        setModalContent(String(content))
      }
    }
  }

  const cards: DashboardCard[] = [
    {
      id: 'new',
      icon: User,
      title: 'Yangi lidlar',
      process: data?.new_leads_progress || 0,
      count: data?.new_leads || 0,
      trendDirection: getProcess(data?.new_leads_progress),
      trendColor: '#fff',
      pillColor: getFillColor(data?.new_leads_progress),
      iconColor: 'black'
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
      id: 'rejected',
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
      id: 'source',
      icon: Megaphone,
      title: 'Eng yaxshi marketing manbasi',
      process: data?.top_lead_source_progress || 0,
      count: `${data?.top_lead_source} : ${data?.top_lead_source_count}` || 0,
      trendDirection: getProcess(data?.top_lead_source_progress),
      trendColor: '#fff',
      pillColor: getFillColor(data?.top_lead_source_progress),
      iconColor: '#ffc300'
    },
    {
      id: data?.best_seller.id,
      icon: User,
      title: `Eng yaxshi sotuvchi ${data?.best_seller.first_name}`,
      process: data?.best_seller_progress || 0,
      count: data?.best_seller_leads_count || 0,
      trendColor: '#fff',
      trendDirection: getProcess(data?.best_seller_leads_count),
      pillColor: getFillColor(data?.best_seller_progress),
      iconColor: '#ffc300'
    }
  ]

  return (
    <Box
      display="flex"
      flexDirection={{ md: 'row', xs: 'column' }}
      justifyContent="space-between"
      sx={{ width: '100%', gap: 2 }}
    >
      {isLoading ? (
        !isMobile ? (
          <Box display={'flex'} justifyContent={'space-between'} gap={4} sx={{ width: '100%' }}>
            <Skeleton width={'100%'} height={200} variant="rounded" />
            <Skeleton width={'100%'} height={200} variant="rounded" />
            <Skeleton width={'100%'} height={200} variant="rounded" />
            <Skeleton width={'100%'} height={200} variant="rounded" />
            <Skeleton width={'100%'} height={200} variant="rounded" />
          </Box>
        ) : (
          <Skeleton width={'100%'} height={250} variant="rounded" />
        )
      ) : (
        cards.map((item, index) => (
          <Box key={index} flex="1 1 calc(20% - 16px)" minWidth={150}>
            <TrendCard
              title={item.title}
              id={item.id}
              count={item.count}
              icon={item.icon}
              iconColor={item.iconColor}
              process={item.process}
              trendDirection={item.trendDirection}
              trendColor={item.trendColor}
              pillColor={item.pillColor}
              onClick={() => handleOpenModal(item.id)}
            />
          </Box>
        ))
      )}
      <LeadsDashboardCardModal setOpen={setModalContent} id={modalContent} />
      <ReportLeadsSourceModal open={sourceModal} setOpen={setSourceModal} />
      <SellerDetailModal selectedSeller={selectedSeller} sellerId={sellerId} setSellerId={setSellerId} />
    </Box>
  )
}

export default LidsReportsCard
