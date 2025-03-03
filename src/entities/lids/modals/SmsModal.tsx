import { Dispatch, FC, SetStateAction } from 'react'
import { MenuOpenType } from '../LeadsKaban'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import SendSmsAnonimUserForm from 'src/views/apps/lids/anonimUser/SendSmsAnonimUserForm'
import { useGet } from 'src/hooks/useApi'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string | null
  onClose?: () => void
}

export const SmsModal: FC<Props> = ({ open, setOpen, leadId }) => {
  const { t } = useTranslation()
  const { data, isLoading } = useGet('common/sms-form/list/')

  return (
    <Dialog open={open === 'sms'} onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>{t('SMS yuborish')}</Typography>

        <IconButton onClick={() => setOpen(null)}>
          <IconifyIcon icon={'material-symbols:close'} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minWidth: '300px' }}>
        <SendSmsAnonimUserForm
          smsLoading={isLoading}
          smsTemps={data}
          user={leadId}
          closeModal={() =>  setOpen(null)}
        />
      </DialogContent>
    </Dialog>
  )
}

SmsModal.displayName = 'SmsModal'
