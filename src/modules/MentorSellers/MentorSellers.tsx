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
import { useAppSelector } from '@/store'
import { Endpoints } from '@api/endpoints'
import api from '@utils/api'

export const MentorSellers = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { companyInfo } = useAppSelector(state => state.user)
  const { data, isLoading } = useGetMentorSellers()
  const [currentYears, setCurrentYears] = useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())

  const createdAtYear = companyInfo?.created_at
    ? new Date(companyInfo.created_at).getFullYear()
    : new Date().getFullYear()
  const currentYear = new Date().getFullYear()
  const yearRange = Array.from(
    { length: currentYear - createdAtYear + 1 },
    (_, i) => currentYear - i
  )

  const { data: realTimeData, isLoading: realTimeLoading } = useGetMentorRealTime({
    id: String(user?.id),
    date: `${currentYears}-${String(currentMonth + 1).padStart(2, '0')}-01`,
  })

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
    { field: 'obj_id', headerName: t('ID'), width: 70 },
    { field: 'name', headerName: t('Guruh nomi'), minWidth: 100, flex: 1 },
    { field: 'course', headerName: t('kurs nomi'), minWidth: 100, flex: 1 },
    { field: 'students_count', headerName: t("O'quvchilar soni"), minWidth: 100, flex: 1 },
    {
      field: 'salary',
      headerName: t("O'qituvchi ulushi"),
      renderCell: (params: any) => formatPrice(params.value),
      minWidth: 100,
      flex: 1,
    },
  ]

  const salaryColumns = [
    { field: 'id', headerName: t('ID'), width: 70 },
    {
      field: 'date',
      headerName: t('Oy'),
      minWidth: 100,
      flex: 1,
      renderCell: (params: any) => getFormatDate(String(params.value)),
    },
    {
      field: 'allowed_lessons',
      headerName: t('Darslar soni'),
      minWidth: 100,
      renderCell: (params: any) => `${params.value} ta`,
      flex: 1,
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
      flex: 1,
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
      flex: 1,
    },
    {
      field: 'prepayment',
      headerName: 'Avans',
      minWidth: 100,
      renderCell: (params: any) => formatPrice(params.value),
      flex: 1,
    },
    {
      field: 'salary',
      headerName: 'Maosh',
      minWidth: 100,
      renderCell: (params: any) => formatPrice(params.value),
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: () => <Chip label="To'langan" variant='outlined' color='success' />,
    },
  ]

  const handleDownloadExcel = async () => {
    try {
      const url = Endpoints.EmployeeSalariesRealTime.replace(":id", String(user?.id))
      const response = await api.get(url, {
        params: { date: `${currentYears}-${String(currentMonth + 1).padStart(2, '0')}-01`, export: true }
      })
      const link = document.createElement('a')
      link.href = response.data.file_url
      link.setAttribute('download', '')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error(error)
    }
  }

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
            Guruhlar bo'yicha maosh
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
              onChange={e => setCurrentYears(Number(e.target.value))}
            >
              {yearRange.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            <Select
              fullWidth
              sx={{ minWidth: 120 }}
              size='small'
              value={currentMonth}
              onChange={e => setCurrentMonth(Number(e.target.value))}
            >
              {uzbekMonths.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>

            <Excel disabled={!Boolean(realTimeData?.length)} onClick={handleDownloadExcel} useLink={false} />
          </Box>
        </Box>
        <DataGridTable rows={realTimeData!} columns={columns} hideFooter getRowId={(row: any) => row.obj_id} />
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
