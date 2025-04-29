import { Button, Tooltip } from '@mui/material'
import { VscodeIconsFileTypeExcel2 } from './ExcelIcon'
import api from '../../@core/utils/api'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ExcelProps {
  queryString?: string
  tooltip?: string
  url: string
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  size?: 'small' | 'medium' | 'large'
  args?: any
}

export default function ExcelStudents({
  queryString = '',
  variant = 'outlined',
  tooltip = '',
  color = 'success',
  size = 'small',
  url,
  ...args
}: ExcelProps) {
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState('')
  const {t} = useTranslation()
  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await api.get(`${url}?${queryString}&export=true`)
      const { download_url } = response.data
      setLink(download_url)
      if (download_url) {
        window.open('https://' + download_url, '_blank')
      } else {
        console.error('No download URL provided by the backend')
      }
    } catch (error) {
      console.error('Failed to download the file:', error)
    }
    setLoading(false)
  }

  return (
    <LoadingButton
      loading={loading}
      onClick={handleDownload}
      startIcon={!loading && <VscodeIconsFileTypeExcel2 />}
      {...args}
      variant={variant}
      size={size}
      color={color}
      fullWidth
    >
      <Tooltip title={t(tooltip)}>
        <span>Excel</span>
      </Tooltip>
    </LoadingButton>
  )
}
