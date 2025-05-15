'use client'

import { Box, Typography } from '@mui/material'
import { GroupCard } from '@components/GroupCard'
import Divider from '@mui/material/Divider'
import { useGetGroups } from '@/widgets/MentorGroups/api/groups'
import { useAuth } from '@hooks/useAuth'
import { MentorGroupsSkeleton } from './ui/MentorGroupsSkeleton'
import { MentorGroupType } from '@/widgets/MentorGroups/model/types'

export const MentorGroups = () => {
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
        width: '100%',
      }}
    >
      <Typography variant="h6" sx={{ color: '#000', mb: 1 }}>
        Guruhlar
      </Typography>

      <Divider color="#e0e0e0" sx={{ mb: 2 }} />

      <Box>
        <Typography sx={{ mb: '10px', fontWeight: 600, fontSize: 12 }}>
          Hozirgi/Keyingi dars
        </Typography>
        {currentOrNextGroup ? (
          <GroupCard
            key={`${currentOrNextGroup.name}-${currentOrNextGroup.id}`}
            title={currentOrNextGroup.name}
            isHighlighted={true}
            lesson_time={currentOrNextGroup.start_end_at}
            hrefId={currentOrNextGroup.id}
            course={currentOrNextGroup.course_name}
            all_students={currentOrNextGroup.student_count}
            active_students={0}
            trial_students={4}
            room={currentOrNextGroup.room_name}
            teacher_name={currentOrNextGroup.teacher_name}
            week_days={currentOrNextGroup.week_days}
            month_duration={currentOrNextGroup.month_duration}
          />
        ) : (
          <Typography sx={{ color: '#64748b', fontSize: 14, fontStyle: 'italic' }}>
            Bugun dars yo'q
          </Typography>
        )}
      </Box>

      <Typography sx={{ mt: '15px', mb: '10px', fontWeight: 600, fontSize: 12 }}>
        Barcha guruhlar
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(14.75rem, 7.159vw + 10.159rem, 18.75rem), 1fr))',
          gap: '16px',
        }}
      >
        {data?.results?.map((item: MentorGroupType) => {
          const startDate = new Date(item.start_date)
          const endDate = new Date(item.end_date)
          const isWithinDateRange = currentDate >= startDate && currentDate <= endDate
          const isTodayScheduled = item.week_days
            .map(day => day.toLowerCase())
            .includes(currentDayOfWeek)
          const isToday = isWithinDateRange && isTodayScheduled

          const [endHour, endMinute] = item.end_at.split(':').map(Number)
          const endTime = endHour * 60 + endMinute
          const isCurrentOrNext = isToday && currentTime <= endTime

          return (
            <GroupCard
              key={`${item.name}-${item.id}`}
              title={item.name}
              isHighlighted={isCurrentOrNext}
              lesson_time={item.start_end_at}
              hrefId={item.id}
              course={item.course_name}
              all_students={item.student_count}
              active_students={0}
              trial_students={4}
              room={item.room_name}
              teacher_name={item.teacher_name}
              week_days={item.week_days}
              month_duration={item.month_duration}
            />
          )
        })}
      </Box>
    </Box>
  )
}

MentorGroups.displayName = 'MentorGroups'
