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
  TextField, Tooltip, FormControl
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
import { DatePicker } from '@components/DatePicker'

interface NotificationItem {
  id: string;
  admin?: string;
  text?: string;
  body?: string;
  created_at?: string;
  reminder_time?: string;
}

interface NotificationBoxProps {
  item: NotificationItem;
  onEdit?: (id: string, newText: string) => void;
  onDelete?: (id: string) => void;
}

export const ReminderBox: FC<NotificationBoxProps> = ({ item, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editText, setEditText] = useState(item?.text || item?.body || '');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditText(item?.text || item?.body || '');
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleEditSave = () => {
    if (onEdit) {
      onEdit(item.id, editText);
    }
    setEditDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(item.id);
    }
    setDeleteDialogOpen(false);
  };

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
              {item?.reminder_time || '12:00 PM'}
            </Typography>
          </Box>

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
          <Tooltip title='Eslatma yanatilgan sanasi'>
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
                {/*{getFormatDate(String(item?.created_at), 'dd MMMM yyyy', true)}*/}
                {item?.created_at}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Eslatmani tahrirlash</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FormControl fullWidth sx={{ marginTop: 4 }}>
            <DatePicker
              label="Eslatish vaqti"
              views={['day']}
              format='dd/MM/yyyy'
              disablePast={true}
              showTimeSelect={true}
              value={reminderDate}
              onChange={(newValue) => setReminderDate(newValue)}
            />
          </FormControl>

          <FormControl fullWidth>
            <TextField
              fullWidth
              multiline
              rows={4}
              label='Eslama matni'
              value={editText}
              onChange={e => setEditText(e.target.value)}
              margin='normal'
              variant='outlined'
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Bekor qilish</Button>
          <Button onClick={handleEditSave} color='primary' variant='contained'>
            Saqlash
          </Button>
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
          <Button onClick={handleDeleteConfirm} color='error' variant='outlined'>
            Ha
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
};
