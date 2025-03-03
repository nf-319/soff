'use client'

import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/@core/components/icon'
import EditAnonimUserForm from './EditAnonimUserForm'
import { FC } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from 'src/store'
import { setAddSource, setOpenLid, setSectionId } from 'src/store/apps/leads'

type Props = {
  open: any
  setOpen: any
  department?: any
  lead: any
}

export const EditAnonimDialogDialog: FC<Props> = ({ department, lead, open, setOpen }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const closeCreateLid = async () => {
    queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
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
            queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/', 'departments-leads'] })
          }}
          laed
          department={department}
          item={lead}
        />
      </DialogContent>
    </Dialog>
  )
}
