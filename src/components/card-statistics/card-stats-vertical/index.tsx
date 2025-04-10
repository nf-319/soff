import { CSSTransition } from 'react-transition-group';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CustomAvatar from '../../mui/avatar';
import { CardStatsVerticalProps } from '../types';
import useResponsive from '../../../@core/hooks/useResponsive';
import { formatCurrency } from '../../../@core/utils/format-currency';
import { useAppSelector } from '../../../store';

const CardStatsVertical = ({ title, color, icon, stats }: CardStatsVerticalProps) => {
  const { eyeVisible } = useAppSelector(state => state.dashboard);
  const { isMobile, isTablet } = useResponsive();

  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          gap: '5px',
          alignItems: 'center',
          p: isMobile ? '10px 0px !important' : '15px 10px !important'
        }}
      >
        <Box display='grid' alignItems='center' gap={2}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CustomAvatar
              sx={{ width: '30px', height: '30px', p: 1 }}
              skin='light'
              variant='rounded'
              color={color}
            >
              {icon}
            </CustomAvatar>
          </Box>

          <Typography
            variant='caption'
            sx={{ fontSize: isMobile ? '12px !important' : isTablet ? '14px !important' : '16px !important', textAlign: 'center' }}
          >
            {stats}
          </Typography>
        </Box>

        <CSSTransition in={eyeVisible} timeout={300} classNames='fade'>
          <Typography variant='h4' sx={{ fontSize: '16px !important', textAlign: 'center' }}>
            {eyeVisible ? formatCurrency(title) : '****'}
          </Typography>
        </CSSTransition>
      </CardContent>
    </Card>
  );
};

export default CardStatsVertical;
