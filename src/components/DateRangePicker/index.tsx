import React from 'react'
import { DateRangePicker } from 'rsuite'
import { Box, Typography, FormHelperText } from '@mui/material'
import { DateRange } from 'rsuite/esm/DateRangePicker'



interface MuiStyleDateRangePickerProps {
  label?: string
  value: DateRange | null
  onChange: (value: DateRange | null) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  placeholder?: string
  style?: React.CSSProperties
  placement?:
    | 'auto'
    | 'topStart'
    | 'topEnd'
    | 'bottomStart'
    | 'bottomEnd'
    | 'leftStart'
    | 'leftEnd'
    | 'rightStart'
    | 'rightEnd'
}

const MuiStyleDateRangePicker: React.FC<MuiStyleDateRangePickerProps> = ({
  label = 'Date Range',
  value,
  onChange,
  error = false,
  placement = 'bottomStart',
  helperText = '',
  disabled = false,
  placeholder = 'Select date range',
  style = {}
}) => {
  return (
    <Box width='100%'>
      <DateRangePicker
        value={value}
        placement={placement}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        appearance='default'
        cleanable
        format='yyyy-MM-dd'
        isoWeek
        showOneCalendar
        style={{
          borderRadius: 8,
          width: '100%',
          fontSize: 14,
          backgroundColor: disabled ? '#f5f5f5' : '#fff',
          boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.1)',
          ...style
        }}
      />

      {error && <FormHelperText sx={{ color: '#d32f2f', mt: 0.5 }}>{helperText}</FormHelperText>}
    </Box>
  )
}

export default MuiStyleDateRangePicker
