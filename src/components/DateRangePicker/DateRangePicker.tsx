import { DateRangePicker as DateRangeP } from 'rsuite'
import { Box, Typography, FormHelperText } from '@mui/material'
import { DateRange } from 'rsuite/esm/DateRangePicker'
import { FC } from 'react'

type Props = {
  label?: string
  value: DateRange | null
  onChange: (value: DateRange | null) => void
  error?: boolean
  format?: string
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

export const DateRangePicker: FC<Props> = ({
  label = 'Date Range',
  value,
  onChange,
  format = 'dd/MM/yyyy',
  error = false,
  placement = 'bottomStart',
  helperText = '',
  disabled = false,
  placeholder = 'Select date range',
  style = {}
}) => {
  return (
    <Box width='100%'>
      <DateRangeP
        value={value}
        placement={placement}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        appearance='default'
        cleanable
        format={format}
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
