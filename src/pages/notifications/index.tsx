'use client'

import { Box, BoxProps, IconButton, styled, Typography, TypographyProps } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyContent } from 'src/components/empty-content'
import { useAppDispatch, useAppSelector } from 'src/store'
import { fetchNotification } from 'src/store/apps/user'
import { ChevronLeft } from 'lucide-react'
import useNotificationStore from 'src/store/apps/notification'
import { NotificationItemType } from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { useNotifications } from 'src/hooks/useNotification'
import useResponsive from 'src/@core/hooks/useResponsive'
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import 'dayjs/locale/uz'

dayjs.extend(relativeTime)
dayjs.locale('uz')

export default function Notifications() {
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
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
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        className='groups-page-header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          px: 3,
          // backgroundColor: '#fafafa',
          borderBottom: '1px solid #ddd'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={back} color='primary' sx={{ padding: 1 }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant='h5' sx={{ fontWeight: 600, color: '#333' }}>
            {t('Xabarnomalar')}
          </Typography>
        </Box>
      </Box>

      {data?.results.length ? (
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
                width: '100%',
                bgcolor: '#ffffff',
                p: 4,
                borderRadius: 1,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  cursor: 'pointer'
                },
                transition: 'box-shadow 0.3s ease'
              }}
            >
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{ mb: 2, borderBottom: '1px solid #e0e0e0', pb: 1 }}
              >
                <Typography variant='h6' sx={{ fontWeight: 500, color: '#444' }}>
                  {element.notification.title}
                </Typography>
                <Typography variant='caption' sx={{ color: '#888', fontSize: '0.75rem' }}>
                  {dayjs().diff(dayjs(element.notification.created_at), 'month') >= 1
                    ? dayjs(element.notification.created_at).format('DD.MM.YYYY HH:mm')
                    : dayjs(element.notification.created_at).fromNow()}
                </Typography>
              </Box>

              <Typography
                variant='body2'
                sx={{
                  textAlign: 'left',
                  color: '#444',
                  lineHeight: 1.6,
                  fontSize: '0.875rem',
                  '& p': { marginBottom: '1rem' }
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: element.notification.body
                  }}
                />
              </Typography>

              {element?.is_read == true && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#4CAF50'
                    }}
                  />
                  <Typography variant='caption' sx={{ color: '#555', ml: 1 }}>
                    {t('Yangi Xabar')}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <EmptyContent />
      )}
    </Box>
  )
}
