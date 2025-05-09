'use client';

import { Box } from '@mui/material';
import { LeadsStatementHeader } from './ui/LeadsStatementHeader';
import { LeadsStatementCard } from './ui/LeadsStatementCard';
import { LeadsStatementSalesFunnel } from './ui/LeadsStatementSalesFunnel';
import { LeadsStatementYearlyTrend } from './ui/LeadsStatementYearlyTrend';
import { LeadsStatementCourseInterest } from './ui/LeadsStatementCourseInterest';
import { LeadsStatementsMarketingSources } from './ui/LeadsStatementsMarketingSources';
import { LeadsStatementsSellers } from './ui/LeadsStatementsSellers';
import { LeadsStatementLeadsList } from './ui/LeadsStatementLeadsList';
import { useRouter } from 'next/router';
import { useGet } from '@hooks/useApi';
import { Endpoints } from '@api/endpoints';

export const LeadsStatement = () => {
  const router = useRouter();
  const { branch } = router.query;

  const branchParam = branch && branch !== 'undefined' ? String(branch) : undefined;

  const { data } = useGet(Endpoints.LeadsSourceStats, {
    params: { branch: branchParam },
    options: { enabled: !!branchParam },
  });

  return (
    <Box sx={{ paddingY: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <LeadsStatementHeader />

      <LeadsStatementCard />

      <div className='row g-4'>
        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <LeadsStatementSalesFunnel />
          </Box>
        </div>

        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <LeadsStatementYearlyTrend />
          </Box>
        </div>

        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <LeadsStatementCourseInterest data={data?.courses || []} sx={{ height: '100%' }} />
          </Box>
        </div>

        <div className='col-12 col-md-6'>
          <Box sx={{ height: { xs: 450, sm: 500 } }}>
            <LeadsStatementsMarketingSources data={data?.sources || []} />
          </Box>
        </div>
      </div>

      <LeadsStatementsSellers />

      <LeadsStatementLeadsList />
    </Box>
  )
};

LeadsStatement.displayName = 'LeadsStatement'
