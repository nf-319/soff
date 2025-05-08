'use client'

import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { IconButton, InputAdornment, TextFieldProps, Box, Stack } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { isValid, set } from 'date-fns'
import { FC, useState, useMemo } from 'react'

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

  const dateFormat = useMemo(() => {
    if (format) return format
    return showTimeSelect ? 'dd/MM/yyyy' : 'MM/yyyy'
  }, [format, showTimeSelect])

  const handleDateChange = (date: Date | null) => {
    if (!date || !isValid(date)) {
      setInternalDate(null)
      onChange(null)
    } else {
      if (internalDate && showTimeSelect) {
        const newDate = set(date, {
          hours: internalDate.getHours(),
          minutes: internalDate.getMinutes()
        })
        setInternalDate(newDate)
        onChange(newDate)
      } else {
        setInternalDate(date)
        onChange(date)
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
    } else {
      setInternalDate(time)
      onChange(time)
    }
  }

  const clearDate = () => {
    setInternalDate(null)
    onChange(null)
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {showTimeSelect ? (
        <Stack direction='row' spacing={2} sx={{ width: fullWidth ? '100%' : 'auto' }}>
          <Box sx={{ flexGrow: 1, minWidth: '140px' }}>
            <MuiDatePicker
              label={label}
              value={internalDate}
              onChange={handleDateChange}
              views={['day', 'month', 'year']}
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
              value={internalDate}
              onChange={handleTimeChange}
              ampm={false}
              disabled={true}
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
