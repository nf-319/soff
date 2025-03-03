import { Box, CircularProgress } from '@mui/material'

export const Loading = () => (
  <Box display='flex' alignItems='center' height='100vh' justifyContent='center'>
    <CircularProgress />
  </Box>
)

Loading.displayName = 'Loading'
