//@ts-nocheck
'use client'

import { IconButton, Menu } from '@mui/material'
import { MouseEvent, useEffect, useState } from 'react'
import IconifyIcon from '../../../components/icon'
import MenuItem from '@mui/material/MenuItem'
import Link from 'next/link'
import UserSuspendDialog from 'src/views/apps/groups/view/UserSuspendDialog'
import getMontName from 'src/@core/utils/gwt-month-name'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  deleteGroups,
  getDashboardLessons,
  getGroupsDetails,
  handleChangeBranchOpenEdit,
  setDeleteGroupId
} from 'src/store/apps/groups'
import { disablePage } from 'src/store/apps/page'
import { toast } from 'react-hot-toast'
import Excel from '../../../components/excelButton/Excel'
import { handleEditClickOpen, studentsUpdateParams } from 'src/store/apps/groupDetails'
import { useQueryClient } from '@tanstack/react-query'
import ceoConfigs from 'src/configs/ceo'
import { GroupType } from '../../../types/types'
import { GroupCreateEditDrawer } from '@/components/GroupDrawerModal'

const RowOptions = ({ groups, id }: { groups: GroupType[]; id: number | string }) => {
  const { queryParams } = useAppSelector(state => state.groups)
  const dispatch = useAppDispatch()
  const [isDeleting, setDeleting] = useState(false)
  const queryClient = useQueryClient()
  const [openEditModal, setOpenEditModal] = useState<'create'|'edit'|null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [suspendDialogOpen2, setSuspendDialogOpen2] = useState<boolean>(false)
  const [group, setGroup] = useState<any>()
  const rowOptionsOpen = Boolean(anchorEl)

  useEffect(() => {
    if (groups && id !== undefined) {
      const foundGroup = groups.find(group => group.id === id)
      setGroup(foundGroup)
    }
  }, [groups, id])

  const { t } = useTranslation()

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDelete = () => {
    setAnchorEl(null)
    setSuspendDialogOpen(true)
  }
  const handleDeleteFully = () => {
    setSuspendDialogOpen2(true)
  }

  const handleChangeBranch = async (id: any) => {
    dispatch(handleChangeBranchOpenEdit(true))
    await Promise.all([dispatch(getGroupsDetails(id))])
  }

  const handleEdit = async (id: any) => {
    setAnchorEl(null)
    setOpenEditModal('edit')
    const filtered = groups?.find(item => item.id == id)
    const queryString = new URLSearchParams({
      day_of_week: filtered?.week_days?.toString(),
      teacher: String(filtered?.teacher),
      room: String(filtered?.room_id)
    }).toString()
    await Promise.all([dispatch(getDashboardLessons(queryString)), dispatch(getGroupsDetails(id))])
  }

  // const handleRecovery = async (id: any) => {
  //   setAnchorEl(null)
  //   dispatch(handleOpenEdit(true))
  //   const filtered = groups?.find(item => item.id == id)
  //   const queryString = new URLSearchParams({
  //     day_of_week: filtered?.week_days?.toString(),
  //     teacher: String(filtered?.teacher),
  //     room: String(filtered?.room_id)
  //   }).toString()
  //   dispatch(updateParams({ is_recovery: true }))
  //   await Promise.all([dispatch(getDashboardLessons(queryString)), dispatch(getGroupsDetails(id))])
  // }

  const handleDeleteGroup = async (id: string | number) => {
    setDeleting(true)
    dispatch(disablePage(true))
    const response: any = await dispatch(deleteGroups(id))
    if (response.meta.requestStatus == 'rejected') {
      toast.error(response.payload.msg || "Guruhni o'chirib bo'lmadi")
    } else {
      queryClient.invalidateQueries({ queryKey: [ceoConfigs.groups, 'groups-list'] })
    }
    setDeleting(false)
    dispatch(disablePage(false))
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
        onClose={() => setAnchorEl(null)}
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
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={() => {
            setAnchorEl(null), dispatch(studentsUpdateParams({ status: 'active,new' }))
          }}
          href={`/groups/view/security?id=${id}&month=${getMontName(null)}`}
        >
          <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
          {t("Ko'rish")}
        </MenuItem>
        <MenuItem onClick={() => handleEdit(id)} sx={{ '& svg': { mr: 2 } }}>
          <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
          {t('Tahrirlash')}
        </MenuItem>
        {group?.status !== 'archived' && (
          <MenuItem onClick={() => handleChangeBranch(id)} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='material-symbols:swap-horiz' fontSize={20} />
            {t("Guruhni boshqa filialga ko'chirish")}
          </MenuItem>
        )}
        {/*
                {queryParams.status === 'archived' ? <MenuItem onClick={() => handleRecovery(id)} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:reload' fontSize={20} />
                    {t("Tiklash")}
                </MenuItem> : <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
                    <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
                    {t("O'chirish")}
                </MenuItem>} */}

        {group?.status !== 'archived' && (
          <MenuItem
            onClick={() => {
              dispatch(handleEditClickOpen('delete')), dispatch(setDeleteGroupId(id))
            }}
            sx={{ '& svg': { mr: 2 } }}
          >
            <IconifyIcon icon='material-symbols-light:recommend-outline' fontSize={20} />
            {t('Guruhni yakunlash')}
          </MenuItem>
        )}
        {group?.status == 'archived' && (
          <MenuItem onClick={handleDeleteFully} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:trash-can-outline' fontSize={20} />
            {t("Guruhni bazadan o'chirish")}
          </MenuItem>
        )}
        <Excel
          url={`common/group/export/${id}`}
          variant='text'
          sx={{ width: '100%', py: 2, px: 5, borderRadius: '0px', display: 'flex', justifyContent: 'start' }}
        />
      </Menu>
      <UserSuspendDialog
        isDeleting={isDeleting}
        handleOk={() => handleDeleteGroup(id)}
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
      />
      <UserSuspendDialog
        warning="Esda tuting guruhga aloqador barcha malumotlar o'chiriladi"
        isDeleting={isDeleting}
        handleOk={() => handleDeleteGroup(id)}
        open={suspendDialogOpen2}
        setOpen={setSuspendDialogOpen2}
      />
      <GroupCreateEditDrawer open={openEditModal} setOpen={setOpenEditModal} />
    </>
  )
}
export default RowOptions
