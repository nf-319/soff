'use client'

import { Box, Chip, MenuItem, Select, Skeleton, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DataGridTable } from '@components/table/DataGridTable'
import { useState } from 'react'
import { uzbekMonths } from '@shared/constants'
import Excel from '@components/excelButton/Excel'
import { ComingSoon } from '@components/ComingSoon'
import { useGetMentorRealTime, useGetMentorSellers } from './api/mentor-sellers'
import { formatPrice, getFormatDate } from '@shared/utils'
import { useAuth } from '@hooks/useAuth'

export const MentorSellers = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data, isLoading } = useGetMentorSellers()
  const [currentYears, setCurrentYears] = useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
  const { data: realTimeData, isLoading: realTimeLoading } = useGetMentorRealTime(String(user?.id))

  if (isLoading && realTimeLoading) {
    return (
      <Box component='section' display='grid' gap={4}>
        <Box display='grid' gap={3}>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <Skeleton variant='text' width={200} height={40} />

            <Skeleton variant='rectangular' width={100} height={36} />
          </Box>

          <Skeleton variant='rectangular' height={300} />
        </Box>

        <Box display='flex' flexDirection='column' alignItems='center' gap={3}>
          <Box display='flex' alignItems='center' width='100%' justifyContent='space-between'>
            <Skeleton variant='text' width={200} height={40} />

            <Box display='flex' gap={3} alignItems='center'>
              <Skeleton variant='rectangular' width={100} height={36} />
              <Skeleton variant='rectangular' width={120} height={36} />
              <Skeleton variant='rectangular' width={100} height={36} />
            </Box>
          </Box>

          <Skeleton variant='rectangular' height={300} width='100%' />
        </Box>
      </Box>
    )
  }

  const columns = [
    {
      field: 'id',
      headerName: t('ID'),
      width: 70
    },
    {
      field: 'name',
      headerName: t('Guruh nomi'),
      minWidth: 100,
      flex: 1
    },
    {
      field: 'course',
      headerName: t('kurs nomi'),
      minWidth: 100,
      flex: 1
    },
    {
      field: 'students_count',
      headerName: t("O'quvchilar soni"),
      minWidth: 100,
      flex: 1
    },
    {
      field: 'salary',
      headerName: t("O'qituvchi ulushi"),
      minWidth: 100,
      flex: 1
    }
  ]

  const salaryColumns = [
    {
      field: 'id',
      headerName: t('ID'),
      width: 70
    },
    {
      field: 'date',
      headerName: t('Oy'),
      minWidth: 100,
      flex: 1,
      renderCell: (params: any) => getFormatDate(String(params.value))
    },
    {
      field: 'allowed_lessons',
      headerName: t('Darslar soni'),
      minWidth: 100,
      renderCell: (params: any) => `${params.value} ta`,
      flex: 1
    },
    {
      field: 'bonus_amount',
      headerName: t('Bonus'),
      minWidth: 100,
      renderCell: (params: any) => (
        <Typography variant='body1' color={Number(params.value) > 0 ? '#16a34a' : 'textSecondary'}>
          {Number(params.value) > 0 ? `+ ${formatPrice(params.value)}` : formatPrice(params.value)}
        </Typography>
      ),
      flex: 1
    },
    {
      field: 'fine_amount',
      headerName: 'Jarima',
      minWidth: 100,
      renderCell: (params: any) => (
        <Typography variant='body1' color={Number(params.value) > 0 ? '#ef4444' : 'textSecondary'}>
          {Number(params.value) > 0 ? `- ${formatPrice(params.value)}` : formatPrice(params.value)}
        </Typography>
      ),
      flex: 1
    },
    {
      field: 'prepayment',
      headerName: 'Avans',
      minWidth: 100,
      renderCell: (params: any) => formatPrice(params.value),
      flex: 1
    },
    {
      field: 'salary',
      headerName: 'Maosh',
      minWidth: 100,
      renderCell: (params: any) => formatPrice(params.value),
      flex: 1
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: () => <Chip label="To'langan" variant='outlined' color='success' />
    }
  ]

  return (
    <Box component='section' display='grid' gap={4}>
      <Box display='flex' flexDirection='column' alignItems='center' gap={3} width='100%'>
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent='space-between'
          gap={2}
          width='100%'
        >
          <Typography gutterBottom variant='h5'>
            Guruhlar bo'yicha
          </Typography>

          <Box
            display='flex'
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            gap={2}
            width='100%'
            maxWidth={{ sm: 'none', md: 'fit-content' }}
          >
            <Select
              fullWidth
              sx={{ minWidth: 120 }}
              size='small'
              value={currentYears}
              onChange={e => setCurrentYears(e.target.value as number)}
            >
              <MenuItem value={currentYears}>{currentYears}</MenuItem>
            </Select>

            <Select
              fullWidth
              sx={{ minWidth: 120 }}
              size='small'
              value={currentMonth}
              onChange={e => setCurrentMonth(e.target.value as number)}
            >
              <MenuItem value='all'>{t('Hammasi')}</MenuItem>
              {uzbekMonths.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>

            <Excel />
          </Box>
        </Box>

        <DataGridTable rows={realTimeData?.results!} columns={columns} hideFooter />
      </Box>

      <Box display='grid' gap={3}>
        <Box
          display='flex'
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent='space-between'
          gap={2}
        >
          <Typography gutterBottom variant='h5'>
            Oylik maoshlar
          </Typography>

          <ComingSoon hidden>
            <Excel />
          </ComingSoon>
        </Box>

        <DataGridTable rows={data?.results || []} columns={salaryColumns} hideFooter />
      </Box>
    </Box>
  )
}

