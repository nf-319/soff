import { useSettings } from '@/@core/hooks/useSettings'
import { useGetLeadsSellerDetail } from '@/shared/query-hooks/report-leads/reportLeads'
import { ReposrtLeadsSellers } from '@/types/report'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'
import { UserIcon, X } from 'lucide-react'

const SellerDetailModal = ({
  sellerId,
  setSellerId,
  selectedSeller
}: {
  sellerId: number | null
  setSellerId: (status: any) => void
  selectedSeller: ReposrtLeadsSellers | null
}) => {
  const { data: sellerDetailCourse } = useGetLeadsSellerDetail({ id: String(sellerId) })
  const { settings } = useSettings()
  const isDark = settings.mode == 'dark'
  const textColor = isDark ? '#ffffff' : '#333333'
  const courseInterestData = sellerDetailCourse?.map(item => ({
    id: item.name,
    label: item.name,
    value: item.count
  }))

  return (
    <Dialog fullWidth onClose={() => setSellerId(null)} open={!!sellerId}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>Sotuvchi detaili</Typography>
        <IconButton onClick={() => setSellerId(null)}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} alignItems={'center'} gap={3}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UserIcon />
          </div>
          <Typography>{selectedSeller?.first_name}</Typography>
        </Box>
        <Box>
          <div>
            <ResponsivePie
              data={courseInterestData || []}
              margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]]
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={textColor}
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 2]]
              }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 40,
                  itemsSpacing: 0,
                  itemWidth: 80,
                  itemHeight: 18,
                  itemTextColor: textColor,
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 14,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#3f51b5'
                      }
                    }
                  ]
                }
              ]}
              theme={{
                tooltip: {
                  container: {
                    background: isDark ? '#1e1e1e' : '#ffffff',
                    color: textColor
                  }
                }
              }}
            />
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SellerDetailModal
