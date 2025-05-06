import { Dialog, DialogTitle, DialogContent, Typography, Button, Box, IconButton } from '@mui/material'
import { FC } from 'react'
import Link from 'next/link'
import { CircleAlert, X } from 'lucide-react'

type Props = {
  open: boolean
  onClose?: () => void
}

export const AccessDeniedModal: FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={undefined}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          pointerEvents: 'auto',
          p: 2,
          backgroundColor: '#fefefe',
          position: 'relative'
        }
      }}
      BackdropProps={{
        sx: { pointerEvents: 'auto' },
        onClick: e => {
          e.stopPropagation()
        }
      }}
    >
      {onClose && (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'grey.500'
          }}
          aria-label='close'
        >
          <X size={22} />
        </IconButton>
      )}

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{ color: 'warning.main', display: 'flex', justifyContent: 'center' }}>
          <CircleAlert size={48} />
        </Box>

        <DialogTitle sx={{ fontWeight: 600, fontSize: 20, textAlign: 'center', p: 0 }}>
          Kirish uchun tarif talab qilinadi
        </DialogTitle>

        <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
          Ushbu SMS xizmatidan foydalanish uchun avval tarif sotib olishingiz kerak.
        </Typography>

        <Button component={Link} href='/crm-payments' variant='contained' sx={{ mt: 1 }}>
          Tarifni sotib olish
        </Button>
      </DialogContent>
    </Dialog>
  )
}
