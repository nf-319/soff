'use client'

import { FC, useRef, useState } from 'react'
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
  displayValue: string
  color: string
  placeholder: string
}

type Props = {
  loading: boolean
  updateSettings: (key: string, value: any) => Promise<void>
  defaultValue?: string
  placeholders: PlaceholderType[]
  title: string
  onSwitch: string
  onSwitchInfo: boolean
  subtitle: string
}

export const SmsCard: FC<Props> = ({
  onSwitchInfo,
  loading,
  updateSettings,
  defaultValue = '',
  subtitle,
  onSwitch,
  title,
  placeholders
}) => {
  const [value, setValue] = useState(defaultValue)
  const [displayValue, setDisplayValue] = useState(convertToDisplayText(defaultValue, placeholders))
  const [prevDisplayValue, setPrevDisplayValue] = useState(displayValue)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [editable, setEditable] = useState(false)

  function convertToDisplayText(text: string, placeholders: PlaceholderType[]): string {
    let result = text
    placeholders.forEach(p => {
      const regex = new RegExp(escapeRegExp(p.value), 'g')
      result = result.replace(regex, p.displayValue)
    })
    return result
  }

  function convertToApiText(text: string, placeholders: PlaceholderType[]): string {
    let result = text
    placeholders.forEach(p => {
      const regex = new RegExp(escapeRegExp(p.displayValue), 'g')
      result = result.replace(regex, p.value)
    })
    return result
  }

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function findAllPlaceholdersInText(text: string): {
    placeholder: PlaceholderType
    index: number
    length: number
  }[] {
    const result: {
      placeholder: PlaceholderType
      index: number
      length: number
    }[] = []

    placeholders.forEach(p => {
      let regex = new RegExp(escapeRegExp(p.displayValue), 'g')
      let match

      while ((match = regex.exec(text)) !== null) {
        result.push({
          placeholder: p,
          index: match.index,
          length: p.displayValue.length
        })
      }
    })

    return result.sort((a, b) => a.index - b.index)
  }

  const handleValueChange = (newDisplayValue: string) => {
    const placeholdersInPrev = findAllPlaceholdersInText(prevDisplayValue)

    if (Math.abs(newDisplayValue.length - prevDisplayValue.length) > 10) {
      setDisplayValue(newDisplayValue)
      setValue(convertToApiText(newDisplayValue, placeholders))
      setPrevDisplayValue(newDisplayValue)
      return
    }

    let isValid = true
    let modifiedText = newDisplayValue

    for (let i = placeholdersInPrev.length - 1; i >= 0; i--) {
      const p = placeholdersInPrev[i]
      const expectedText = p.placeholder.displayValue
      const actualTextInRegion = newDisplayValue.substring(p.index, p.index + p.length)

      if (
        actualTextInRegion !== expectedText &&
        actualTextInRegion.length > 0 &&
        (actualTextInRegion.includes(expectedText.substring(0, 3)) || expectedText.includes(actualTextInRegion))
      ) {
        if (actualTextInRegion.length < expectedText.length) {
          modifiedText =
            modifiedText.substring(0, p.index) + modifiedText.substring(p.index + actualTextInRegion.length)
        } else {
          modifiedText =
            modifiedText.substring(0, p.index) +
            expectedText +
            modifiedText.substring(p.index + actualTextInRegion.length)
        }

        isValid = false
      }
    }

    if (!isValid) {
      setDisplayValue(modifiedText)
      setValue(convertToApiText(modifiedText, placeholders))
      setPrevDisplayValue(modifiedText)

      setTimeout(() => {
        if (textAreaRef.current) {
          const pos = modifiedText.length
          textAreaRef.current.setSelectionRange(pos, pos)
        }
      }, 0)
    } else {
      setDisplayValue(newDisplayValue)
      setValue(convertToApiText(newDisplayValue, placeholders))
      setPrevDisplayValue(newDisplayValue)
    }
  }

  const handlePlaceholderInsert = (placeholder: PlaceholderType) => {
    if (textAreaRef.current) {
      const startPos = textAreaRef.current.selectionStart
      const endPos = textAreaRef.current.selectionEnd

      const placeholderText = placeholder.displayValue
      const newDisplayValue = displayValue.substring(0, startPos) + placeholderText + displayValue.substring(endPos)
      handleValueChange(newDisplayValue)

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
    await updateSettings(onSwitch, value)
    setEditable(false)
  }

  const renderTextWithPlaceholders = () => {
    return value.split(/(\$\{(?:group|balance|first_name|reason|score)})/).map((part, index) => {
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
            checked={onSwitchInfo}
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
              value={displayValue}
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
                minHeight: '125px',
                userSelect: 'none',
                cursor: 'not-allowed'
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
