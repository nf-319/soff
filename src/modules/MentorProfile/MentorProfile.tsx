import { Box } from '@mui/system'
import { MentorOverview } from '@/widgets/MentorOverview'
import { MentorGroups } from '@/widgets/MentorGroups'
import { useAuth } from '@hooks/useAuth'
import { FC } from 'react'

type Props = {
  id?: string
}

export const MentorProfile: FC<Props> = ({ id }) => {
  const { user } = useAuth()

  return (
    <Box display='grid' gridTemplateColumns='1fr 2fr' gap={4} position='relative' minHeight='calc(100vh-137px)'>
      <Box
        gridColumn='span 1'
        position='sticky'
        top={200}
        bottom={0}
        maxHeight='calc(100vh - 100px)'
        overflow='auto'
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <MentorOverview id={id ?? String(user?.id)} notMind={Boolean(id)} />
      </Box>

      <Box gridColumn='span 1'>
        <MentorGroups hiddenNowGroup={Boolean(id)} />
      </Box>
    </Box>
  )
}

MentorProfile.displayName = 'MentorProfile'
