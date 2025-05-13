'use client'

import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { IconButton, InputAdornment, TextFieldProps, Box, Stack } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { isValid, set } from 'date-fns'
import { FC, useState, useMemo, useEffect } from 'react'

type Props = {
  label: string
  value: Date | null
  onChange: (date: Date | null) => void
  views?: DatePickerProps<Date>['views']
  format?: string
  disableFuture?: boolean
  disablePast?: boolean
  size?: TextFieldProps['size']
  fullWidth?: boolean
  placeholder?: string
  shrinkLabel?: boolean
  showTimeSelect?: boolean
}

export const DatePicker: FC<Props> = ({
  label,
  value,
  onChange,
  views = ['month', 'year'],
  format,
  disableFuture = false,
  disablePast = false,
  size = 'small',
  fullWidth = false,
  placeholder,
  shrinkLabel = true,
  showTimeSelect = false
}) => {
  const [internalDate, setInternalDate] = useState<Date | null>(value)
  const [hasTimeSet, setHasTimeSet] = useState<boolean>(false)

  const dateFormat = useMemo(() => {
    if (format) return format
    return showTimeSelect ? 'dd/MM/yyyy HH:mm' : 'MM/yyyy'
  }, [format, showTimeSelect])

  useEffect(() => {
    setInternalDate(value)
    if (value) {
      const hours = value.getHours()
      const minutes = value.getMinutes()
      setHasTimeSet(hours !== 0 || minutes !== 0)
    } else {
      setHasTimeSet(false)
    }
  }, [value])

  const handleDateChange = (date: Date | null) => {
    if (!date || !isValid(date)) {
      setInternalDate(null)
      onChange(null)
      setHasTimeSet(false)
    } else {
      if (internalDate && showTimeSelect && hasTimeSet) {
        const newDate = set(date, {
          hours: internalDate.getHours(),
          minutes: internalDate.getMinutes()
        })
        setInternalDate(newDate)
        onChange(newDate)
      } else {
        const newDate = set(date, {
          hours: 0,
          minutes: 0
        })
        setInternalDate(newDate)
        onChange(newDate)
      }
    }
  }

  const handleTimeChange = (time: Date | null) => {
    if (!time || !isValid(time)) return

    if (internalDate) {
      const newDateTime = set(internalDate, {
        hours: time.getHours(),
        minutes: time.getMinutes()
      })
      setInternalDate(newDateTime)
      onChange(newDateTime)
      setHasTimeSet(true)
    } else {
      const today = new Date()
      const newDateTime = set(today, {
        hours: time.getHours(),
        minutes: time.getMinutes()
      })
      setInternalDate(newDateTime)
      onChange(newDateTime)
      setHasTimeSet(true)
    }
  }

  const clearDate = () => {
    setInternalDate(null)
    onChange(null)
    setHasTimeSet(false)
  }

  const commonInputProps = {
    size,
    placeholder,
    InputLabelProps: {
      shrink: shrinkLabel,
      sx: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%'
      },
      title: label
    },
    InputProps: internalDate
      ? {
          endAdornment: (
            <InputAdornment position='end' sx={{ marginRight: '-12px' }}>
              <IconButton size='small' onClick={clearDate} sx={{ padding: '6px' }}>
                <ClearIcon fontSize='medium' />
              </IconButton>
            </InputAdornment>
          )
        }
      : {}
  }

  const timePickerValue = useMemo(() => {
    if (internalDate && hasTimeSet) return internalDate
    return null
  }, [internalDate, hasTimeSet])

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {showTimeSelect ? (
        <Stack direction='row' spacing={2} sx={{ width: fullWidth ? '100%' : 'auto' }}>
          <Box sx={{ flexGrow: 1, minWidth: '140px' }}>
            <MuiDatePicker
              label={label}
              value={internalDate}
              onChange={handleDateChange}
              views={views}
              format={dateFormat}
              disableFuture={disableFuture}
              disablePast={disablePast}
              slotProps={{
                textField: {
                  ...commonInputProps,
                  fullWidth: true
                }
              }}
            />
          </Box>
          <Box sx={{ width: '120px' }}>
            <MobileTimePicker
              label='Vaqt'
              value={timePickerValue}
              onChange={handleTimeChange}
              ampm={false}
              disabled={!internalDate}
              closeOnSelect={true}
              disableFuture={disableFuture}
              disablePast={disablePast}
              slotProps={{
                textField: {
                  ...commonInputProps,
                  fullWidth: true,
                  InputLabelProps: {
                    ...commonInputProps.InputLabelProps,
                    title: 'Vaqt'
                  }
                },
                actionBar: {
                  actions: ['accept']
                }
              }}
            />
          </Box>
        </Stack>
      ) : (
        <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
          <MuiDatePicker
            label={label}
            value={internalDate}
            onChange={handleDateChange}
            views={views}
            format={dateFormat}
            disableFuture={disableFuture}
            disablePast={disablePast}
            slotProps={{
              textField: {
                ...commonInputProps,
                fullWidth
              }
            }}
          />
        </Box>
      )}
    </LocalizationProvider>
  )
}
