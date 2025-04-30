import { Box, Card, Dialog, DialogContent, DialogTitle, Skeleton, Typography } from '@mui/material'
import { ArrowRightLeft, Clock, Megaphone, TrendingDown, TrendingUp, TriangleAlert, User } from 'lucide-react'
import { useGetReportLeads } from '@/shared/query-hooks/report-leads/reportLeads'
import { useState } from 'react'
import LeadsDashboardCardModal from '@/components/leads-detail-chart'
import ReportLeadsSourceModal from '@/components/leads-detail-chart/source-modal'
import SellerDetailModal from '@/components/seller-detail-modal'
import { number } from 'yup'
import useResponsive from '@/@core/hooks/useResponsive'

type DashboardCard = {
  title: string
  id?: string | number
  count: string | number
  icon: any
  iconColor?: string
  process?: string | number
  trendDirection?: 'up' | 'down'
  trendColor?: string
  pillColor?: string
}

const LidsReportsCard = () => {
  const { data, isLoading } = useGetReportLeads()
  const [modalContent, setModalContent] = useState<string | null>(null)
  const [sourceModal, setSourceModal] = useState<boolean>(false)
  const [selectedSeller, setSellectedSeller] = useState<any>(null)
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
      setSellectedSeller({ first_name: data?.best_seller })
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
      id: data?.best_seller_id,
      icon: User,
      title: `Eng yaxshi sotuvchi ${data?.best_seller}`,
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
      display='flex'
      flexDirection={{ md: 'row', xs: 'column' }}
      justifyContent='space-between'
      sx={{ width: '100%', gap: 2 }}
    >
      {isLoading ? (
        !isMobile ? (
          <Box display={'flex'} justifyContent={'space-between'} gap={4} sx={{width:'100%'}}>
            <Skeleton width={'100%'} height={200} variant='rounded' />
            <Skeleton width={'100%'} height={200} variant='rounded' />
            <Skeleton width={'100%'} height={200} variant='rounded' />
            <Skeleton width={'100%'} height={200} variant='rounded' />
            <Skeleton width={'100%'} height={200} variant='rounded' />

          </Box>
        ) : (
          <Skeleton width={'100%'} height={250} variant='rounded' />
        )
      ) : (
        cards.map((item, index) => {
          const Icon = item.icon
          const TrendIcon = item.trendDirection === 'up' ? TrendingUp : TrendingDown

          return (
            <Box key={index} flex='1 1 calc(20% - 16px)' minWidth={150}>
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
                    {item.process !== null && (
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
                  <Typography
                    sx={{
                      fontSize: 15,
                      cursor: 'pointer',
                      transition: '0.3s',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {item.title}
                  </Typography>{' '}
                  <div onClick={() => handleOpenModal(item?.id)}>
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
                      Detailni ko'rish
                    </Typography>{' '}
                  </div>
                </Box>
              </Card>
            </Box>
          )
        })
      )}
      <LeadsDashboardCardModal setOpen={setModalContent} id={modalContent} />
      <ReportLeadsSourceModal open={sourceModal} setOpen={setSourceModal} />
      <SellerDetailModal selectedSeller={selectedSeller} sellerId={sellerId} setSellerId={setSellerId} />
    </Box>
  )
}

export default LidsReportsCard
