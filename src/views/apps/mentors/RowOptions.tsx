'use client'

import { IconButton, Menu, Typography } from '@mui/material'
import { MouseEvent, useState } from 'react'
import IconifyIcon from '../../../components/icon'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchTeacherdetail, fetchTeachersList, setOpenEdit, updateParams } from 'src/store/apps/mentors'
import { disablePage } from 'src/store/apps/page'
import { SendSMSModal } from '../students/view/UserViewLeft'
import useSMS from 'src/hooks/useSMS'
import { useDelete, useGet, usePatch } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'
import { useQueryClient } from '@tanstack/react-query'
import { AccessDeniedModal } from '@components/AccessDeniedModal'

const RowOptions = ({ id, status }: { id: number | string; status: string }) => {
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const { companyInfo } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const [openSms, setOpenSms] = useState<any>()
  const [accessModal, setAccessModal] = useState<boolean>(false)
  const rowOptionsOpen = Boolean(anchorEl)
  const { smsTemps, getSMSTemps } = useSMS()
  const { mutate: editMutate, isPending: editPending } = usePatch()
  const queryClient = useQueryClient()
  const { mutate, isPending: isPendingDelete } = useDelete()
  const handleEditClose = () => {
    setOpenSms(null)
  }

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleRowOptionsClose()
    setSuspendDialogOpen(true)
  }

  const handleDeleteTeacher = async (id: string | number) => {
    dispatch(disablePage(true))
    mutate(ceoConfigs.employee_delete + id + '/', {
      onSuccess: () => {
        toast.success(`${t("O'qituvchilar ro'yxatidan o'chirildi")}`, { position: 'top-center' })
        queryClient.invalidateQueries({ queryKey: [ceoConfigs.teachers, 'mentors'] })
      },
      onError: error => {
        toast.error(`${error?.response.data.msg}`, { position: 'top-center' })
      }
    })
    dispatch(disablePage(false))
  }

  const handleChange = async (id: string | number) => {
    editMutate(
      ceoConfigs.update_employee_status + id,
      { status: 'active' },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [ceoConfigs.teachers, 'mentors'] })
          toast.success("O'qituvchi qaytarildi")
        },
        onError: () => {
          toast.error("Tiklab bo'lmadi")
        }
      }
    )
    dispatch(disablePage(false))
  }

  const handleEdit = async (id: any) => {
    dispatch(setOpenEdit('edit'))
    handleRowOptionsClose()
    await dispatch(fetchTeacherdetail(id))
  }

  const handleModalsOpen = () => {
    if(companyInfo.access) {
      void getSMSTemps(); setOpenSms('sms')
    } else {
      setAccessModal(true)
    }
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <IconifyIcon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        {status == 'archive' ? (
          <MenuItem disabled={editPending} onClick={() => handleChange(id)} sx={{ '& svg': { mr: 2 } }}>
            {editPending ? (
              <Typography>Tiklanmoqda...</Typography>
            ) : (
              <>
                <IconifyIcon icon='icon-park-outline:return' fontSize={20} />
                {t('Tiklash')}
              </>
            )}
          </MenuItem>
        ) : (
          <>
            <MenuItem
              component={Link}
              sx={{ '& svg': { mr: 2 } }}
              onClick={handleRowOptionsClose}
              href={`/mentors/view/security?id=${id}`}
            >
              <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
              {t("Ko'rish")}
            </MenuItem>
            <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
              {t('Tahrirlash')}
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
              {t("O'chirish")}
            </MenuItem>
            <MenuItem onClick={handleModalsOpen} sx={{ '& svg': { mr: 2 } }}>
              <IconifyIcon icon='mdi:sms' fontSize={20} />
              {t('SMS yuborish')}
            </MenuItem>
          </>
        )}
      </Menu>

      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />
      <UserSuspendDialog
        loading={isPendingDelete}
        handleOk={() => handleDeleteTeacher(id)}
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
      />
      <SendSMSModal
        handleEditClose={handleEditClose}
        openEdit={openSms}
        smsTemps={smsTemps}
        setOpenEdit={setOpenSms}
        usersData={[id]}
      />
    </>
  )
}

export default RowOptions
