'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'

const CustomEditor = dynamic(() => import('src/components/ckeditor'), {
  ssr: false,
  loading: () => <p>Yuklanmoqda</p>
})

const AddNotification = () => {
  const router = useRouter()

  return (
    <div className='p-4 space-y-4'>
      <Button sx={{display:'flex',gap:2}} variant='contained' onClick={() => router.back()}>
        <ArrowLeft  />
        Ortga
      </Button>

      <CustomEditor />
    </div>
  )
}

export default AddNotification
