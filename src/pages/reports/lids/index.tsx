'use client'

import { Box } from '@mui/material'
import LidsReportsFilter from './filter'
import LidsReportsCard from './card'
import SalesFunnel from './pie-charts/sales-funnel'
import YearlyTrend from './pie-charts/yearly-trend'
import CourseInterest from './pie-charts/course-interest'
import MarketingSources from './pie-charts/marketing-sources'

const LidsReports = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <LidsReportsFilter />

      <LidsReportsCard />
      <div className='row g-4'>
        <div className='col-12 col-md-6'>
          <SalesFunnel />
        </div>
        <div className='col-12 col-md-6'>
          <YearlyTrend />
        </div>
        <div className='col-12 col-md-6'>
          <CourseInterest />
        </div>
        <div className='col-12 col-md-6'>
          <MarketingSources />
        </div>
      </div>
    </Box>
  )
}

export default LidsReports
