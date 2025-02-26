'use client'

import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useAppDispatch, useAppSelector } from 'src/store'
import { useSettings } from 'src/@core/hooks/useSettings'
import { Theme } from '@mui/material/styles'
import CalendarTabs from './CalendarTabs'
import LessonsTable from './LessonsTable'
import WeekDaysDialog from './WeekDaysDialog'
import { fetchLessons, updateWeeks } from 'src/store/apps/dashboard'
import Skeleton from '@mui/material/Skeleton'
import { Divider } from '@mui/material'
import { useGet } from 'src/hooks/useApi'
import { useState } from 'react'

const Calendar = () => {
  const dispatch = useAppDispatch()
  const { isLessonLoading, interval, weeks } = useAppSelector(state => state.dashboard)
  const [queryParams, setQueryParams] = useState<string>(String(weeks))
  const { settings } = useSettings()
  const { skin } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { data, isLoading } = useGet('common/dashboard/', {
    params: { day_of_week: queryParams, interval }
  })
  const handleUpdateWeekDays = async (weekDays: string[]) => {
    dispatch(updateWeeks(weekDays))
    setQueryParams(weekDays.toString())
  }

  return (
    <CalendarWrapper
      className='app-calendar'
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        borderRadius: '10px',
        background: 'white',
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          borderRadius: 1,
          p: 4,
          display: 'grid',
          boxShadow: 'none',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {}),
          maxWidth: '100%'
        }}
      >
        <CalendarTabs handleUpdateWeekDays={handleUpdateWeekDays} />

        <Divider style={{ marginTop: '0rem' }} sx={{ background: '#d3d3d3' }} />

        {isLoading ? (
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '11px' }}>
            {[1, 2, 3, 4].map((el, i) => (
              <Skeleton
                key={i}
                sx={{ bgcolor: 'grey.200' }}
                variant='rectangular'
                width={'100%'}
                height={el === 1 ? '20px' : '45px'}
                animation='wave'
              />
            ))}
          </Box>
        ) : (
          <LessonsTable workTime={data?.work_time} events={data?.room_list} />
        )}
      </Box>

      <WeekDaysDialog handleUpdateWeekDays={handleUpdateWeekDays} />
    </CalendarWrapper>
  )
}

export default Calendar
