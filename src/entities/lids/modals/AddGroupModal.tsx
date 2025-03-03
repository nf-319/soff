import { Close } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddToGroupForm from 'src/views/apps/lids/anonimUser/AddToGroupForm'
import { MenuOpenType } from '../LeadsKaban'
import { useGet } from 'src/hooks/useApi'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string
  onClose?: () => void
}

export const AddGroup: FC<Props> = ({ onClose, open, leadId, setOpen }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState<boolean>(false)
  const { data } = useGet('common/group-check-list/')

  return (
    <Dialog
      open={open === 'add-group'}
      onClose={() => {
        setOpen(null)
        if (onClose) onClose()
      }}
    >
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
            queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
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
