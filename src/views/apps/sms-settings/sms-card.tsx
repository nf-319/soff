import React, { FC, useRef, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Switch,
  TextField,
  Typography,
  Button,
  Stack,
  alpha, Tooltip
} from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'

type PlaceholderType = {
  label: string
  value: string
  color: string
  placeholder: string
}

type Props = {
  companyInfo: any
  loading: boolean
  updateSettings: (key: string, value: any) => Promise<void>
  defaultValue?: string
  placeholders: PlaceholderType[]
}

export const SmsCard: FC<Props> = ({ companyInfo, loading, updateSettings, defaultValue = '', placeholders }) => {
  const [value, setValue] = useState(defaultValue)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [editable, setEditable] = useState(false)

  const handlePlaceholderInsert = (placeholder: string) => {
    if (textAreaRef.current) {
      const startPos = textAreaRef.current.selectionStart
      const endPos = textAreaRef.current.selectionEnd
      const newValue = value.substring(0, startPos) + placeholder + value.substring(endPos)

      setValue(newValue)

      setTimeout(() => {
        textAreaRef.current?.setSelectionRange(startPos + placeholder.length, startPos + placeholder.length)
        textAreaRef.current?.focus()
      }, 0)
    }
  }

  const handleSave = async () => {
    if (!editable) {
      setEditable(true)
      return
    }
    await updateSettings('birthday_text', value)
    setEditable(false)
  }

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography sx={{ flexGrow: 1 }}>Tug'ilgan kunda sms bilan tabriklash:</Typography>
          <Switch
            checked={Boolean(companyInfo?.auto_sms?.on_birthday)}
            onChange={async (_, checked) => {
              await updateSettings('on_birthday', checked)
            }}
          />
        </Box>

        <Typography variant='caption' sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          Xabar matniga dinamik ma'lumotlarni qo'shish uchun quyidagi buttonlardan foydalaning
        </Typography>

        <Box component='div' display='flex' alignItems='center' justifyContent='space-between' marginBottom={2}>
          <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {placeholders.map((placeholder, index) => (
              <Tooltip key={`${placeholder.label}-${index}`} title={placeholder.placeholder} placement='top'>
                <Button
                  key={placeholder.value}
                  variant='contained'
                  disabled={!editable}
                  color={placeholder.color as any}
                  size='small'
                  onClick={() => handlePlaceholderInsert(placeholder.value)}
                  sx={{ textTransform: 'none', boxShadow: 'none' }}
                >
                  {placeholder.label}
                </Button>
              </Tooltip>
            ))}
          </Stack>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {editable && (
              <Button variant='outlined' color='secondary' onClick={() => setEditable(false)}>
                Bekor qilish
              </Button>
            )}

            <Button variant='contained' color='primary' onClick={handleSave} disabled={loading}>
              {editable ? 'Saqlash' : 'Tahrirlash'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <TextField
            inputRef={textAreaRef}
            multiline
            rows={4}
            fullWidth
            variant='outlined'
            value={value}
            disabled={!editable}
            onChange={e => setValue(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              readOnly: !editable,
              sx: {
                '& .MuiInputBase-input': {
                  WebkitTextFillColor: 'inherit'
                }
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default SmsCard
