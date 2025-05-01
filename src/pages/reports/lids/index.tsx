'use client'

import { Box } from '@mui/material'
import LidsReportsFilter from './filter'
import LidsReportsCard from './card'
import SalesFunnel from './pie-charts/sales-funnel'
import YearlyTrend from './pie-charts/yearly-trend'
import CourseInterest from './pie-charts/course-interest'
import MarketingSources from './pie-charts/marketing-sources'
import { useGetLeadsSourceStatus } from '@/shared/query-hooks/report-leads/reportLeads'
import LeadsSellers from './leads-sellers'
import LeadsList from './leads-list'

const LidsReports = () => {
  const { data } = useGetLeadsSourceStatus()
  return (
    <Box sx={{ paddingY: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <LidsReportsFilter />
      <LidsReportsCard />
      <div className='row g-4'>
        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <SalesFunnel />
          </Box>
        </div>
        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <YearlyTrend />
          </Box>
        </div>
        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <CourseInterest data={data?.courses || []} />
          </Box>
        </div>
        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <MarketingSources data={data?.sources || []} />
          </Box>
        </div>
      </div>
      <LeadsSellers />
      <LeadsList />
    </Box>
  )
}

export default LidsReports
