import { Close } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddToGroupForm from 'src/views/apps/lids/anonimUser/AddToGroupForm'
import { LeadsType } from '../model'
import { LeadsResult, MenuOpenType } from '../LeadsKaban'
import { useGet } from 'src/hooks/useApi'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<LeadsType<LeadsResult[]>, any>>
}

export const AddGroup: FC<Props> = ({ open, leadId, setOpen, refetch }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const { data, isLoading } = useGet('common/group-check-list/')

  return (
    <Dialog open={open === 'add-group'} onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>{t("Guruhga qo'shish")}</Typography>

        <IconButton>
          <Close onClick={() => setOpen(null)} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AddToGroupForm
          item={{ id: leadId }}
          reRender={() => {
            refetch()
            setOpen(null)
          }}
          groups={data && data}
          loading={loading}
          setLoading={setLoading}
          is_amocrm={false}
        />
      </DialogContent>
    </Dialog>
  )
}
