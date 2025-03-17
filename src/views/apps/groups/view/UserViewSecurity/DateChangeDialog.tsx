"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

interface DateChangeDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedOldDate: any
  selectedNewDate: any
  setSelectedOldDate: (date: any) => void
  setSelectedNewDate: (date: any) => void
  changeDateLoader: boolean
  handleDateChange: () => void
}

export const DateChangeDialog = ({
  open,
  setOpen,
  selectedOldDate,
  selectedNewDate,
  setSelectedOldDate,
  setSelectedNewDate,
  changeDateLoader,
  handleDateChange
}: DateChangeDialogProps) => {

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        style: {
          borderRadius: '8px',
          backgroundColor: '#fff'
        }
      }}
    >
      <DialogTitle style={{ color: '#000' }}>
        <Typography style={{ color: '#000', fontWeight: 600 }}>Kunni tanlang</Typography>
      </DialogTitle>
      <DialogContent style={{ minWidth: '300px', backgroundColor: '#fff' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                backgroundColor: '#fff'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23)'
              }
            }}
            value={selectedNewDate ? new Date(selectedNewDate) : selectedOldDate ? new Date(selectedOldDate) : null}
            onChange={(day: any) => setSelectedNewDate(day)}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions style={{ backgroundColor: '#fff', padding: '16px' }}>
        <Button
          variant='outlined'
          color='error'
          onClick={() => {
            setOpen(false)
            setSelectedOldDate(null)
            setSelectedNewDate(null)
          }}
        >
          Bekor qilish
        </Button>
        <Button disabled={changeDateLoader} variant='contained' onClick={handleDateChange}>
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  )
}

