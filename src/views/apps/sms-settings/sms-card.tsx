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
  Tooltip,
  Chip, ButtonProps
} from '@mui/material'
import { ChipProps } from '@mui/material/Chip'

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
  title: string
  subtitle: string
}

export const SmsCard: FC<Props> = ({
  companyInfo,
  loading,
  updateSettings,
  defaultValue = '',
  subtitle,
  title,
  placeholders
}) => {
  const [value, setValue] = useState(defaultValue)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [editable, setEditable] = useState(false)

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
  }

  const handlePlaceholderInsert = (placeholder: PlaceholderType) => {
    if (textAreaRef.current) {
      const startPos = textAreaRef.current.selectionStart
      const endPos = textAreaRef.current.selectionEnd
      const placeholderText = placeholder.value
      const newValue = value.substring(0, startPos) + placeholderText + value.substring(endPos)
      handleValueChange(newValue)

      setTimeout(() => {
        textAreaRef.current?.setSelectionRange(startPos + placeholderText.length, startPos + placeholderText.length)
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

  const renderTextWithPlaceholders = () => {
    return value.split(/(\$\{(?:group|balance|first_name|reason|score)})/g).map((part, index) => {
      const placeholder = placeholders.find(p => p.value === part)
      if (placeholder) {
        return (
          <Chip
            key={index}
            label={placeholder.label}
            color={placeholder.color as ChipProps['color']}
            size='small'
            sx={{ mx: 0.5, verticalAlign: 'middle' }}
          />
        )
      }
      return part
    })
  }

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography>{title}</Typography>

          <Switch
            checked={Boolean(companyInfo?.auto_sms?.on_birthday)}
            onChange={async (_, checked) => {
              await updateSettings('on_birthday', checked)
            }}
          />
        </Box>

        <Typography variant='caption' sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          {subtitle}
        </Typography>

        <Box component='div' display='flex' alignItems='center' justifyContent='space-between' marginBottom={2}>
          <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {placeholders.map((placeholder, index) => (
              <Tooltip key={`${placeholder.label}-${index}`} title={placeholder.placeholder} placement='top'>
                <Button
                  variant='contained'
                  disabled={!editable}
                  color={placeholder.color as ButtonProps['color']}
                  size='small'
                  onClick={() => handlePlaceholderInsert(placeholder)}
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
          {editable ? (
            <TextField
              inputRef={textAreaRef}
              multiline
              rows={4}
              fullWidth
              variant='outlined'
              value={value}
              onChange={e => handleValueChange(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          ) : (
            <Typography
              component='div'
              variant='body1'
              sx={{
                width: '100%',
                padding: '16.5px 14px',
                border: '1px solid rgba(0,0,0,0.23)',
                borderRadius: 1,
                minHeight: '125px'
              }}
            >
              {renderTextWithPlaceholders()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

