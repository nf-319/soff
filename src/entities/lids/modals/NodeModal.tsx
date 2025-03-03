import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import AddNoteAnonimUser from 'src/views/apps/lids/anonimUser/AddNoteAnonimUser'
import { MenuOpenType } from '../LeadsKaban'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  onClose?: () => void
  leadId: string | null
}

export const LeadNoteModal: FC<Props> = ({ open, setOpen, onClose, leadId }) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open === 'note'} onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>{t('Yangi eslatma')}</Typography>

        <IconButton onClick={() => setOpen(null)}>
          <IconifyIcon icon={'material-symbols:close'} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minWidth: '300px' }}>
        <AddNoteAnonimUser
          user={leadId}
          closeModal={() => setOpen(null)}
        />
      </DialogContent>
    </Dialog>
  )
}
