'use client'

import { Box, Typography } from '@mui/material'
import { GroupCard } from '@components/GroupCard'
import Divider from '@mui/material/Divider'
import { useGetGroups } from '@/widgets/MentorGroups/api/groups'
import { useAuth } from '@hooks/useAuth'
import { MentorGroupsSkeleton } from './ui/MentorGroupsSkeleton'
import { MentorGroupType } from '@/widgets/MentorGroups/model/types'
import { getFormatDate } from '@shared/utils/getFormatDate'
import { FC } from 'react'

type Props = {
  hiddenNowGroup?: boolean
}

export const MentorGroups: FC<Props> = ({ hiddenNowGroup = false }) => {
  const { user } = useAuth()
  const { data, isLoading } = useGetGroups(String(user?.id))

  const currentDate = new Date()
  const currentDayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase()
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes()

  if (isLoading) {
    return <MentorGroupsSkeleton />
  }

  const todayGroups = data?.results?.filter((item: MentorGroupType) => {
    const startDate = new Date(item.start_date)
    const endDate = new Date(item.end_date)
    const isWithinDateRange = currentDate >= startDate && currentDate <= endDate
    const isTodayScheduled = item.week_days
      .map(day => day.toLowerCase())
      .includes(currentDayOfWeek)
    return isWithinDateRange && isTodayScheduled
  }) || []

  const currentOrNextGroup = todayGroups.find((item: MentorGroupType) => {
    const [endHour, endMinute] = item.end_at.split(':').map(Number)
    const endTime = endHour * 60 + endMinute
    return currentTime <= endTime
  })

  return (
    <Box
      sx={{
        p: '25px',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        height: '100%',
        width: '100%'
      }}
    >
      <Typography variant='h6' sx={{ color: '#000', mb: 1 }}>
        Guruhlar
      </Typography>

      <Divider color='#e0e0e0' sx={{ mb: 2 }} />

      {!hiddenNowGroup && (
        <Box>
          <Typography sx={{ mb: '10px', fontWeight: 600, fontSize: 14 }}>Hozirgi/Keyingi dars</Typography>
          <Box display='flex' alignItems='center' width='100%' gap='16px'>
            {currentOrNextGroup ? (
              <GroupCard
                key={`${currentOrNextGroup.name}-${currentOrNextGroup.id}`}
                title={currentOrNextGroup.name}
                isHighlighted={true}
                lesson_time={`${getFormatDate(String(currentOrNextGroup.start_date))} - ${
                  currentOrNextGroup.start_end_at
                }`}
                hrefId={currentOrNextGroup.id}
                course={currentOrNextGroup?.course_name}
                all_students={currentOrNextGroup?.student_count}
                active_students={currentOrNextGroup?.student_counts?.active_count}
                trial_students={currentOrNextGroup?.student_counts?.new_count}
                room={currentOrNextGroup?.room_name}
                week_days={currentOrNextGroup?.week_days}
                month_duration={currentOrNextGroup?.month_duration}
              />
            ) : (
              <Typography sx={{ color: '#64748b', fontSize: 14, fontStyle: 'italic' }}>Bugun dars yo'q</Typography>
            )}
          </Box>
        </Box>
      )}

      <Typography sx={{ mt: '15px', mb: '10px', fontWeight: 600, fontSize: 14 }}>Barcha guruhlar</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(14.75rem, 7.159vw + 10.159rem, 18.75rem), 1fr))',
          gap: '16px'
        }}
      >
        {data?.results?.map((item: MentorGroupType) => (
          <GroupCard
            key={`${item.name}-${item.id}`}
            title={item.name}
            isHighlighted={false}
            lesson_time={`${getFormatDate(String(item.start_date))} - ${item.start_end_at}`}
            hrefId={item.id}
            course={item?.course_name}
            all_students={item?.student_count}
            active_students={item.student_counts?.active_count}
            trial_students={item?.student_counts?.new_count}
            room={item?.room_name}
            week_days={item?.week_days}
            month_duration={item?.month_duration}
          />
        ))}
      </Box>
    </Box>
  )
}

MentorGroups.displayName = 'MentorGroups'
