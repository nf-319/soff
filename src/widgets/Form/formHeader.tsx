import useResponsive from '@/@core/hooks/useResponsive'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { LaptopMinimal, Smartphone, Tablet } from 'lucide-react'

type Props = {
  displayMode: 'phone' | 'tablet' | 'computer'
  setDisplayMode: (str: 'computer' | 'tablet' | 'phone') => void
  is_update?: boolean
}

const FormHeader = ({ setDisplayMode, displayMode, is_update }: Props) => {
  const { isMobile } = useResponsive()

  const renderButton = (
    mode: 'phone' | 'tablet' | 'computer',
    icon: JSX.Element,
    label: string,
  ) => {
    const isActive = displayMode === mode

    if (isMobile) {
      return (
        <Tooltip title={label} arrow>
          <IconButton
            onClick={() => setDisplayMode(mode)}
            color={isActive ? 'primary' : 'default'}
            sx={{ border: isActive ? '1px solid' : 'none', borderRadius: 1 }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )
    }

    return (
      <Tooltip title={label} arrow>
        <Button
          onClick={() => setDisplayMode(mode)}
          startIcon={icon}
          size="medium"
          variant={isActive ? 'contained' : 'outlined'}
        >
          {label}
        </Button>
      </Tooltip>
    )
  }

  return (
    <Box display='flex' alignItems='center' justifyContent='space-between' width='100%'>
      <Box>
        <Typography variant='h5'>{is_update ? "Formani o'zgartirish" : 'Forma yaratish'}</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2
        }}
      >
        {renderButton('phone', <Smartphone size={20} />, "Telefon ko'rinishi")}
        {renderButton('tablet', <Tablet size={20} />, "Planshet ko'rinishi")}
        {renderButton('computer', <LaptopMinimal size={20} />, "Kompyuter ko'rinishi")}
      </Box>
    </Box>
  )
}

export default FormHeader
