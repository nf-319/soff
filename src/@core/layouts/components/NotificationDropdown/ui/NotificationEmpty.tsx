'use client'

import { Box, Typography, Link } from '@mui/material'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { alpha } from '@mui/material/styles'

const NotificationEmpty = () => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        py: 6,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          mb: 2,
          p: 2.5,
          borderRadius: '50%',
          backgroundColor: theme => alpha(theme.palette.primary.main, 0.12),
          color: 'primary.main',
        }}
      >
        <Bell size={38} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        {t('Xabarnomalar mavjud emas')}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 4, color: 'text.secondary', maxWidth: '280px' }}
      >
        {t("Hozircha sizda yangi xabarnomalar mavjud emas. Yangi xabarnomalar kelganda shu yerda ko'rsatiladi.")}
      </Typography>
      <Link href="/notifications" underline="hover" color="primary.main" sx={{ fontWeight: 500 }}>
        Barcha xabarnomalarni ko'rish
      </Link>
    </Box>
  )
}

export default NotificationEmpty
