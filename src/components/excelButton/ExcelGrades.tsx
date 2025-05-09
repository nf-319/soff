import { VscodeIconsFileTypeExcel2 } from './ExcelIcon'
import api from 'src/@core/utils/api'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'

interface ExcelProps {
  queryString?: string
  width?: string | number
  url: string
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  size?: 'small' | 'medium' | 'large'
  args?: any
}

export default function ExcelGrades({
  queryString = '',
  variant = 'outlined',
  color = 'success',
  width = 'auto',
  size = 'small',
  url,
  ...args
}: ExcelProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await api.get(`${url}`)
      const { download_url } = response.data

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
      sx={{ width: width }}
      size={size}
      loading={loading}
      onClick={handleDownload}
      startIcon={!loading && <VscodeIconsFileTypeExcel2 />}
      {...args}
      variant={variant}
      color={color}
      fullWidth
    >
      Excel
    </LoadingButton>
  )
}
