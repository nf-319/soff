'use client'

import { type FC } from 'react'
import { Box, Typography } from '@mui/material'
import { Clock, MapPin } from 'lucide-react'

type Props = {
  title: string
  course?: string
  lesson_time?: string
  room: string
  all_students: number
  active_students: number
  trial_students: number
}

export const GroupCard: FC<Props> = ({
  title,
  course,
  lesson_time,
  room,
  all_students,
  active_students,
  trial_students
}) => {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: '#fff'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {course && (
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {course}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Clock size={16} />
            <Typography variant='body2'>{lesson_time}</Typography>
          </Box>
          <Typography variant='body2'>Jami: {all_students}</Typography>
          <Typography variant='body2'>Sinov: {trial_students}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapPin size={16} />
            <Typography variant='body2'>{room}</Typography>
          </Box>
          <Typography variant='body2'>Faol: {active_students}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

GroupCard.displayName = 'GroupCard'
