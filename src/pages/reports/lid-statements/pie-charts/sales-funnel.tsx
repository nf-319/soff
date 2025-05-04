import { Box, Card, Tooltip, Typography } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings';
import { ResponsiveFunnel } from '@nivo/funnel';
import { useGet } from '@/hooks/useApi';
import { EmptyContent } from '@/components/empty-content';
import { useRouter } from 'next/router';
import { CircleHelp } from 'lucide-react';
import { funnelsEmpty } from '@/pages/reports/lid-statements/constants'
import { ComingSoon } from '@components/ComingSoon'

const SalesFunnel = () => {
  const { settings } = useSettings();
  const router = useRouter();
  const { branch } = router.query;
  const branchParam = branch && branch !== 'undefined' ? String(branch) : undefined;

  const isDark = settings.mode === 'dark';
  const textColor = isDark ? '#ffffff' : '#333333';

  const { data, isLoading } = useGet('leads/sales-funnel/', {
    params: { branch: branchParam },
    options: { enabled: !!branchParam },
  });

  const isActive = data ? Object.values(data).some(value => (value as number) > 0) : false

  const labelMap: { [key: string]: string } = {
    all_leads: 'Barcha lidlar',
    connected_leads: "Bog'lanilganlar",
    test_period: 'Sinov muddatidagilar',
    enrolled_leads: 'Yozilganlar',
  };

  const updatedFunnelData = data
    ? Object.entries(isActive ? data : funnelsEmpty).map(([key, value]) => ({
      id: labelMap[key],
      value: Number(value),
      label: labelMap[key],
    }))
    : [];

  if (isLoading || !branchParam) {
    return <Box>Loading...</Box>;
  }

  return (
    <ComingSoon active={isActive} text='Sotuv varonkasi uchun malumot yetarli emas' brightness='0.9' size='medium'>
      <Card
        sx={{
          height: { xs: 400, sm: 500 },
          width: '100%',
          boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box display='flex' gap={3} sx={{ px: 6, py: 4 }}>
          <Typography color={'black'} fontSize={20} fontWeight={700}>
            Savdo voronkasi
          </Typography>

          <Tooltip title="Bu savdo voronkasi haqida ma'lumot">
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
              labelColor={textColor}
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
                    fill: textColor
                  }
                },
                tooltip: {
                  container: {
                    background: isDark ? '#1e1e1e' : '#ffffff',
                    color: textColor,
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

export default SalesFunnel;
