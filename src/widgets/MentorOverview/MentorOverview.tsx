import { Box, Skeleton, Typography } from '@mui/material'
import { BookOpen, Calendar, MapPin, Phone, Users } from 'lucide-react'
import { ClassGroup } from './config/constants'
import { GroupCard } from '@components/GroupCard'
import Image from 'next/image'
import { useGetMentor } from './api/mentor'
import { useAuth } from '@hooks/useAuth'
import { getFormatDate } from '@shared/utils/getFormatDate'
import Divider from '@mui/material/Divider'
import { getFormatPhone } from '@shared/utils'

export const MentorOverview = () => {
  const { user } = useAuth()
  const { data, isLoading } = useGetMentor(String(user?.id))

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
        display: 'flex',
        gap: '30px',
        flexDirection: { xs: 'column', md: 'row' }
      }}
    >
      <Box
        sx={{
          p: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
          width: { xs: '100%', md: '450px' }
        }}
      >
        <Typography variant='h6' color='#000'>Mening ma'lumotlarim</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          {data?.image ? (
            <Image
              src={data.image}
              alt="Mentor Image"
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
                backgroundColor: 'lightgray',
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

          <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#000' }}>Otabek Ibrohimov</Typography>
        </Box>

        <Divider color="#e0e0e0" />

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

        <Divider color="#e0e0e0" />

        <Box>
          <Typography sx={{ mb: '10px', fontSize: 16 }}>Kontakt</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={20} />
            <Typography sx={{ color: '#000' }}>{getFormatPhone(data?.phone ?? '')}</Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          p: '25px',
          bgcolor: 'white',
          borderRadius: '8px',
          border: '1px solid #E0E0E0',
          width: '100%'
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: '#000' }}>Guruhlar</Typography>
        <Typography sx={{ mt: '5px', mb: '10px', fontWeight: 600, fontSize: 12 }}>Hozirgi/Keyingi daras</Typography>
        {ClassGroup.map(item => (
          <GroupCard
            key={`${item.name}-${item.all_students}`}
            title={item.name}
            all_students={item.all_students}
            active_students={item.active_students}
            trial_students={item.trial_students}
            room={item.room}
          />
        ))}

        <Typography sx={{ mt: '15px', mb: '10px', fontWeight: 600, fontSize: 12 }}>Barcha guruhlar</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(14.75rem, 7.159vw + 10.159rem, 18.75rem), 1fr))',
            gap: '16px'
          }}
        >
          {ClassGroup.map(item => (
            <GroupCard
              key={`${item.name}-${item.all_students}`}
              title={item.name}
              all_students={item.all_students}
              active_students={item.active_students}
              trial_students={item.trial_students}
              room={item.room}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

MentorOverview.displayName = 'MentorOverview'
