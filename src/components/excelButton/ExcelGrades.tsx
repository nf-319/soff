import { Button } from '@mui/material'
import { VscodeIconsFileTypeExcel2 } from './ExcelIcon'
import api from '../../@core/utils/api'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'
import Link from 'next/link'

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
  width = 370,
  size = 'small',
  url,
  ...args
}: ExcelProps) {
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState('')
  const handleDownload = async () => {
    setLoading(true)
    try {
      const response = await api.get(`${url}`)
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
      sx={{ width: width }}
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
