import { Box, Skeleton, Typography } from '@mui/material'
import { Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyContent } from '../../../components/empty-content'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useSettings } from 'src/@core/hooks/useSettings'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { useAppSelector } from 'src/store'
import { PieChart } from '@components/PieChart'
import { colorSchemes } from '@nivo/colors'

export default function StatsPaymentMethods() {
  const { all_numbers, numbersLoad: loading } = useAppSelector(state => state.finance)
  const { isMobile } = useResponsive()
  const { settings } = useSettings()
  const { t } = useTranslation()
  const total = all_numbers?.payment_types.reduce((acc, curr) => acc + curr.amount, 0) || 0
  const ONE_HUNDRED = 100
  const chartData = all_numbers?.payment_types.map((el, index) => {
    const percentage = total === 0 ? 0 : (el.amount / total) * ONE_HUNDRED;
    return {
      id: el.name,
      label: el.name,
      value: `${+percentage.toFixed(2)}`,
      color: colorSchemes.nivo[index % colorSchemes.nivo.length],
      amount: el.amount
    };
  });

  return (
    <div>
      <div id='chart-circle'>
        {loading ? (
          <Box sx={{ p: '5px' }}>
            <Skeleton variant='text' width={isMobile ? '100%' : 200} height={30} />
            <Box sx={{ display: 'flex', padding: '8px 25px', gap: '30px' }}>
              <Skeleton variant='circular' width={200} height={200} />
              <Box>
                <Skeleton variant='text' width={120} height={30} />
                <Skeleton variant='text' width={120} height={30} />
                <Skeleton variant='text' width={120} height={30} />
              </Box>
            </Box>
          </Box>
        ) : chartData ? (
          <Box sx={{
            width: '100%', height: '100%', zIndex: '100', bgcolor: '#fff', border: '1px solid #e0e0e0e0;', padding: '16px', borderRadius: '10px'
          }}>
            <h5>To'lov turlari bo'yicha taqsimot
            </h5>
            <p>To'lov usullari bo'yicha tushumlar
            </p>
            <Box>
              <Box sx={{ flexGrow: 1, height: '300px' }}>
                <PieChart
                  margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
                  data={chartData}
                  legend={[]}
                />

              </Box>

              <Box sx={{ marginTop: 5, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
                {chartData.map(item => (
                  <Box key={item.id} sx={{ width: '100%' }}>
                    {settings.mode === 'light' ? (
                      <div style={{ border: '1px solid #e0e0e0e0', padding: '10px', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className=''>

                          <div className='d-flex justify-content-between align-item-center w-100'>
                            <div className='fw-medium small text-capitalize d-flex gap-2 align-items-center'>
                              <div className='d-flex align-items-center justify-content-center rounded-circle' style={{ width: '0.8rem', height: '0.8rem', backgroundColor: `${item?.color}`}}>
                              </div>
                              {item?.label} : </div>
                            <div className='text-muted small'>{item?.value}%</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px' }}>
                          {formatCurrency(item?.amount) + " so'm"}
                        </div>
                      </div>
                    ) : (
                      <div className='d-flex align-items-center justify-content-between p-2 bg-dark bg-opacity-50 rounded px-3'>
                        <div className='d-flex align-items-center gap-2'>
                          <div
                            className='d-flex align-items-center justify-content-center rounded-circle bg-success'
                            style={{ width: '1.5rem', height: '1.5rem' }}
                          >
                            <Wallet className='text-white' style={{ width: '0.75rem', height: '0.75rem' }} />
                          </div>
                          <div>
                            <Typography fontSize={15}>{item?.label}</Typography>
                            <div className='small text-light'>
                              <Typography fontSize={12}>{item?.amount + " to'lov" || "1 to'lov"}</Typography>
                            </div>
                          </div>
                        </div>
                        <div className='text-end fw-medium text-light small'>
                          {formatCurrency(item?.amount) + " so'm"}
                        </div>
                      </div>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <EmptyContent title="To'lovlar mavjud emas" />
        )
        }
      </div >
    </div >
  )
}
