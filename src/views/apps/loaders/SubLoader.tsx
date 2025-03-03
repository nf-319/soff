import Box from '@mui/material/Box'
import { CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

const SubLoader = () => {
  const { t } = useTranslation()

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%' }}
    >
      <CircularProgress />

      <Typography variant='overline' component='h2' textTransform={'capitalize'}>
        {t('Loading...')}
      </Typography>
    </Box>
  )
}

export default SubLoader
