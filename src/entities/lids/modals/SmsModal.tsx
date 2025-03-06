import { Dispatch, FC, SetStateAction } from 'react'
import { MenuOpenType } from '../LeadsKanban'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import IconifyIcon from '../../../components/icon'
import { useTranslation } from 'react-i18next'
import SendSmsAnonimUserForm from 'src/views/apps/lids/anonimUser/SendSmsAnonimUserForm'
import { useGet } from 'src/hooks/useApi'
import { useAppDispatch } from '../../../store'
import { setAddSource, setOpenLid, setSectionId } from '../../../store/apps/leads'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string | null
  onClose?: boolean
}

export const SmsModal: FC<Props> = ({ open, onClose, setOpen, leadId }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
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
          closeModal={() => {
            setOpen(null)
            if (onClose) {
              dispatch(setOpenLid(null))
              dispatch(setAddSource(false))
              dispatch(setSectionId(null))
            }
          }} />
      </DialogContent>
    </Dialog>
  )
}

SmsModal.displayName = 'SmsModal'
