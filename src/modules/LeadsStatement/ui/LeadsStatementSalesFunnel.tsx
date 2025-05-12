import { Box, Card, Tooltip, Typography, Skeleton } from '@mui/material'
import { ResponsiveFunnel } from '@nivo/funnel';
import { useGet } from '@hooks/useApi';
import { EmptyContent } from '@components/empty-content';
import { useRouter } from 'next/router';
import { CircleHelp } from 'lucide-react';
import { funnelsEmpty } from '@/shared/constans'
import { ComingSoon } from '@components/ComingSoon'
import { LEADS_SELLES_FUNNEL_MAP } from '../config/constants'
import { LeadsStatementFunnelSkeleton } from './LeadsStatementFunnelSkeleton'

export const LeadsStatementSalesFunnel = () => {
  const router = useRouter();
  const { branch } = router.query;
  const branchParam = branch && branch !== 'undefined' ? String(branch) : undefined;

  const { data, isLoading } = useGet('leads/sales-funnel/', {
    params: { branch: branchParam },
    options: { enabled: !!branchParam },
    deps:['leads/sales-funnel']
  });

  const isActive = data ? Object.values(data).some(value => (value as number) > 0) : false

  const updatedFunnelData = data
    ? Object.entries(isActive ? data : funnelsEmpty).map(([key, value]) => ({
      id: LEADS_SELLES_FUNNEL_MAP[key],
      value: Number(value),
      label: LEADS_SELLES_FUNNEL_MAP[key],
    }))
    : [];

  if (isLoading || !branchParam) {
    return <LeadsStatementFunnelSkeleton />;
  }

  return (
    <ComingSoon active={isActive} text='Sotuv varonkasi uchun malumot yetarli emas' brightness='0.9' size='medium' sx={{ height: '100%' }}>
      <Card
        sx={{
          height: { xs: '100%', sm: 500 },
          width: '100%',
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box display='flex' gap={3} sx={{ px: 6, py: 4 }}>
          <Typography color={'black'} fontSize={20} fontWeight={700}>
            Sotuv voronkasi
          </Typography>

          <Tooltip title="Bu Sotuv voronkasi haqida ma'lumot">
            <CircleHelp style={{ cursor: 'pointer', color: '#9e9e9e', marginTop: 'auto', marginBottom: 'auto' }} />
          </Tooltip>
        </Box>

        {!updatedFunnelData?.length ? (
          <EmptyContent />
        ) : (
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <ResponsiveFunnel
              data={updatedFunnelData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              valueFormat='>-.0f'
              colors={{ scheme: 'nivo' }}
              borderWidth={20}
              labelColor='#333333'
              beforeSeparatorLength={100}
              beforeSeparatorOffset={20}
              afterSeparatorLength={100}
              afterSeparatorOffset={20}
              currentPartSizeExtension={10}
              currentBorderWidth={40}
              motionConfig='gentle'
              shapeBlending={0.6}
              enableLabel={true}
              theme={{
                labels: {
                  text: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    fill: '#333333'
                  }
                },
                tooltip: {
                  container: {
                    background: '#ffffff',
                    color: '#333333',
                    fontSize: 12,
                    borderRadius: 4,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }
                }
              }}
              animate={true}
            />
          </Box>
        )}
      </Card>
    </ComingSoon>
  )
};

LeadsStatementSalesFunnel.displayName = 'LeadsStatementSalesFunnel'
