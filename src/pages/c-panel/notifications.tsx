'use client'

import { Box, Button } from '@mui/material'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import React from 'react'

const Notifications = () => {
  const router = useRouter()
  return (
    <Box display={'flex'} justifyContent={'end'}>
      <Button startIcon={<Plus size={16}/>}  onClick={() => router.push('/c-panel/add-notification')} variant='contained'>
        Xabarnoma qo'shish
      </Button>
    </Box>
  )
}

export default Notifications
