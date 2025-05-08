'use client'

import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox
} from '@mui/material'
import { useGetListClient, usePostNotification } from './api/notification'
import { Editor } from 'src/components/Editor'
import { Notification } from 'src/widgets/Notification'
import useDebounce from 'src/hooks/useDebounce'
import { toast } from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import Chip from '@components/mui/chip'
import ListItemText from '@mui/material/ListItemText'
import { NOTIFICATIONS_HTML_TEMPLATE, receiverRoles } from '@/views/apps/c-panel/CreateNotifications/constants'

const CreateNotification: FC = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(NOTIFICATIONS_HTML_TEMPLATE)
  const [receivers, setReceivers] = useState<string[]>([])
  const [tenant, setTenant] = useState<number | ''>('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  const { mutate, isPending } = usePostNotification()
  const {
    data: clientsData,
    isLoading,
    refetch
  } = useGetListClient({
    search: debouncedSearch,
    page: 1
  })

  useEffect(() => {
    if (open && debouncedSearch !== undefined) {
      void refetch()
    }
  }, [debouncedSearch, open, refetch])

  const tenantOptions =
    clientsData?.results?.map((client: any) => ({
      label: client.name,
      value: client.id
    })) || []

  const handleDropdownOpen = () => {
    setOpen(true)
    void refetch()
  }

  const handleTenantChange = (_: any, newValue: any) => {
    setSelectedTenant(newValue)
    if (newValue) {
      setTenant(newValue.value)
    } else {
      setTenant('')
    }
  }

  const handleSearchChange = (_: any, newValue: string) => {
    setSearchQuery(newValue)
  }

  const handleSubmit = async () => {
    mutate(
      {
        title,
        body: content,
        receivers: receivers.map(item => item.toUpperCase()),
        tenant: tenant || undefined
      },
      {
        onSuccess: async () => {
          setIsConfirmOpen(false)
          toast.success('Muvofaqiyatli yuborildi!')
          await queryClient.refetchQueries({ queryKey: ['all-notification'] })
          await router.push('/c-panel/notifications')
        }
      }
    )
  }

  const handleCancel = () => {
    setTitle('')
    setContent('')
    setReceivers([])
    setIsConfirmOpen(false)
    setTenant('')
    setSelectedTenant(null)
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1000px', mx: 'auto' }}>
      <Typography variant='h4' sx={{ fontWeight: 700, mb: 4 }}>
        Yangi Xabarnoma Yaratish
      </Typography>

      <TextField
        fullWidth
        label='Sarlavha'
        value={title}
        onChange={e => setTitle(e.target.value)}
        sx={{
          mb: 3
        }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id='receivers-label'>Qabul qiluvchilar</InputLabel>
        <Select
          label='Qabul qiluvchilar'
          multiple
          value={receivers}
          onChange={e => setReceivers(e.target.value as string[])}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(value => (
                <Chip
                  key={value}
                  onMouseDown={e => e.stopPropagation()}
                  label={receiverRoles.find(r => r.value === value)?.label || value}
                  onDelete={() => {
                    setReceivers(prev => prev.filter(item => item !== value))
                  }}
                  deleteIcon={<CloseIcon />}
                />
              ))}
            </Box>
          )}
          MenuProps={{
            disableAutoFocusItem: true
          }}
        >
          {receiverRoles.map(role => (
            <MenuItem key={role.value} value={role.value}>
              <Checkbox checked={receivers.indexOf(role.value) > -1} />
              <ListItemText primary={role.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <Autocomplete
          id='tenant-autocomplete'
          open={open}
          onOpen={handleDropdownOpen}
          onClose={() => setOpen(false)}
          options={tenantOptions}
          value={selectedTenant}
          onChange={handleTenantChange}
          onInputChange={handleSearchChange}
          getOptionLabel={option => option.label || ''}
          isOptionEqualToValue={(option, value) => option?.value === value?.value}
          loading={isLoading}
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          autoHighlight
          renderInput={params => (
            <TextField
              {...params}
              label="O'quv markazga yuborish"
              placeholder='Qidirish...'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          noOptionsText='Natija topilmadi'
          loadingText='Yuklanmoqda...'
          fullWidth
        />
      </FormControl>

      <Editor
        value={content}
        onChange={(val: string) => setContent(val)}
        isDisabled={false}
      />

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant='outlined' size='medium' onClick={() => setIsPreviewOpen(true)} disabled={!title || !content}>
          Xabarnomani ko'rish
        </Button>
        <Button
          variant='contained'
          size='medium'
          onClick={() => setIsConfirmOpen(true)}
          disabled={isPending || !title || !content}
        >
          Xabarnomani Yuborish
        </Button>
      </Box>

      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth='md'
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>
          <Typography variant='h5'>Xabarnoma Ko'rinishi</Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Notification title={title} content={content} isRead={false} created_at={new Date()} />
        </DialogContent>

        <DialogActions sx={{ p: 4, marginTop: 4 }}>
          <Button variant='outlined' onClick={() => setIsPreviewOpen(false)}>
            Yopish
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        maxWidth='md'
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>
          <Typography variant='h5'>Yuborishni tasdiqlang!</Typography>
          <Typography variant='body2'>
            Iltimos Xabarnomani tekshirib yuboring, Xabarnoma yuborilgandan keyin, o'zgartirib bo'lmaydi!
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Notification title={title} content={content} isRead={false} created_at={new Date()} />
        </DialogContent>

        <DialogActions sx={{ p: 4 }}>
          <Button variant='outlined' onClick={handleCancel}>
            Bekor qilish
          </Button>

          <Button onClick={handleSubmit} variant='contained' disabled={isPending}>
            Tasdiqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CreateNotification
