import { useGet } from '@/hooks/useApi'
import { Box, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import { EmptyContent } from '../empty-content'
import { ResponsiveBar } from '@nivo/bar'
import { useSettings } from '@/@core/hooks/useSettings'
import { ResponsivePie } from '@nivo/pie'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CourseInterest from '@/pages/reports/lid-statements/pie-charts/course-interest'
import { truncateLabel } from '@/shared/utils'
import { useRouter } from 'next/router'

const ReportLeadsSourceModal = ({ open, setOpen }: { open: boolean; setOpen: (status: boolean) => void }) => {
  const router = useRouter()
  const { branch } = router.query

  const { data } = useGet('leads/source-stats/all/', { params: { branch: String(branch) }, options: { enabled: open } })

  return (
    <Box>
      <Dialog onClose={() => setOpen(false)} maxWidth='md' fullWidth open={open}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h5'>Marketing Statistikasi</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box flexDirection='column' sx={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: '200px' }}>
            <Card sx={{ p: 4, width: '100%', border: '1px solid #e0e0e0e0', boxShadow: 'none' }}>
              <Typography variant='h5' pb={3}>
                Manba ma'lumotlari
              </Typography>
              <Grid container spacing={3}>
                {!data?.sources?.length ? (
                  <EmptyContent title="Manba ma'lumotlari yo'q" />
                ) : (
                  data?.sources?.map((item: any, index: number) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          boxShadow: 'none',
                          backgroundColor: '#f9f9f9',
                          borderRadius: 1,
                          border: '1px solid lightgray'
                        }}
                      >
                        <CardContent>
                          <Typography sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>{item?.name}</Typography>
                          <Typography sx={{ mb: 0.5 }}>
                            Umumiy lidlar:{' '}
                            <Typography component='span' sx={{ fontWeight: 600, color: '#1976d2' }}>
                              {item?.total_count}
                            </Typography>
                          </Typography>
                          <Typography>
                            Konversatsiya:{' '}
                            <Typography component='span' sx={{ fontWeight: 600, color: '#1976d2' }}>
                              {item?.conversion_rate}
                            </Typography>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </Card>
            <CourseInterest isCard data={data?.courses || []} sx={{ height: 500 }} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default ReportLeadsSourceModal
