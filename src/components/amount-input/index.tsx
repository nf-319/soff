import { TextField, TextFieldProps } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react'

export const formatAmount = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const revereAmount = (value: string | undefined) => {
  if (!value || value === 'undefined') return undefined;
  return value.replace(/\s+/g, '');
};

export default function AmountInput({ onChange, value, ...props }: TextFieldProps) {
  const [inputValue, setInputValue] = useState<string>(
    value ? formatAmount(String(value)) : ''
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value.replace(/\D/g, '');
    setInputValue(rawValue ? formatAmount(rawValue) : '');

    onChange?.({
      target: { name: props.name, value: rawValue || '' },
    } as ChangeEvent<HTMLInputElement>);
  }

  useEffect(() => {
    setInputValue(value ? formatAmount(String(value)) : '');
  }, [value]);

  return <TextField {...props} onChange={handleChange} value={inputValue} autoComplete='off' />;
}
