'use client'

import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { IconButton, InputAdornment, TextFieldProps } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { isValid } from 'date-fns'
import { FC, useState } from 'react'

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
  format = 'MM/yyyy',
  disableFuture = false,
  disablePast = false,
  size = 'small',
  fullWidth = false,
  placeholder,
  shrinkLabel = true,
  showTimeSelect = false
}) => {
  const [internalDate, setInternalDate] = useState<Date | null>(value)

  const handleChange = (date: Date | null) => {
    if (!date || !isValid(date)) {
      setInternalDate(null)
      onChange(null)
    } else {
      setInternalDate(date)
      onChange(date)
    }
  }

  const clearDate = () => {
    setInternalDate(null)
    onChange(null)
  }

  const inputProps = {
    fullWidth,
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
        <MuiDateTimePicker
          label={label}
          value={internalDate}
          onChange={handleChange}
          format={format}
          disableFuture={disableFuture}
          disablePast={disablePast}
          slotProps={{
            textField: inputProps
          }}
        />
      ) : (
        <MuiDatePicker
          label={label}
          value={internalDate}
          onChange={handleChange}
          views={views}
          format={format}
          disableFuture={disableFuture}
          disablePast={disablePast}
          slotProps={{
            textField: inputProps
          }}
        />
      )}
    </LocalizationProvider>
  )
}
