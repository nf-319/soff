'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import Icon from '../../../../components/icon'
import { useTranslation } from 'react-i18next'
import LoadingButton from '@mui/lab/LoadingButton'
import { OctagonAlert } from 'lucide-react'

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  handleOk?: () => any
  okText?: string | undefined
  loading?: boolean
}

const UserSuspendDialog = ({ open, setOpen, handleOk, okText, loading }: Props) => {
  const { t } = useTranslation()

  const [userInput, setUserInput] = useState<string>('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
    setSecondDialogOpen(false)
  }

  const handleSecondDialogClose = () => {
    setSecondDialogOpen(false)
  }

  const handleConfirmation = async (value: string) => {
    setUserInput(value)
    if (value === 'yes') {
      await handleOk?.()
      setOpen(false)
    }
  }

  const handleConfirmation2 = async (value: string) => {
    setUserInput(value)

    if (value === 'cancel') {
      setOpen(false)
      setSecondDialogOpen(true)
    }
  }

  const handleModalClose = () => {
    setSecondDialogOpen(false)
  }

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box
              sx={{
                mb: 4,
                maxWidth: '85%',
                textAlign: 'center',
                gap: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <OctagonAlert size={65} color='#E5B700' />

              <Typography variant='h4' sx={{ color: 'text.secondary' }}>
                Ishonchingiz komilmi?
              </Typography>
            </Box>
            <Typography>Siz bu jarayonni ortqa qaytara olmaysiz!</Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            loading={loading}
            variant='contained'
            style={{ marginTop: '30px' }}
            color='error'
            onClick={() => handleConfirmation('yes')}
          >
            {okText ? okText : t("O'chirish")}
          </LoadingButton>

          <Button
            variant='outlined'
            style={{ marginTop: '30px' }}
            color='secondary'
            onClick={() => handleConfirmation2('cancel')}
          >
            {t('Bekor qilish')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon
              fontSize='5.5rem'
              icon={userInput === 'yes' ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline'}
            />
            <Typography variant='h4' sx={{ mb: 6 }}>
              {userInput === 'yes' ? t('Muvaffaqiyatli!') : t('Bekor qilindi')}
            </Typography>
            <Typography>
              {userInput === 'yes' ? t(`Muvaffaqiyatli o'chirilidi!`) : t("O'chirish  bekor qilindi")}
            </Typography>
            <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
              <Button variant='contained' onClick={handleModalClose}>
                {t('Yaxshi')}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserSuspendDialog
