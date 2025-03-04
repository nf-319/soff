import { Close } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import MergeToDepartment from 'src/views/apps/lids/anonimUser/MergeForm'
import { LeadsType } from '../model'
import { LeadsResult, MenuOpenType } from '../LeadsKaban'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string
  currentId: string
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<LeadsType<LeadsResult[]>, any>>
}

export const AddDepartmantModal: FC<Props> = ({ currentId, open, setOpen, leadId, refetch }) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open === 'merge-to' || open === 'merge-to-amo'} onClose={() => setOpen(null)}>
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
          reRender={() => refetch()}
        />
      </DialogContent>
    </Dialog>
  )
}
