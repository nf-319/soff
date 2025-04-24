import { Close } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { QueryObserverResult, RefetchOptions, useQueryClient } from '@tanstack/react-query'
import MergeToDepartment from 'src/views/apps/lids/anonimUser/MergeForm'
import { LeadsType } from '../model'
import { LeadsResult, MenuOpenType } from '../LeadsKanban'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { setAddSource, setOpenLid, setSectionId } from '../../../store/apps/leads'
import { useAppDispatch } from '../../../store'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string
  currentId: string
  defaultId?:any,
  onClose?: boolean
}

export const AddDepartmantModal: FC<Props> = ({defaultId, onClose, currentId, open, setOpen, leadId }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return (
    <Dialog open={open === 'merge-to' || open === 'merge-to-amo'} onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>{t(open == 'merge-to' ? "Boshqa bo'limga o'tkazish" : "Soff crmga o'tkazish")}</Typography>

        <IconButton onClick={() => setOpen(null)}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <MergeToDepartment
          defaultId={defaultId}
          currentId={currentId}
          setOpen={setOpen}
          open={open}
          item={{ id: leadId }}
          reRender={async () => {
            await queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
            if (onClose) {
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
