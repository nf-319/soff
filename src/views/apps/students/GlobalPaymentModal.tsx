import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setGlobalPay } from 'src/store/apps/students'
import GlobalPaymentForm from './GlobalPaymentForm'
import { disablePage } from 'src/store/apps/page'

export default function GlobalPaymentModal() {
  const { global_pay } = useAppSelector(state => state.students)

  const dispatch = useAppDispatch()

  function closeModal() {
    dispatch(setGlobalPay(false))
    dispatch(disablePage(false))
  }

  return (
    <Dialog open={global_pay} onClose={closeModal}>
      <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>O'quvchi uchun to'lov</DialogTitle>

      <DialogContent>
        <GlobalPaymentForm />
      </DialogContent>
    </Dialog>
  )
}
