'use client'

import { DatePicker as MuiDatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
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
  size?: TextFieldProps['size']
  fullWidth?: boolean
  placeholder?: string
  shrinkLabel?: boolean
}

export const DatePicker: FC<Props> = ({
  label,
  value,
  onChange,
  views = ['month', 'year'],
  format = 'MM/yyyy',
  disableFuture = false,
  size = 'small',
  fullWidth = false,
  placeholder,
  shrinkLabel = true
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        label={label}
        value={internalDate}
        onChange={handleChange}
        views={views}
        format={format}
        disableFuture={disableFuture}
        slotProps={{
          textField: {
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
                    <InputAdornment position='end'>
                      <IconButton size='small' onClick={clearDate}>
                        <ClearIcon fontSize='small' />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              : {}
          }
        }}
      />
    </LocalizationProvider>
  )
}
