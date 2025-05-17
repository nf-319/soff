import useResponsive from '@/@core/hooks/useResponsive'
import { Box, Button, Card, Typography } from '@mui/material'
import { LaptopMinimal, Smartphone } from 'lucide-react'

type Props = {
  displayMode: 'phone' | 'tablet' | 'computer'
  setDisplayMode: (str: 'computer' | 'tablet' | 'phone') => void
  is_update?: boolean
}

const FormHeader = ({ setDisplayMode, displayMode, is_update }: Props) => {
  const { isMobile } = useResponsive()
  return (
    <Box
      display={'flex'}
      flexDirection={{ xs: 'column', md: 'row' }}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Typography variant='h5'>{is_update ? "Formani o'zgartirish" : 'Forma yaratish'}</Typography>
      <Card
        sx={{
          boxShadow: 'none',
          border: '1px solid lightgray',
          width: '100%',
          maxWidth: 650,
          padding: 2,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <Button
          onClick={() => setDisplayMode('phone')}
          startIcon={<Smartphone size={20} />}
          size='medium'
          variant={displayMode == 'phone' ? 'contained' : 'outlined'}
        >
          Telefon
        </Button>
        <Button
          onClick={() => setDisplayMode('tablet')}
          startIcon={<Smartphone size={20} />}
          size='medium'
          variant={displayMode == 'tablet' ? 'contained' : 'outlined'}
        >
          Planshet
        </Button>
        <Button
          onClick={() => setDisplayMode('computer')}
          startIcon={<LaptopMinimal size={20} />}
          size='medium'
          variant={displayMode == 'computer' ? 'contained' : 'outlined'}
        >
          Kompyuter
        </Button>
      </Card>
    </Box>
  )
}

export default FormHeader
