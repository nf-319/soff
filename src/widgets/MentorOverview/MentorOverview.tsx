'use client'

import { FC } from 'react'
import { Box, Skeleton, Typography } from '@mui/material'
import { BookOpen, Calendar, MapPin, Phone, Users } from 'lucide-react'
import Image from 'next/image'
import { useGetMentor } from './api/mentor'
import { getFormatDate } from '@shared/utils/getFormatDate'
import Divider from '@mui/material/Divider'
import { getFormatPhone } from '@shared/utils'

type Props = {
  id: string
  notMind?: boolean
}

export const MentorOverview: FC<Props> = ({ id, notMind }) => {
  const { data, isLoading } = useGetMentor(id)

  if(isLoading) {
    return <Skeleton sx={{ width: { xs: '100%', md: '450px' }, height: '100%' }} />
  }

  const profileDetails = [
    { icon: Calendar, title: "Ro‘yxatdan o‘tgan sana", value: getFormatDate(String(data?.activated_at)) },
    { icon: MapPin, title: 'Filial', value: data?.branches?.filter(branch => branch.exists).map(item => item.name).join(', ') },
    { icon: BookOpen, title: "O'qitayotgan kurslar soni", value: Number(data?.lesson_amount ?? 0) },
    { icon: Users, title: 'Faol guruhlar soni', value: Number(data?.active_groups ?? 0) }
  ]

  return (
    <Box
      sx={{
        p: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #E0E0E0',
        width: '100%'
      }}
    >
      <Typography variant='h6' color='#000'>
        {notMind ? "O'qituvchi malumotlari" : "Mening ma'lumotlarim"}
      </Typography>

      <Divider color='#e0e0e0' />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        {data?.image ? (
          <Image
            src={data.image}
            alt='Mentor Image'
            width={80}
            height={80}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              backgroundColor: 'lightgray'
            }}
          />
        ) : (
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #666CFF, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 'bold',
              color: '#fff',
              textTransform: 'uppercase'
            }}
          >
            {data?.first_name?.[0] || ''}
          </Box>
        )}

        <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#000' }}>{data?.first_name}</Typography>
      </Box>

      <Divider color='#e0e0e0' />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {profileDetails.map((item, index) => (
          <Box key={`${index}-${item.title}`} sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <item.icon size={20} />

            <Box display='flex' flexWrap='wrap' alignItems='center' justifyContent='start' gap={3}>
              <Typography sx={{ fontSize: 16 }}>{item.title}:</Typography>
              <Typography sx={{ fontWeight: 500, color: '#000' }}>{item.value}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider color='#e0e0e0' />

      <Box>
        <Typography sx={{ mb: '10px', fontSize: 16 }}>Kontakt</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Phone size={20} />
          <Typography sx={{ color: '#000' }}>{getFormatPhone(data?.phone ?? '')}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

MentorOverview.displayName = 'MentorOverview'
