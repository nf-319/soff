import { LoadingButton } from '@mui/lab'
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'
import { FC, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'
import {
  editAmoCrmData,
  editDepartment,
  fetchAmoCrmPipelines,
  fetchDepartmentList,
  setOpenActionModal
} from 'src/store/apps/leads'

type Props = {
  id: number
  isAmmo?: boolean
}

export const LidsDeleteModal: FC<Props> = ({ id, isAmmo }) => {
  const { openActionModal, actionId, queryParams } = useSelector((state: RootState) => state.leads)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const setOpen = (close?: boolean) => {
    if (close) {
      dispatch(setOpenActionModal({ open: null, id: null }))
      return
    }

    dispatch(setOpenActionModal({ open: 'delete', id }))
  }

  const deleteDepartmentItem = async () => {
    await dispatch(editDepartment({ is_active: false, id: id }))
    setOpen(true)
    toast.success("Muvaffaqiyatli o'chirildi")
    await dispatch(fetchDepartmentList())
  }

  const deleteAmoCrmData = async () => {
    await dispatch(editAmoCrmData({ data_id: id, is_delete: true, condition: 'pipeline' }))
    setOpen(true)
    toast.success("Muvaffaqiyatli o'chirildi", {
      position: 'top-center'
    })
    await dispatch(fetchAmoCrmPipelines(queryParams))
  }

  return (
    <Dialog open={openActionModal === 'delete' && actionId === id}>
      <DialogContent sx={{ width: '320px', padding: '20px 0' }}>
        <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
          {t("Bo'limni rostdan ham o'chirmoqchimisiz?")}
        </Typography>
      </DialogContent>

      <Box sx={{ padding: '0 0 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <Button color='primary' variant='outlined' onClick={() => setOpen(true)}>
          {t('Bekor qilish')}
        </Button>

        <Button color='error' variant='contained' onClick={isAmmo ? deleteAmoCrmData : deleteDepartmentItem}>
          {t("O'chirish")}
        </Button>
      </Box>
    </Dialog>
  )
}
