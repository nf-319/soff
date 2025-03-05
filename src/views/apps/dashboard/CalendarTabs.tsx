'use client'

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabContext from '@mui/lab/TabContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import { handleTabValue, handleOpen, fetchLessons, updateInterval } from 'src/store/apps/dashboard'
import { useTranslation } from 'react-i18next'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import { useGet } from 'src/hooks/useApi'
import { useState } from 'react'
import useResponsive from 'src/@core/hooks/useResponsive'

type Props = {
  handleUpdateWeekDays: (item: string[]) => void
}

const CalendarTabs: FC<Props> = ({ handleUpdateWeekDays }) => {
  const dispatch = useAppDispatch()
  const { isMobile } = useResponsive()
  const { tabValue, weeks } = useAppSelector(state => state.dashboard)
  const { t } = useTranslation()

  const tabs = [
    {
      value: '1',
      name: 'Juft kunlar',
      onClick: () => handleUpdateWeekDays(['tuesday', 'thursday', 'saturday'])
    },
    {
      value: '2',
      name: 'Toq kunlar',
      onClick: () => handleUpdateWeekDays(['monday', 'wednesday', 'friday'])
    },
    {
      value: '3',
      name: 'Boshqa',
      onClick: () => dispatch(handleOpen('week'))
    }
  ]

  async function handleChangeInterval(interval: string) {
    dispatch(updateInterval(interval))
    // await dispatch(fetchLessons({ queryWeeks: weeks, interval: interval }))
  }

  return (
    <TabContext value={tabValue}>
      <Box sx={{ display: isMobile ? '' : 'flex', justifyContent: 'space-between' }}>
        <TabList onChange={(_, value: string) => dispatch(handleTabValue(value))} aria-label='centered tabs example'>
          {tabs.map(({ value, name, onClick }) => (
            <Tab key={value} value={value} label={t(name)} sx={{ fontSize: '12px' }} onClick={onClick} />
          ))}
        </TabList>

        <FormControl fullWidth={isMobile} size='small' sx={{ margin: 2 }}>
          <InputLabel id='time-interval-label'>Vaqt intervali</InputLabel>

          <Select
            defaultValue={15}
            onChange={(e: any) => handleChangeInterval(e.target.value)}
            labelId='time-interval-label'
            label='Vaqt intervali'
          >
            <MenuItem value={15}>15 daqiqa</MenuItem>
            <MenuItem value={30}>30 daqiqa</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </TabContext>
  )
}

export default CalendarTabs
