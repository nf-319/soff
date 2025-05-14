import { Box, Dialog, DialogContent, Typography } from '@mui/material'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { MenuOpenType } from '../model/type'
import { useTranslation } from 'react-i18next'
import { LoadingButton } from '@mui/lab'
import api from 'src/@core/utils/api'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: number
  leadFirstName: string
  leadPhone: string
  onClose?: boolean
}

export const LeadRecoverModal: FC<Props> = ({ open, onClose, setOpen, leadId, leadFirstName, leadPhone }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const handleUpdateLead = async (leadId: number) => {
    setLoading(true)
    await api
      .patch(`leads/anonim-user/update/${leadId}/`, {
        is_active: true
      })
      .then(res => {
        queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
        setOpen(null)
      })
      .catch(err => {
        console.log(err)
      })
    setLoading(false)
  }

  return (
    <Dialog open={open === 'recover'} onClose={() => setOpen(null)}>
      <DialogContent sx={{ minWidth: '300px', maxWidth: '350px' }}>
        <Typography sx={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
          {t('Rostdan ham lidni aktivlashtirmoqcimisz?')}
        </Typography>
        <form style={{ paddingTop: '5px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Box sx={{ justifyContent: 'space-around', display: 'flex' }}>
            <LoadingButton variant='outlined' size='small' color='error' onClick={() => setOpen(null)}>
              {t('Bekor qilish')}
            </LoadingButton>
            <LoadingButton
              loading={loading}
              onClick={() => handleUpdateLead(leadId)}
              type='submit'
              size='small'
              variant='contained'
            >
              {t('Aktiv qilish')}
            </LoadingButton>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}
