import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import React, { MouseEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../../../components/icon'
import api from 'src/@core/utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { disablePage } from 'src/store/apps/page'
import { fetchStudentDetail, setOpenEdit, updateStudent, updateStudentParams } from 'src/store/apps/students'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { DatePicker } from '@/components/DatePicker'
import { X } from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'
import dayjs from 'dayjs'

type Props = {
  id: number
}

export default function StudentRowOptions({ id }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [recoveModal, setRecoveModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { queryParams } = useAppSelector(state => state.students)
  const queryClient = useQueryClient()
  const rowOptionsOpen = Boolean(anchorEl)

  const validationSchema = Yup.object({
    date: Yup.date().nullable().required('Sanani tanlang')
  })

  const formik = useFormik({
    initialValues: {
      date: null
    },
    validationSchema,
    onSubmit: values => {
      setLoading(true)
      dispatch(disablePage(true))
      const formatted = dayjs(values.date).format('YYYY-MM-DD')
      dispatch(updateStudent({ id, data: { status: 'active', added_at: formatted } }))
      dispatch(disablePage(false))
      toast.success("O'quvchi muvaffaqiyatli aktivlashtirildi")
      dispatch(updateStudentParams({ status: 'active' }))
      queryClient.invalidateQueries({ queryKey: ['student/new-list/', 'students-list'] })
      handleClose()
      setLoading(false)
    }
  })

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

  const handleEdit = async () => {
    dispatch(setOpenEdit('edit'))
    setAnchorEl(null)
    await dispatch(fetchStudentDetail(id))
  }

  const handleActive = async () => {
    setLoading(true)
    dispatch(disablePage(true))
    await dispatch(updateStudent({ id, data: { status: 'active' } }))
    dispatch(disablePage(false))
    toast.success("O'quvchi muvaffaqiyatli aktivlashtirildi")
    dispatch(updateStudentParams({ status: 'active' }))
    queryClient.invalidateQueries({ queryKey: ['student/new-list/', 'students-list'] })
    setLoading(false)
  }

  function handleClose() {
    setRecoveModal(false)
    formik.resetForm()
  }

  async function submitDelete() {
    setLoading(true)
    dispatch(disablePage(true))
    await api
      .delete(`student/destroy/${id}/`)
      .then(res => {
        toast.success("O'quvchi muvaffaqiyatli o'chirildi")
        queryClient.invalidateQueries({ queryKey: ['student/new-list/', 'students-list'] })
      })
      .catch(err => {
        toast.error(err.response.data.msg || "O'quvchini o'chirib bo'lmadi")
        console.log(err)
      })

    dispatch(disablePage(false))
    setLoading(false)
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
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href={`/students/view/security?student=${id}`}
        >
          <IconifyIcon icon='mdi:eye-outline' fontSize={20} />
          {t("Ko'rish")}
        </MenuItem>
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleEdit}>
          <IconifyIcon icon='mdi:pencil-outline' fontSize={20} />
          {t('Tahrirlash')}
        </MenuItem>
        {queryParams.status === 'archive' ? (
          <MenuItem onClick={() => setRecoveModal(true)} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='bytesize:reload' fontSize={20} />
            {t('Tiklash')}
          </MenuItem>
        ) : (
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
            {t("O'chirish")}
          </MenuItem>
        )}
        {queryParams.status === 'archive' && (
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:delete-outline' fontSize={20} />
            {t("Butunlay o'chirish")}
          </MenuItem>
        )}
      </Menu>
      <UserSuspendDialog
        loading={loading}
        handleOk={submitDelete}
        open={suspendDialogOpen}
        setOpen={setSuspendDialogOpen}
      />
      {/* <UserSuspendDialog
        loading={loading}
        handleOk={() => handleActive()}
        open={recoveModal}
        setOpen={setRecoveModal}
        okText='Tiklash'
      /> */}
      <Dialog open={recoveModal} onClose={handleClose}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>O'quvchini aktivlashtirish</Typography>
          <IconButton onClick={handleClose}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ paddingY: 2 }}>
            <DatePicker
              label='Aktivlashtirish sanasi'
              value={formik.values.date}
              onChange={value => formik.setFieldValue('date', value)}
              format='dd/MM/yyyy'
              views={['day']}
              fullWidth
            />
            {formik.touched.date && formik.errors.date && (
              <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{formik.errors.date}</div>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => formik.handleSubmit()} variant='contained' size='small'>
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
