import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../../../components/icon'
import AddNoteAnonimUser from 'src/views/apps/lids/anonimUser/AddNoteAnonimUser'
import { MenuOpenType } from '../model/type'
import { setAddSource, setOpenLid, setSectionId } from '@/store/apps/leads'
import { useAppDispatch } from '@/store'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string | null
  onClose?: boolean
}

export const LeadNoteModal: FC<Props> = ({ open, setOpen, onClose, leadId }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  return (
    <Dialog open={open === 'note'} maxWidth='md' onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('Yangi eslatma')}</Typography>

        <IconButton onClick={() => setOpen(null)}>
          <IconifyIcon icon={'material-symbols:close'} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minWidth: '300px' }}>
        <AddNoteAnonimUser
          user={leadId}
          closeModal={() => {
            setOpen(null);

            if(onClose) {
              dispatch(setOpenLid(null))
              dispatch(setAddSource(false))
              dispatch(setSectionId(null))
            }
          }}
          />
      </DialogContent>
    </Dialog>
  )
}
