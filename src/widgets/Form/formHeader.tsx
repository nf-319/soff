import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { LaptopMinimal, LaptopMinimalCheck, Smartphone, Tablet } from 'lucide-react';
import Divider from '@mui/material/Divider';
import useResponsive from '@/@core/hooks/useResponsive';
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@/store'
import { setDisplayMode, setEnd } from '@store/apps/form'

type Props = {
  is_update?: boolean;
};

const FormHeader = ({ is_update }: Props) => {
  const { isMobile } = useResponsive();
  const { end, displayMode } = useAppSelector((state) => state.form);
  const router = useRouter()
  const dispatch = useAppDispatch();

  const renderButton = (
    mode: 'phone' | 'tablet' | 'computer',
    icon: JSX.Element,
    label: string,
  ) => {
    const isActive = displayMode === mode;


    const handleClick = () => {
      if(isMobile && mode === 'phone') {
        void router.push('/settings/forms/create/view')
      } else {
        dispatch(setDisplayMode(mode))
      }
    }

    if (isMobile && mode !== 'phone') {
      return null;
    }

    return (
      <Tooltip title={label} arrow>
        <IconButton
          onClick={handleClick}
          color={isActive ? 'primary' : 'default'}
          sx={{
            border: isActive ? '1px solid' : '1px solid #e0e0e0',
            borderRadius: 1
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    )
  };

  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'flex' },
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', md: 'space-between' },
        width: '100%'
      }}
    >
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='h5'>{is_update ? "Formani o'zgartirish" : 'Forma yaratish'}</Typography>

        {isMobile && renderButton('phone', <Smartphone size={20} />, "Telefon ko'rinishi")}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'row' },
          justifyContent: { xs: 'space-between', md: 'center' },
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' },
          gap: { xs: 1, md: 2 },
          mt: { xs: 2, md: 0 }
        }}
      >
        <Button
          startIcon={<LaptopMinimalCheck size={20} />}
          variant={end ? 'contained' : 'outlined'}
          onClick={() => dispatch(setEnd(!end))}
          sx={{
            flex: { xs: 1, md: 'auto' },
            minWidth: { xs: 'auto', md: 'auto' }
          }}
        >
          Yakuniy natija ko'rsatish
        </Button>

        {!isMobile && (
          <>
            <Divider orientation='vertical' sx={{ height: '40px', color: '#e0e0e0' }} />
            {renderButton('phone', <Smartphone size={20} />, "Telefon ko'rinishi")}
            {renderButton('tablet', <Tablet size={20} />, "Planshet ko'rinishi")}
            {renderButton('computer', <LaptopMinimal size={20} />, "Kompyuter ko'rinishi")}
          </>
        )}
      </Box>
    </Box>
  )
};

export default FormHeader;
