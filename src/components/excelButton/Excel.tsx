'use client'

import { Button, Tooltip } from '@mui/material'
import { VscodeIconsFileTypeExcel2 } from './ExcelIcon'
import { useTranslation } from 'react-i18next'

interface ExcelProps {
  queryString?: string
  tooltip?: string
  url?: string
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  size?: 'small' | 'medium' | 'large'
  onClick?: VoidFunction
  baseURL?: string
  args?: any
  disabled?: boolean
  notBlank?: boolean
  useLink?: boolean
}

export default function Excel({
  queryString = '',
  tooltip = '',
  notBlank = false,
  variant = 'outlined',
  color = 'success',
  onClick,
  size = 'medium',
  disabled = false,
  baseURL,
  url,
  useLink = true,
  ...args
}: ExcelProps) {
  const { t } = useTranslation()

  const href = disabled ? '#' : baseURL || (url ? `${url}${queryString ? `?${queryString}` : ''}` : '#')

  const ButtonElement = (
    <Tooltip title={t(tooltip)}>
      <span>
        <Button
          fullWidth
          startIcon={<VscodeIconsFileTypeExcel2 />}
          {...args}
          variant={variant}
          disabled={disabled}
          onClick={onClick}
          color={color}
          size={size}
        >
          Excel
        </Button>
      </span>
    </Tooltip>
  )

  if (useLink && !disabled) {
    return (
      <a href={href} download target={notBlank ? '' : '_blank'} style={{ width: '100%', textDecoration: 'none' }}>
        {ButtonElement}
      </a>
    )
  }

  return ButtonElement
}
