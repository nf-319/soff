import { Box } from '@mui/system'
import { MentorOverview } from '@/widgets/MentorOverview'
import { MentorGroups } from '@/widgets/MentorGroups'
import { useAuth } from '@hooks/useAuth'
import { FC, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGet } from '@/hooks/useApi'
import ceoConfigs from '@/configs/ceo'
import { Metadata } from '@/components/Metada'

type Props = {
  id?: string
}

export const MentorProfile: FC<Props> = ({ id }) => {
  const { user } = useAuth()
  const { data } = useGet(ceoConfigs.teachers + id)

  console.log(data)

  return (
    <Box
      display='grid'
      gap={4}
      minHeight='calc(100vh - 137px)'
      position='relative'
      sx={{
        gridTemplateColumns: {
          xs: '1fr',
          md: '1fr 2fr'
        }
      }}
    >
      <Metadata title={`Teacher ${data?.first_name}`} />
      <Box
        position={{ xs: 'relative', md: 'sticky' }}
        top={{ md: 200 }}
        bottom={0}
        maxHeight={{ md: 'calc(100vh - 100px)' }}
        overflow={{ md: 'auto' }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gridColumn: {
            xs: 'span 1',
            md: 'span 1'
          }
        }}
      >
        <MentorOverview id={id ?? String(user?.id)} notMind={Boolean(id)} />
      </Box>

      <Box
        gridColumn={{
          xs: 'span 1',
          md: 'span 1'
        }}
      >
        <MentorGroups id={id ?? String(user?.id)} hiddenNowGroup={Boolean(id)} />
      </Box>
    </Box>
  )
}

MentorProfile.displayName = 'MentorProfile'
