'use client'

import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../../../../components/icon'
import EditAnonimUserForm from './EditAnonimUserForm'
import { FC } from 'react'
import { QueryObserverResult, RefetchOptions, useQueryClient } from '@tanstack/react-query'
import { LeadsType } from 'src/entities/lids'
import { LeadsResult } from 'src/entities/lids/LeadsKaban'

type Props = {
  open: any
  setOpen: any
  department?: any
  lead: any
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<LeadsType<LeadsResult[]>, any>>
}

export const EditAnonimDialogDialog: FC<Props> = ({ department, refetch, lead, open, setOpen }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const closeCreateLid = async () => {
    await refetch()
    setOpen(null)
  }

  return (
    <Dialog onClose={closeCreateLid} open={open === 'edit'}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant='h6' component='span'>
          {t('Lidni tahrirlash')}
        </Typography>

        <IconButton aria-label='close' onClick={closeCreateLid}>
          <IconifyIcon icon='mdi:close' />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minWidth: '320px' }}>
        <EditAnonimUserForm
          onClose={() => {
            setOpen(null)
            refetch()
          }}
          laed
          department={department}
          item={lead}
        />
      </DialogContent>
    </Dialog>
  )
}
