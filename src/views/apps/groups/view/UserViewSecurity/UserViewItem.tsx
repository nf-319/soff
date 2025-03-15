'use client'

import { FC, useEffect, useState } from 'react'
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
import { Check, LockKeyhole, Square, X } from 'lucide-react'

type Props = {
  currentDate: any
  defaultValue: true | false | null | 0
  groupId?: any
  userId?: any
  date?: any
  opened_id: any
  setOpenedId: any
}

export const UserViewItem: FC<Props> = ({
  currentDate,
  defaultValue,
  groupId,
  userId,
  date,
  opened_id,
  setOpenedId
}) => {
  const [value, setValue] = useState<true | false | null | 0>(defaultValue)
  const [open, setOpen] = useState<boolean>(false)
  const [description, setDescription] = useState<true | false | null | 0>(0)
  const [openTooltip, setOpenTooltip] = useState(false)
  const [descriptionText, setDescriptionText] = useState('')

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
    } catch (e: any) {
      console.error(e)
      toast.error(e.response?.data.msg?.[0] || "Saqlab bo'lmadi qayta urinib ko'ring")
      setValue(defaultValue)
    }
  }

  const onClose = () => {
    setDescription(0)
  }

  const handleClick = async (status: any) => {
    setOpenedId(null)
    if (value !== status) {
      setValue(status)
      setDescription(status)
      const data = {
        group: groupId,
        student: userId,
        date: date,
        is_available: status
      }
      try {
        await api.patch(`common/attendance/update/${currentDate?.id}/`, data)
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
  }, [opened_id])

  if (value === true || value === false || value === null) {
    return (
      <Box
        style={{
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
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              gap: '4px',
              position: 'absolute',
              width: '100px',
              height: '36px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              borderRadius: '18px'
            }}
          >
            <IconButton onClick={() => handleClick(false)} style={{ padding: '4px' }}>
              <X style={{ color: '#e31309', width: '18px', height: '18px' }} />
            </IconButton>
            <IconButton onClick={() => handleClick(true)} style={{ padding: '4px' }}>
              <Check style={{ color: '#4be309', width: '18px', height: '18px' }} />
            </IconButton>
            <IconButton onClick={() => handleClick(null)} style={{ padding: '4px' }}>
              <Square style={{ color: '#9e9e9e', width: '18px', height: '18px' }} />
            </IconButton>
          </Paper>
        )}
        {!open && (
          <Box>
            {value === true ? (
              <IconButton onClick={() => setOpenedId(`${userId}-${date}`)} style={{ padding: '4px' }}>
                <Check style={{ color: '#4be309', width: '20px', height: '20px' }} />
              </IconButton>
            ) : value === false ? (
              <Tooltip
                open={openTooltip}
                onClose={() => setOpenTooltip(false)}
                title={descriptionText || currentDate.description || ''}
                placement='top'
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton
                  onClick={() => setOpenTooltip(true)}
                  onDoubleClick={() => setOpenedId(`${userId}-${date}`)}
                  style={{ padding: '4px' }}
                >
                  <X style={{ color: '#e31309', width: '20px', height: '20px' }} />
                </IconButton>
              </Tooltip>
            ) : value === null ? (
              <IconButton onClick={() => setOpenedId(`${userId}-${date}`)} style={{ padding: '4px' }}>
                <Square style={{ color: '#9e9e9e', width: '20px', height: '20px' }} />
              </IconButton>
            ) : null}
          </Box>
        )}

        <Dialog
          maxWidth={'sm'}
          fullWidth
          open={description === false}
          onClose={onClose}
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '8px'
            }
          }}
        >
          <DialogTitle style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant='h6' style={{ fontWeight: 600 }}>
              Izoh yozish
            </Typography>
          </DialogTitle>
          <DialogContent style={{ padding: '24px' }}>
            <Formik
              initialValues={{ description: '' }}
              validationSchema={Yup.object({
                description: Yup.string().nullable()
              })}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, values }) => (
                <Form>
                  <FormControl style={{ marginTop: 16, width: '100%' }}>
                    <Field
                      as={TextField}
                      label='Izoh'
                      placeholder='Izoh kiriting'
                      name='description'
                      fullWidth
                      variant='outlined'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      error={!!values.description && !values.description.trim()}
                      helperText={<ErrorMessage name='description' />}
                      InputProps={{
                        style: { borderRadius: '8px' }
                      }}
                    />
                  </FormControl>
                  <DialogActions style={{ padding: '16px 0 0 0', marginTop: '16px' }}>
                    <Button
                      fullWidth
                      type='submit'
                      variant='contained'
                      color='primary'
                      style={{
                        borderRadius: '8px',
                        padding: '10px 16px',
                        textTransform: 'none',
                        fontWeight: 600
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
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LockKeyhole style={{ color: '#9e9e9e', width: '20px', height: '20px' }} />
      </Box>
    )
  }
}
