'use client'

import { type FC } from 'react'
import { Box, Typography, Chip, Tooltip } from '@mui/material'
import { Clock, MapPin, Users, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import { dayTranslations } from '@shared/constants'
import getMonthName from '@utils/gwt-month-name'

type Props = {
  title: string
  course?: string
  lesson_time?: string
  room: string
  all_students: number
  active_students: number
  trial_students: number
  isHighlighted?: boolean
  hrefId: number
  teacher_name?: string
  week_days?: string[]
  month_duration?: number
}

export const GroupCard: FC<Props> = ({
  title,
  course,
  lesson_time,
  room,
  all_students,
  active_students,
  trial_students,
  isHighlighted = false,
  hrefId,
  teacher_name,
  week_days,
  month_duration
}) => (
  <Box
    component={Link}
    href={`/groups/view/security/?id=${hrefId}&month=${getMonthName(null)}`}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      border: isHighlighted ? '2px solid #666cff' : '1px solid #e0e0e0',
      borderRadius: 1,
      padding: 2.5,
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
      '&:hover': {
        boxShadow: '0 4px 12px rgba(102, 108, 255, 0.2)'
      },
      width: '100%',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography
        variant='h6'
        sx={{
          fontWeight: 700,
          color: '#1e293b',
          fontSize: '1.1rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </Typography>
      {course && (
        <Chip
          label={course}
          size='small'
          sx={{
            backgroundColor: isHighlighted ? '#e6e7ff' : '#f0f2f5',
            color: isHighlighted ? '#1e40af' : '#374151',
            border: isHighlighted ? '1px solid #666CFF' : '1px solid #e6e7ff',
            fontWeight: 600,
            borderRadius: 12,
            padding: '4px 12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}
        />
      )}
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Clock size={16} color='#666cff' />
        <Typography variant='body2' sx={{ color: '#64748b', fontWeight: 500 }}>
          {lesson_time || 'Nomaʼlum'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MapPin size={16} color='#666cff' />
        <Typography variant='body2' sx={{ color: '#64748b', fontWeight: 500 }}>
          {room}-xona
        </Typography>
      </Box>
      {teacher_name && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <User size={16} color='#666cff' />
          <Typography variant='body2' sx={{ color: '#64748b', fontWeight: 500 }}>
            {teacher_name}
          </Typography>
        </Box>
      )}
      {week_days && week_days.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calendar size={16} color='#666cff' />
          <Typography variant='body2' sx={{ color: '#64748b', fontWeight: 500 }}>
            {week_days.map(day => dayTranslations[day.toLowerCase()] || day).join(', ')}
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Tooltip title="Jami o'quvchilar soni">
          <Chip
            icon={<Users size={14} />}
            label={`Jami: ${all_students}`}
            size='small'
            color='success'
            sx={{ borderRadius: 1, paddingX: 1 }}
            variant='outlined'
          />
        </Tooltip>

        <Tooltip title="Faol o'quvchilar soni">
          <Chip
            icon={<Users size={14} />}
            label={`Faol: ${active_students}`}
            size='small'
            sx={{ borderRadius: 1, paddingX: 1 }}
            color='info'
            variant='outlined'
          />
        </Tooltip>

        <Tooltip title="Sinovdagi o'quvchilar soni">
          <Chip
            icon={<Users size={14} />}
            label={`Sinov: ${trial_students}`}
            size='small'
            sx={{ borderRadius: 1, paddingX: 1 }}
            color='secondary'
            variant='outlined'
          />
        </Tooltip>

        {month_duration && (
          <Tooltip title="Guruh davomiyligi (oylarda)">
            <Chip
              icon={<Calendar size={14} />}
              label={`${month_duration} oy`}
              size='small'
              sx={{ borderRadius: 1, paddingX: 1 }}
              color='warning'
              variant='outlined'
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  </Box>
)

GroupCard.displayName = 'GroupCard'
