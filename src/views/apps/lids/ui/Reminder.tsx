'use client'

import React, { FC, useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
  FormControl
} from '@mui/material'
import {
  User,
  MessageSquare,
  Bell,
  Clock,
  MoreVertical,
  Edit,
  Trash
} from 'lucide-react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { getFormatDate } from '@/shared/utils/getFormatDate'
import { useDeleteLeadsDescription, usePutLeadsDescription } from '@/shared/query-hooks'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { truncateToMinute } from '@/views/apps/lids/anonimUser/AddNoteAnonimUser'

interface NotificationItem {
  id: string
  date?: Date
  admin?: string
  text?: string
  body?: string
  created_at?: string
}

interface NotificationBoxProps {
  item: NotificationItem
  userId: string
  refetch: VoidFunction
}

export const ReminderBox: FC<NotificationBoxProps> = ({ item, userId, refetch }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editText, setEditText] = useState(item?.text || item?.body || '')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { isPending, mutate } = usePutLeadsDescription()
  const { isPending: pendingDeleteDescription, mutate: deleteDescription } = useDeleteLeadsDescription()
  const [reminderDate, setReminderDate] = useState<Date | null>(() => {
    if (item?.date) {
      const parsed = new Date(item.date);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditClick = () => {
    setEditText(item?.text || item?.body || '')
    setEditDialogOpen(true)
    handleMenuClose()
  }

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const handleEditSave =  async () => {
    mutate(
      { id: item.id, anonim_user: userId, newText: editText, date: truncateToMinute(reminderDate) },
      {
        onSuccess: () => {
          setEditDialogOpen(false)
          toast.success('Tahrirlash muviqiyatli bajarildi')
          refetch()
        },
        onError: err => {
          console.error(err)
          toast.error("Tahrirlashda xatolik, iltimos qaytadan urunib ko'ring")
        }
      }
    )
  }

  const handleDeleteConfirm = () => {
    deleteDescription(
      { id: item?.id },
      {
        onSuccess: () => {
          setEditDialogOpen(false)
          toast.success("O'chirish muviqiyatli bajarildi")
          refetch()
        },
        onError: err => {
          console.error(err)
          toast.error("O'chirishda xatolik, iltimos qaytadan urunib ko'ring")
        }
      }
    )
    setDeleteDialogOpen(false)
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 1,
        p: 2.5,
        mb: 2,
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={2}
        pb={1.5}
        sx={{ borderBottom: '1px solid #e0e0e0' }}
      >
        <Box display='flex' alignItems='center' gap={3}>
          {item?.admin && (
            <Tooltip title='Yaratgan Admin'>
              <Box display='flex' gap={1} alignItems='center' sx={{ userSelect: 'none' }}>
                <Box
                  sx={{
                    color: 'primary.main',
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <User size={16} />
                </Box>
                <Typography variant='body1' fontWeight='medium'>
                  {item?.admin}
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        <Box display='flex' alignItems='center' gap={1}>
          {item?.date && (
            <Box display='flex' alignItems='center' mr={1}>
              <Box
                sx={{
                  color: 'warning.main',
                  mr: 0.5,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Bell size={16} />
              </Box>

              <Typography variant='caption' color='text.secondary'>
                {getFormatDate(item.date, 'dd MMMM yyyy', true)}
              </Typography>
            </Box>
          )}

          <IconButton size='small' onClick={handleMenuClick} sx={{ ml: 1 }}>
            <MoreVertical size={16} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuItem onClick={handleEditClick}>
              <Edit size={16} style={{ marginRight: 8 }} />
              Tahrirlash
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
              <Trash size={16} style={{ marginRight: 8 }} />
              O'chirish
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box display='flex' alignItems='center' justifyContent='center' gap={3}>
        {(item?.text || item?.body) && (
          <Box display='flex' alignItems='flex-start' width='100%' gap={1}>
            <Box
              sx={{
                color: 'primary.main',
                display: 'flex',
                marginY: 'auto',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageSquare size={16} />
            </Box>

            <Tooltip title='Eslatma matni'>
              <Typography
                variant='body1'
                sx={{
                  lineHeight: 1.6,
                  color: 'text.primary',
                  wordBreak: 'break-word'
                }}
              >
                {item?.text || item?.body}
              </Typography>
            </Tooltip>
          </Box>
        )}

        {item?.created_at && (
          <Tooltip title='Eslatma yaratilgan sanasi'>
            <Box display='flex' alignItems='center' sx={{ userSelect: 'none' }} flexShrink={0} gap={1}>
              <Box
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Clock size={12} />
              </Box>

              <Typography variant='caption' color='text.secondary'>
                {getFormatDate(String(item.created_at), 'dd MMMM yyyy', true)}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Eslatmani tahrirlash</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl fullWidth sx={{ marginTop: 4 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label='Eslatish vaqti'
                value={reminderDate}
                onChange={newValue => setReminderDate(newValue)}
                disablePast
                format='dd/MM/yyyy HH:mm'
                ampm={false}
                slotProps={{
                  textField: {
                    size: 'small',
                    error: false
                  }
                }}
              />
            </LocalizationProvider>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              fullWidth
              multiline
              rows={4}
              label='Eslatma matni'
              value={editText}
              onChange={e => setEditText(e.target.value)}
              margin='normal'
              variant='outlined'
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Bekor qilish</Button>

          <LoadingButton loading={isPending} onClick={handleEditSave} color='primary' variant='contained'>
            Saqlash
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Eslatmani o'chirish</DialogTitle>
        <DialogContent>
          <Typography>Siz haqiqatdan ham bu eslatmani o'chirmoqchimisiz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant='outlined'>
            Yo'q
          </Button>
          <LoadingButton
            loading={pendingDeleteDescription}
            onClick={handleDeleteConfirm}
            color='error'
            variant='outlined'
          >
            Ha
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
