import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'

const BoxWrapper = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  maxWidth: 500,
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}))

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 300,
  height: 300,
  margin: theme.spacing(4, 0),
  [theme.breakpoints.down('sm')]: {
    width: 200,
    height: 200
  }
}))

const Error404 = () => {
  return (
    <Box className='content-center' sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4, p: 2 }}>
      <BoxWrapper>
        <Typography variant='h1' sx={{ fontSize: '5rem', fontWeight: 700, color: 'primary.main', mb: 1 }}>
          404
        </Typography>
        <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 500 }}>
          Oops! Sahifa topilmadi ⚠️
        </Typography>
        <Typography variant='body2' sx={{ mb: 3, color: 'text.secondary' }}>
          Siz izlayotgan sahifa mavjud emas yoki o‘chirilgan.
        </Typography>
        <Button
          href='/'
          component={Link}
          variant='contained'
          color='primary'
          sx={{ textTransform: 'none', px: 4, py: 1.5, fontWeight: 500 }}
        >
          Bosh sahifaga qaytish
        </Button>
      </BoxWrapper>

      <ImageWrapper>
        <Image
          alt='error illustration'
          src='/images/pages/404.png'
          layout='fill'
          objectFit='contain'
          priority
        />
      </ImageWrapper>

      <FooterIllustrations image='/images/pages/misc-404-object.png' />
    </Box>
  )
}

Error404.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error404
