import { Card, Tooltip, Typography, Skeleton } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings';
import { ResponsiveLine } from '@nivo/line';
import useResponsive from '@/@core/hooks/useResponsive';
import { EmptyContent } from '@/components/empty-content';
import { uzbekMonths } from '@/shared/constans';
import { useRouter } from 'next/router';
import { useGet } from '@hooks/useApi';
import { Endpoints } from '@api/endpoints';
import { ReportLeadsYearlyStats } from '@/types/report';
import { Box } from '@mui/system'
import { CircleHelp } from 'lucide-react'

const YearlyTrend = () => {
  const { settings } = useSettings();
  const router = useRouter();
  const { branch } = router.query;
  const branchParam = branch && branch !== 'undefined' ? String(branch) : undefined;

  const { data, isLoading } = useGet<ReportLeadsYearlyStats[]>(Endpoints.LeadsYearlyStats, {
    params: { branch: branchParam },
    options: { enabled: !!branchParam },
  });

  const isDark = settings.mode === 'dark';
  const textColor = isDark ? '#ffffff' : '#333333';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const { isMobile } = useResponsive();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const availableMonths = uzbekMonths.slice(0, currentMonth + 1);

  const fillMissingMonths = (dataArray: any[], valueKey: string) => {
    const monthMap = new Map(dataArray?.map((item) => [parseInt(item.month, 10), parseInt(item[valueKey], 10)]));

    return availableMonths.map((name, index) => ({
      x: name,
      y: monthMap.get(index + 1) ?? 0,
    }));
  };

  const yearlyTrendData = [
    {
      id: 'Yangi lidlar',
      color: 'hsl(240, 70%, 50%)',
      data: fillMissingMonths(data ?? [], 'new_count'),
    },
    {
      id: 'Roʻyxatdan oʻtgan',
      color: 'hsl(120, 70%, 50%)',
      data: fillMissingMonths(data ?? [], 'enrolled_count'),
    },
    {
      id: "Yo'qotilgan Lidlar",
      color: 'hsl(0, 70%, 50%)',
      data: fillMissingMonths(data ?? [], 'lost_count'),
    },
  ];

  const ChartSkeleton = () => (
    <Card
      sx={{
        width: '100%',
        height: { xs: '100%', sm: 400, md: 500 },
        p: 2
      }}
    >
      <Box display='flex' gap={3} sx={{ px: 6, py: 4 }}>
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="circular" width={24} height={24} sx={{ mt: 'auto', mb: 'auto' }} />
      </Box>

      <Box sx={{ height: 'calc(100% - 80px)', width: '100%', position: 'relative', pt: 2, px: 3 }}>
        <Box sx={{ position: 'absolute', left: 16, top: 10, bottom: 40, width: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={25} height={20} />
          <Skeleton variant="text" width={25} height={20} />
          <Skeleton variant="text" width={25} height={20} />
          <Skeleton variant="text" width={25} height={20} />
        </Box>

        <Box sx={{ position: 'absolute', left: 60, right: 20, bottom: 10, display: 'flex', justifyContent: 'space-between' }}>
          {Array(6).fill(0).map((_, index) => (
            <Skeleton key={index} variant="text" width={40} height={20} />
          ))}
        </Box>

        <Box sx={{ position: 'absolute', left: 60, right: 20, top: 10, bottom: 40 }}>
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '30%',
              height: 3,
              borderRadius: 4,
              transform: 'none',
              '&::after': {
                animation: 'none'
              }
            }}
          />

          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '60%',
              height: 3,
              borderRadius: 4,
              transform: 'none',
              '&::after': {
                animation: 'none'
              }
            }}
          />

          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '75%',
              height: 3,
              borderRadius: 4,
              transform: 'none',
              '&::after': {
                animation: 'none'
              }
            }}
          />

          {Array(6).fill(0).map((_, index) => (
            <Box key={index} sx={{ position: 'absolute', left: `${index * 20}%`, transform: 'translateX(-50%)' }}>
              <Skeleton variant="circular" width={10} height={10} sx={{ position: 'absolute', top: '30%', transform: 'translate(-50%, -50%)' }} />
              <Skeleton variant="circular" width={10} height={10} sx={{ position: 'absolute', top: '60%', transform: 'translate(-50%, -50%)' }} />
              <Skeleton variant="circular" width={10} height={10} sx={{ position: 'absolute', top: '75%', transform: 'translate(-50%, -50%)' }} />
            </Box>
          ))}
        </Box>

        <Box sx={{
          position: 'absolute',
          right: isMobile ? '50%' : 20,
          bottom: isMobile ? 10 : '50%',
          transform: isMobile ? 'translateX(50%)' : 'translateY(50%)',
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: 2
        }}>
          {Array(3).fill(0).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="circular" width={12} height={12} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );

  if (isLoading || !branchParam) {
    return <ChartSkeleton />;
  }

  return (
    <Card
      sx={{
        width: '100%',
        height: { xs: '100%', sm: 400, md: 500 },
        p: 2
      }}
    >
      <Box display='flex' gap={3} sx={{ px: 6, py: 4 }}>
        <Typography color="black" fontSize={20} fontWeight={700}>
          Yillik yetakchi trendi
        </Typography>

        <Tooltip title="Bu yillik savdo haqida ma'lumot">
          <CircleHelp style={{ cursor: 'pointer', color: '#9e9e9e', marginTop: 'auto', marginBottom: 'auto' }} />
        </Tooltip>
      </Box>

      {!yearlyTrendData[0].data.length ? (
        <EmptyContent />
      ) : (
        <ResponsiveLine
          data={yearlyTrendData}
          margin={{ top: 20, right: isMobile ? 50 : 140, bottom: isMobile ? 110 : 90, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 0,
            max: 'auto',
            stacked: false,
            reverse: false,
            clamp: true
          }}
          yFormat=' >-.0f'
          curve='monotoneX'
          axisTop={null}
          enableArea={false}
          areaBaselineValue={0}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: 36,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0
          }}
          enableGridX={false}
          colors={{ scheme: 'category10' }}
          lineWidth={3}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableSlices='x'
          crosshairType='cross'
          useMesh={true}
          legends={[
            {
              anchor: isMobile ? 'bottom' : 'bottom-right',
              direction: isMobile ? 'row' : 'column',
              translateX: isMobile ? 0 : 100,
              translateY: isMobile ? 50 : 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          motionConfig='stiff'
          theme={{
            axis: {
              domain: {
                line: {
                  stroke: textColor,
                  strokeWidth: 1
                }
              },
              ticks: {
                line: {
                  stroke: textColor,
                  strokeWidth: 1
                },
                text: {
                  fill: textColor
                }
              },
              legend: {
                text: {
                  fill: textColor,
                  fontSize: 12
                }
              }
            },
            grid: {
              line: {
                stroke: gridColor,
                strokeWidth: 1
              }
            },
            legends: {
              text: {
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
            },
            crosshair: {
              line: {
                stroke: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                strokeOpacity: 0.75
              }
            }
          }}
        />
      )}
    </Card>
  )
};

export default YearlyTrend;
