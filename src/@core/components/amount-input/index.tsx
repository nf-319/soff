import { TextField, TextFieldProps } from '@mui/material'
import { ChangeEvent, useState } from 'react'

export const formatAmount = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const revereAmount = (value: string) => {
  return `${value}`.replace(/\s+/g, '')
}

export default function AmountInput({ onChange, value, ...props }: TextFieldProps) {
  const [inputValue, setInputValue] = useState<string>(formatAmount(`${value || ''}`))

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value.replace(/\D/g, '')
    setInputValue(formatAmount(rawValue))

    onChange?.({
      target: { name: props.name, value: rawValue }
    } as ChangeEvent<HTMLInputElement>)
  }

  return <TextField {...props} onChange={handleChange} value={inputValue} autoComplete='off' />
}
