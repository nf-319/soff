'use client'

import { Box, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyContent } from 'src/components/empty-content'
import { ChevronLeft } from 'lucide-react'
import { NotificationItemType } from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { useNotifications } from 'src/hooks/useNotification'

export default function Notifications() {
  const { t } = useTranslation()
  const { back } = useRouter()
  const { data, refetch } = useNotifications()
  useEffect(() => {
    ;(async function () {
      if (!window.location.hostname.split('.').includes('c-panel')) {
        await refetch()
      }
    })()
  }, [])

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        className='groups-page-header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={back} color='primary'>
            <ChevronLeft />
          </IconButton>
          <Typography variant='h5'>{t('Xabarnomalar')}</Typography>
        </Box>
      </Box>
      {data?.results?.length ? (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center'
          }}
        >
          {data?.results?.map((element: NotificationItemType) => (
            <Box
              key={element.id}
              sx={{
                maxWidth: '100%',
                width:'100%',
                bgcolor: '#E0E0E0',
                p: 5,
                borderRadius: 2,
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                {element.notification.title}
              </Typography>

              <Typography variant='body2' sx={{ textAlign: 'center', mt: 2, width: '100%', borderRadius: '8px' }}>
                <div style={{width:'100%'}} dangerouslySetInnerHTML={{ __html: element.notification.body }} />
              </Typography>

              <Typography variant='caption' sx={{ color: 'black', marginTop: 2 }}>
                {element.notification.created_at}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <EmptyContent />
      )}
    </Box>
  )
}
