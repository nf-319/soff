import { useAppSelector } from '@/store';
import FormFields from '@/widgets/Form/formFields';
import FormHeader from '@/widgets/Form/formHeader';
import FormUi from '@/widgets/Form/formUi';
import { Box, Card } from '@mui/material';
import Divider from '@mui/material/Divider';
import { ActionsModals } from '@/widgets/Form/ui/ActionsModals';
import useResponsive from '@/@core/hooks/useResponsive';

type Props = {
  is_update?: boolean;
};

const CreateForm = ({ is_update }: Props) => {
  const { displayMode } = useAppSelector((state) => state.form);
  const { isMobile } = useResponsive();

  const getFormUiWidth = () => {
    switch (displayMode) {
      case 'computer':
        return { xs: '100%', md: '70%' };
      case 'tablet':
        return { xs: '100%', md: '50%' };
      case 'phone':
        return { xs: '100%', md: '30%' };
      default:
        return { xs: '100%', md: '50%' };
    }
  };

  const getFormFieldsWidth = () => {
    switch (displayMode) {
      case 'computer':
        return { xs: '100%', md: '30%' };
      case 'tablet':
        return { xs: '100%', md: '50%' };
      case 'phone':
        return { xs: '100%', md: '70%' };
      default:
        return { xs: '100%', md: '50%' };
    }
  };

  return (
    <Card sx={{ boxShadow: 'none', border: '1px solid lightgray', padding: 5 }}>
      <FormHeader is_update={is_update} />

      <Box
        sx={{
          marginTop: 5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          ...(!isMobile && { height: 'calc(100vh - 200px)', overflow: 'hidden' }),
        }}
      >
        <Box
          sx={{
            width: getFormFieldsWidth(),
            transition: 'width 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column',
            ...(!isMobile && { overflow: 'hidden' }),
          }}
        >
          <FormFields is_update={is_update} />
        </Box>
        {!isMobile && (
          <>
            <Divider orientation="vertical" flexItem color="#e0e0e0" sx={{ mx: 3 }} />

            <Box
              sx={{
                width: getFormUiWidth(),
                transition: 'width 0.3s ease-in-out',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                height: '100%',
              }}
            >
              <FormUi />
            </Box>
          </>
        )}
      </Box>

      <ActionsModals />
    </Card>
  );
};

export default CreateForm;
