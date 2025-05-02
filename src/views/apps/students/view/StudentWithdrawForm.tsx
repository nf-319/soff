import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useTranslation } from 'react-i18next'
import { Box, Card, Typography } from '@mui/material'
import { useAppSelector } from 'src/store'
import usePayment from 'src/hooks/usePayment'
import { BanknoteIcon, Calendar, User } from 'lucide-react'

type Props = {
  openEdit: any
  setOpenEdit: any
}

export default function StudentWithDrawForm({ openEdit, setOpenEdit }: Props) {
  const { t } = useTranslation()
  const { payments } = useAppSelector(state => state.students)
  const { getPaymentMethod } = usePayment()
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const handleEditClose = () => {
    setOpenEdit(null)
    setSelectedPayment(null)
  }

  useEffect(() => {
    if (openEdit === 'withdraw') {
      getPaymentMethod()
    }
  }, [openEdit])

  return (
    <div>
      <Dialog
        open={openEdit === 'withdraw'}
        onClose={handleEditClose}
        aria-labelledby='user-view-edit'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
        aria-describedby='user-view-edit-description'
      >
        <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
          {t("O'quvchi to'lovlari")}
        </DialogTitle>
        <DialogContent>
          {payments?.map((item: any, index) => (
            <Card
              onClick={() => setSelectedPayment(item)}
              key={index}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 1,
                boxShadow: 'none',
                border: '1px solid #e0e0e0',
                transition: '0.3s',
                '&:hover': {
                  borderColor: '#1976d2',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
                  cursor: 'pointer'
                }
              }}
            >
              {/* <Box display='flex' alignItems='center' gap={2} mb={2}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <User size={24} />
                </Box>
                <Typography fontWeight={600} fontSize={18}>
                  {item?.student_name}
                </Typography>
              </Box> */}

              <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                <Box display='flex' alignItems='center' gap={1}>
                  <BanknoteIcon size={18} />
                  <Typography variant='body2' color='text.secondary'>
                    To'lov miqdori
                  </Typography>
                </Box>
                <Typography fontWeight={600} color={item?.amount >= 0 ? 'green' : 'red'}>
                  {item?.amount} so'm
                </Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
                <Box display='flex' alignItems='center' gap={1}>
                  <Calendar size={16} />
                  <Typography variant='body2' color='text.secondary'>
                    To'lov sanasi
                  </Typography>
                </Box>
                <Typography fontWeight={500}>{item?.payment_date}</Typography>
              </Box>

              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box display='flex' alignItems='center' gap={1}>
                  <User size={18} />
                  <Typography variant='body2' color='text.secondary'>
                    Admin
                  </Typography>
                </Box>
                <Typography fontWeight={500}>{item?.admin}</Typography>
              </Box>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} fullWidth variant='contained'>
            Yopish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
