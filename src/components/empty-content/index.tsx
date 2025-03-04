import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  title?: string
}

export const EmptyContent: FC<Props> = ({ title = "Ma'lumot yo'q" }) => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: '300px',
        position: 'relative',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Image
        style={{ height: '80%', width: 'auto' }}
        src='/images/empty_state.png'
        width={800}
        height={600}
        alt='empty image'
      />

      <Typography sx={{ fontSize: '20px', fontWeight: '600' }} variant='body2'>
        {t(title)}
      </Typography>
    </Box>
  )
}

EmptyContent.displayName = 'EmptyContent'
