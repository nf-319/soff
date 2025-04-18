import { DateValidationError } from '@mui/x-date-pickers'

export type DatePickerProps = {
  label: string
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disablePast?: boolean
  disableFuture?: boolean
  slotProps?: {
    textField?: Record<string, any>
  }
  onError?: (error: DateValidationError) => void
}
