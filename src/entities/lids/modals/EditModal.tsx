'use client'

import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../../../components/icon'
import EditDepartmentItemForm from 'src/views/apps/lids/departmentItem/EditDepartmentItemForm'

type Props = {
  open: 'edit' | 'recover' | null
  id: number
  title: string
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, any>>
  setOpen: (open: 'edit' | 'recover' | null) => void
}

export const LidsEditModal: FC<Props> = ({ open, refetch, setOpen, title, id }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <Dialog open={Boolean(open)} onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>{t('Tahrirlash')}</Typography>

        <IconButton>
          <IconifyIcon onClick={() => setOpen(null)} icon={'material-symbols:close'} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minWidth: '300px' }}>
        <EditDepartmentItemForm
          loading={loading}
          refetch={refetch}
          setLoading={setLoading}
          id={id}
          setOpenDialog={setOpen}
          defaultName={title}
        />
      </DialogContent>
    </Dialog>
  )
}
