'use client'

import { FC, useState, useEffect } from 'react'
import api from '../../../../../@core/utils/api'
import { toast } from 'react-hot-toast'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Fade,
  Paper
} from '@mui/material'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Check, LockKeyhole, Square, X, MessageSquare, Calendar } from 'lucide-react'
import dayjs from 'dayjs'
import { getFormatDate } from '@/shared/utils/getFormatDate'

type Props = {
  currentDate: any
  defaultValue: true | false | null | 0
  groupId?: any
  userId?: any
  date?: any
  opened_id: any
  setOpenedId: any
  updated_at?: string
  isDayOff?: boolean
  isEndOfMonth?: boolean
}

export const UserViewItem: FC<Props> = ({
  currentDate,
  defaultValue,
  groupId,
  userId,
  date,
  opened_id,
  updated_at,
  setOpenedId,
  isDayOff = false,
  isEndOfMonth = false
}) => {
  const [value, setValue] = useState<true | false | null | 0>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)
  const [description, setDescription] = useState<true | false | null | 0>(0)
  const [openTooltip, setOpenTooltip] = useState(false)
  const [descriptionText, setDescriptionText] = useState(currentDate?.description || '')

  const handleSubmit = async (values: { description: string }) => {
    let data: object
    if (values.description == '') {
      data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: description
      }
    } else {
      data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: description,
        description: values.description
      }
    }
    try {
      const response = await api.patch(`common/attendance/update/${currentDate?.id}/`, data)
      if (response.data.description) {
        setDescriptionText(response.data.description)
      }
      onClose()
      toast.success('Muvaffaqiyatli saqlandi')
    } catch (e: any) {
      console.error(e)
      toast.error(e.response?.data.msg?.[0] || "Saqlab bo'lmadi qayta urinib ko'ring")
      setValue(defaultValue)
    }
  }

  const onClose = () => {
    setDescription(0)
    setOpenedId(null)
  }

  const handleClick = async (status: any) => {
    setOpenedId(null)
    if (value !== status) {
      setValue(status)

      if (status === false) {
        setDescription(status)
        return
      }

      const data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: status
      }
      try {
        await api.patch(`common/attendance/update/${currentDate?.id}/`, data)
        toast.success('Muvaffaqiyatli saqlandi')
      } catch (e: any) {
        toast.error(e.response?.data.msg?.[0] || "Saqlab bo'lmadi qayta urinib ko'ring")
        setValue(defaultValue)
      }
    }
  }

  useEffect(() => {
    if (`${userId}-${date}` === opened_id) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [opened_id, userId, date])

  if (isDayOff) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(244, 67, 54, 0.08)',
          height: '100%'
        }}
      >
        <Tooltip title='Dam olish kuni' placement='top'>
          <Calendar style={{ color: '#e31309', width: '20px', height: '20px' }} />
        </Tooltip>
      </Box>
    )
  }

  if (isEndOfMonth) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(244, 67, 54, 0.05)',
          height: '100%'
        }}
      >
        <Tooltip title='Oy tugadi' placement='top'>
          <Typography sx={{ color: '#e31309', fontSize: '12px', fontWeight: 500 }}>Oy tugadi</Typography>
        </Tooltip>
      </Box>
    )
  }

  if (value === true || value === false || value === null) {
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {open && (
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              gap: '4px',
              position: 'absolute',
              width: '120px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.05)',
              p: '4px'
            }}
          >
            <Tooltip title={'Kelmadi'} placement='top'>
              <IconButton
                onClick={() => handleClick(false)}
                sx={{
                  p: '6px',
                  backgroundColor: value === false ? 'rgba(244, 67, 54, 0.12)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' }
                }}
              >
                <X style={{ color: '#e31309', width: '20px', height: '20px' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={'Keldi'} placement='top'>
              <IconButton
                onClick={() => handleClick(true)}
                sx={{
                  p: '6px',
                  backgroundColor: value === true ? 'rgba(76, 175, 80, 0.12)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                }}
              >
                <Check style={{ color: '#4be309', width: '20px', height: '20px' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title='Belgilanmagan' placement='top'>
              <IconButton
                onClick={() => handleClick(null)}
                sx={{
                  p: '6px',
                  backgroundColor: value === null ? 'rgba(158, 158, 158, 0.12)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(158, 158, 158, 0.2)' }
                }}
              >
                <Square style={{ color: '#9e9e9e', width: '20px', height: '20px' }} />
              </IconButton>
            </Tooltip>
          </Paper>
        )}

        {!open && (
          <Box>
            {value === true ? (
              <Tooltip title={getFormatDate(String(updated_at)) || 'Keldi'} placement='top'>
                <IconButton
                  onClick={() => setOpenedId(`${userId}-${date}`)}
                  sx={{
                    p: '4px',
                    backgroundColor: 'rgba(76, 175, 80, 0.08)',
                    '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.16)' }
                  }}
                >
                  <Check style={{ color: '#4be309', width: '22px', height: '22px' }} />
                </IconButton>
              </Tooltip>
            ) : value === false ? (
              <Tooltip
                open={openTooltip}
                onClose={() => setOpenTooltip(false)}
                title={`${descriptionText} - ${getFormatDate(String(updated_at))}` || 'Kelmadi'}
                placement='top'
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton
                  onClick={() => setOpenedId(`${userId}-${date}`)}
                  onMouseEnter={() => descriptionText && setOpenTooltip(true)}
                  sx={{
                    p: '4px',
                    backgroundColor: 'rgba(244, 67, 54, 0.08)',
                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.16)' }
                  }}
                >
                  {descriptionText ? (
                    <MessageSquare style={{ color: '#e31309', width: '22px', height: '22px' }} />
                  ) : (
                    <X style={{ color: '#e31309', width: '22px', height: '22px' }} />
                  )}
                </IconButton>
              </Tooltip>
            ) : value === null ? (
              <Tooltip title='Belgilanmagan' placement='top'>
                <IconButton
                  onClick={() => setOpenedId(`${userId}-${date}`)}
                  sx={{
                    p: '4px',
                    backgroundColor: 'rgba(158, 158, 158, 0.08)',
                    '&:hover': { backgroundColor: 'rgba(158, 158, 158, 0.16)' }
                  }}
                >
                  <Square style={{ color: '#9e9e9e', width: '22px', height: '22px' }} />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>
        )}

        <Dialog
          maxWidth='xs'
          fullWidth
          open={description === false}
          onClose={onClose}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              padding: '8px'
            }
          }}
        >
          <DialogTitle sx={{ p: '16px 24px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <Typography variant='h6' sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
              Kelmagan sababi haqida izoh
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ p: '24px' }}>
            <Formik
              initialValues={{ description: descriptionText || '' }}
              validationSchema={Yup.object({
                description: Yup.string().nullable()
              })}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, values }) => (
                <Form>
                  <FormControl sx={{ width: '100%' }}>
                    <TextField
                      label='Izoh'
                      placeholder='Kelmagan sababi haqida izoh kiriting'
                      name='description'
                      fullWidth
                      margin='normal'
                      variant='outlined'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      error={!!values.description && !values.description.trim()}
                      helperText={<ErrorMessage name='description' />}
                    />
                  </FormControl>
                  <DialogActions sx={{ p: '16px 0 0 0', mt: '16px' }}>
                    <Button
                      sx={{
                        borderRadius: '8px',
                        p: '8px 16px',
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                      variant='outlined'
                      onClick={() => {
                        setValue(defaultValue)
                        onClose()
                      }}
                    >
                      Bekor qilish
                    </Button>
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      sx={{
                        borderRadius: '8px',
                        p: '8px 16px',
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Saqlash
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </Box>
    )
  } else {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip title='Yopiq kun' placement='top'>
          <LockKeyhole style={{ color: '#9e9e9e', width: '20px', height: '20px' }} />
        </Tooltip>
      </Box>
    )
  }
}
