import { Button, Tooltip } from '@mui/material'
import Link from 'next/link'
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
}

export default function Excel({
  queryString = '',
  tooltip = '',
  variant = 'outlined',
  color = 'success',
  onClick,
  size = 'small',
  baseURL,
  url,
  ...args
}: ExcelProps) {
  const { t } = useTranslation()
  const subdomain = location.hostname.split('.')
  const staticBaseURL =
    process.env.NODE_ENV === 'development'
      ? `${process.env.NEXT_PUBLIC_TEST_BASE_URL}/v1/`
      : subdomain.length < 3
      ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
      : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/`

  return (
    <Link
      href={baseURL || staticBaseURL  + `${url}?` + queryString}
      download
      target={'_blank'}
      style={{
        width: '100%'
      }}
    >
      <Button
        fullWidth
        startIcon={<VscodeIconsFileTypeExcel2 />}
        {...args}
        variant={variant}
        onClick={onClick}
        color={color}
        size={'medium'}
      >
        <Tooltip title={t(tooltip)}>
          <span>Excel</span>
        </Tooltip>
      </Button>
    </Link>
  )
}
