import { Close } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import MergeToDepartment from 'src/views/apps/lids/anonimUser/MergeForm'
import { MenuOpenType } from '../LeadsKaban'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string
  onClose?: () => void
  currentId: string
}

export const AddDepartmantModal: FC<Props> = ({ currentId, onClose, open, setOpen, leadId }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return (
    <Dialog
      open={open === 'merge-to' || open === 'merge-to-amo'}
      onClose={() => {
        setOpen(null)
        if (onClose) onClose()
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>{t(open == 'merge-to' ? "Boshqa bo'limga o'tkazish" : "Soff crmga o'tkazish")}</Typography>
        <IconButton>
          <Close onClick={() => setOpen(null)} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <MergeToDepartment
          currentId={currentId}
          setOpen={setOpen}
          open={open}
          is_amocrm={false}
          item={{ id: leadId }}
          reRender={() =>
            queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
          }
        />
      </DialogContent>
    </Dialog>
  )
}
