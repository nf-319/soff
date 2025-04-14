import { useAppDispatch, useAppSelector } from '@/store'
import { setOpenDebtorsModal } from '@/store/apps/groupDetails'
import {
  Box,
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  TextField,
  Typography
} from '@mui/material'
import { Edit2, Save, User, X } from 'lucide-react'
import { useState } from 'react'

export default function DebtorsModal() {
  const dispatch = useAppDispatch()
  const { openDebtorsModal } = useAppSelector(state => state.groupDetails)
  const [isEditing, setIsEditing] = useState(false)
  const [amount, setAmount] = useState('300 000')
  const [date] = useState('12/04/2024') 

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <Dialog
      onClose={() => dispatch(setOpenDebtorsModal(false))}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
      aria-describedby='user-view-edit-description'
      open={false}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>Qarzdorlar</Typography>
        <IconButton onClick={() => dispatch(setOpenDebtorsModal(false))}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'end' }}>
            <User color='#00a6fb' />
            <Typography fontSize={15}>Otabek Ibrohimov</Typography>
          </div>
          <div>
            <Chip variant='filled' color='error' label={"Balansi  -133 so'm"} />
          </div>
        </div>
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 3,
            p: 2,
            borderRadius: 1,
            boxShadow: 3,
            backgroundColor: '#f9fafb'
          }}
        >
          {/* Qarzdorlik sanasi */}
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography fontSize={14} fontWeight={500} color='text.secondary'>
              Qarzdorlik sanasi
            </Typography>
            <Typography fontSize={14}>{date}</Typography>
          </Box>

          {/* Qarzdorlik summasi */}
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography fontSize={14} fontWeight={500} color='text.secondary'>
              Qarzdorlik summasi
            </Typography>
            {isEditing ? (
              <TextField
                size='small'
                variant='outlined'
                value={amount}
                onChange={e => setAmount(e.target.value)}
                sx={{ width: 120 }}
              />
            ) : (
              <Typography fontSize={14} color='error.main'>
                {amount} so'm
              </Typography>
            )}
          </Box>

          {/* Tahrirlash tugmasi */}
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography fontSize={14} fontWeight={500} color='text.secondary'>
              {isEditing ? 'Saqlash' : 'Tahrirlash'}
            </Typography>
            <IconButton size='small' onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
              {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
            </IconButton>
          </Box>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
