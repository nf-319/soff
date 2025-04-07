'use client'

import { FC, useRef, useState, useEffect } from 'react'
import { PlaceholdersButtonsAreaTypes } from 'src/types'
import { Alert, AlertProps, Box, Button, ButtonProps, Chip, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { ChipProps } from '@mui/material/Chip'

type Props = {
  value: string
  editable: boolean
  loading: boolean
  handleChange: () => Promise<void>
  setEditable: (newEditable: boolean) => void
  placeholders: PlaceholdersButtonsAreaTypes[]
  defaultValue: string
  alert?: string
  companyName?: string
  handleCancel?: () => void
  shortDescription?: string
  severity?: AlertProps['severity']
  onChange: (value: string) => void
}

export const TextAreaWithPlaceholders: FC<Props> = ({
  value,
  shortDescription,
  editable,
  setEditable,
  alert,
  handleCancel,
  severity = 'info',
  handleChange,
  loading,
  companyName,
  placeholders,
  defaultValue,
  onChange
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [wasCompanyNameRemoved, setWasCompanyNameRemoved] = useState(false)

  const convertAPItoUIFormat = (text: string) => {
    if (!text) return ''
    let result = text
    placeholders.forEach(p => {
      const regex = new RegExp(escapeRegExp(p.value), 'g')
      result = result.replace(regex, p.displayValue)
    })
    return result
  }

  const initialDisplayValue =
    !defaultValue || defaultValue.trim() === ''
      ? companyName && !wasCompanyNameRemoved
        ? `${companyName}: `
        : ''
      : convertAPItoUIFormat(defaultValue)

  const [displayValue, setDisplayValue] = useState(initialDisplayValue)
  const [prevDisplayValue, setPrevDisplayValue] = useState(displayValue)

  useEffect(() => {
    if (!editable) {
      const newValue = value || defaultValue
      const formattedValue =
        !newValue || newValue.trim() === ''
          ? companyName && !wasCompanyNameRemoved
            ? `${companyName}: `
            : ''
          : convertAPItoUIFormat(newValue)

      setDisplayValue(formattedValue)
      setPrevDisplayValue(formattedValue)
    }
  }, [value, defaultValue, editable, placeholders, companyName])

  function escapeRegExp(string: string): string {
    return string?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function findAllPlaceholdersInText(text: string): {
    placeholder: PlaceholdersButtonsAreaTypes
    index: number
    length: number
  }[] {
    const result: {
      placeholder: PlaceholdersButtonsAreaTypes
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

  function convertToApiText(text: string): string {
    if (!text) return ''
    let result = text

    placeholders.forEach(p => {
      const regex = new RegExp(escapeRegExp(p.displayValue), 'g')
      result = result.replace(regex, p.value)
    })
    return result
  }

  const handleValueChange = (newDisplayValue: string) => {
    if (
      companyName &&
      prevDisplayValue.startsWith(`${companyName}: `) &&
      !newDisplayValue.startsWith(`${companyName}: `)
    ) {
      setWasCompanyNameRemoved(true)
    }

    const placeholdersInPrev = findAllPlaceholdersInText(prevDisplayValue)

    if (Math.abs(newDisplayValue?.length - prevDisplayValue?.length) > 10) {
      setDisplayValue(newDisplayValue)
      onChange(convertToApiText(newDisplayValue))
      setPrevDisplayValue(newDisplayValue)
      return
    }

    let isValid = true
    let modifiedText = newDisplayValue

    for (let i = placeholdersInPrev?.length - 1; i >= 0; i--) {
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
      onChange(convertToApiText(modifiedText))
      setPrevDisplayValue(modifiedText)

      setTimeout(() => {
        if (textAreaRef.current) {
          const pos = modifiedText.length
          textAreaRef.current.setSelectionRange(pos, pos)
        }
      }, 0)
    } else {
      setDisplayValue(newDisplayValue)
      onChange(convertToApiText(newDisplayValue))
      setPrevDisplayValue(newDisplayValue)
    }
  }

  const handlePlaceholderInsert = (placeholder: PlaceholdersButtonsAreaTypes) => {
    if (textAreaRef.current) {
      const startPos = textAreaRef.current.selectionStart
      const endPos = textAreaRef.current.selectionEnd

      const placeholderText = placeholder.displayValue
      const newDisplayValue = displayValue?.substring(0, startPos) + placeholderText + displayValue?.substring(endPos)
      handleValueChange(newDisplayValue)

      setTimeout(() => {
        textAreaRef.current?.setSelectionRange(startPos + placeholderText.length, startPos + placeholderText.length)
        textAreaRef.current?.focus()
      }, 0)
    }
  }

  const renderTextWithPlaceholders = () => {
    if (!value && !defaultValue && companyName && !wasCompanyNameRemoved) return `${companyName}: `
    if (!value) return defaultValue || ''

    return value.split(/(\$\{(?:group|balance|first_name|reason|score|amount|date)})/).map((part, index) => {
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

  const handleClose = () => {
    if (handleCancel) {
      handleCancel()
      return
    }

    const resetValue =
      !defaultValue || defaultValue.trim() === ''
        ? companyName && !wasCompanyNameRemoved
          ? `${companyName}: `
          : ''
        : convertAPItoUIFormat(defaultValue)

    setDisplayValue(resetValue)
    onChange(convertToApiText(resetValue)) // Reset qiymatni API ga yuboramiz
    setEditable(false)
  }

  return (
    <Box>
      {shortDescription && (
        <Typography variant='caption' sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          {shortDescription}
        </Typography>
      )}

      {alert && (
        <Alert severity={severity} sx={{ mb: 2 }}>
          Eslatma: {alert}
        </Alert>
      )}

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
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Bekor qilish
            </Button>
          )}

          <Button variant='contained' color='primary' onClick={handleChange} disabled={loading}>
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
              border: '1px solid rgba(0,0,0,0.20)',
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
    </Box>
  )
}
