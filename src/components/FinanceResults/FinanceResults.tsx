import { FC, useState } from 'react'
import {
  Box,
  LinearProgress,
  Paper,
  Skeleton,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Tooltip,
  Card,
  CardContent,
  Button,
  useTheme,
  Chip
} from '@mui/material'
import { formatCurrency } from '@utils/format-currency'
import { useGetFinance } from '@/shared/query-hooks'
import { DateRange, Refresh, TrendingUp, TrendingDown, Assessment } from '@mui/icons-material'
import { useAuth } from '@hooks/useAuth'
import { useRouter } from 'next/router'
import { updateStudentParams } from '@store/apps/students'
import { useAppDispatch } from '@/store'

const monthMap: Record<number, string> = {
  1: 'Yanvar',
  2: 'Fevral',
  3: 'Mart',
  4: 'Aprel',
  5: 'May',
  6: 'Iyun',
  7: 'Iyul',
  8: 'Avgust',
  9: 'Sentabr',
  10: 'Oktabr',
  11: 'Noyabr',
  12: 'Dekabr'
}

export const FinanceResults: FC = () => {
  const theme = useTheme()
  const now = new Date()
  const currentYear = now.getFullYear()
  const { user } = useAuth()
  const currentMonth = now.getMonth() + 1
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedBranch, setSelectedBranch] = useState(user?.active_branch ?? '')
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const { data, isLoading, isError, refetch } = useGetFinance(selectedYear, selectedMonth, selectedBranch)


  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value)
  }

  const handleBranchChange = (event: any) => {
    setSelectedBranch(event.target.value)
  }

  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value)
  }

  const resetToCurrentDate = () => {
    setSelectedYear(currentYear)
    setSelectedMonth(currentMonth)
  }

  if (isLoading)
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
          <Skeleton width={200} height={40} />
          <Skeleton width={250} height={40} />
        </Box>
        <Skeleton variant='rectangular' width='100%' height={250} sx={{ borderRadius: 2 }} />
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Skeleton variant='rectangular' width='100%' height={100} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant='rectangular' width='100%' height={100} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant='rectangular' width='100%' height={100} sx={{ borderRadius: 1 }} />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    )

  if (isError || !data)
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant='h6' color='error' gutterBottom>
          Ma'lumotlarni yuklashda xatolik yuz berdi
        </Typography>
        <Button variant='contained' color='primary' startIcon={<Refresh />} onClick={() => refetch()} sx={{ mt: 2 }}>
          Qayta urinish
        </Button>
      </Paper>
    )

  const { percentage = 0, done_amount, debts_amount, pending_amount, out_of_limit_amount, planned_amount } = data

  const getPercentageColor = () => {
    if (percentage >= 90) return theme.palette.success.main
    if (percentage >= 70) return theme.palette.success.light
    if (percentage >= 50) return theme.palette.warning.main
    if (percentage >= 30) return theme.palette.warning.light
    return theme.palette.error.light
  }

  const handleHref = (link: string) => {
    const newParams: { [key: string]: string } = {}

    if (link === 'debtors_amount') {
      newParams.is_debtor = 'true'
      newParams.debt_date = `${String(selectedMonth).padStart(2, '0')}-${selectedYear}`
    } else if (link === 'is_overpaid') {
      newParams.is_overpaid = 'true'
      newParams.debt_date = `${String(selectedMonth).padStart(2, '0')}-${selectedYear}`
    }

    dispatch(updateStudentParams(newParams))
    void router.push(
      {
        pathname: '/students',
        query: newParams
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, border: '1px solid #ddd', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2
        }}
      >
        <Box>
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            {selectedYear}, {monthMap[selectedMonth]} - oyidagi rejasi
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 1, sm: 2 }, '&:last-child': { pb: { xs: 1, sm: 2 } } }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm='auto'>
              <FormControl fullWidth size='small' sx={{ minWidth: 100 }}>
                <InputLabel>Filial</InputLabel>
                <Select value={selectedBranch} label='Filial' onChange={handleBranchChange}>
                  {user?.branches?.map(branch => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm='auto'>
              <FormControl fullWidth size='small' sx={{ minWidth: 100 }}>
                <InputLabel>Yil</InputLabel>
                <Select value={selectedYear} label='Yil' onChange={handleYearChange}>
                  {availableYears.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm='auto'>
              <FormControl fullWidth size='small' sx={{ minWidth: 130 }}>
                <InputLabel>Oy</InputLabel>
                <Select value={selectedMonth} label='Oy' onChange={handleMonthChange}>
                  {Object.entries(monthMap).map(([monthNum, monthName]) => (
                    <MenuItem key={monthNum} value={Number(monthNum)}>
                      {monthName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm='auto'>
              <Tooltip title='Joriy oy'>
                <Button size='medium' variant='outlined' onClick={resetToCurrentDate}>
                  <DateRange fontSize='small' />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Card sx={{ mb: 3, boxShadow: 'none', border: '1px solid #ddd', overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0.05))',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant='h6' fontWeight='medium'>
              Bajarilish ko'rsatkichlari
            </Typography>
          </Box>

          <Box position='relative' sx={{ p: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                position: 'relative',
                height: 160,
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.03)',
                mt: 1
              }}
            >
              <LinearProgress
                variant='determinate'
                value={Math.min(percentage, 100)}
                sx={{
                  height: '100%',
                  '& .MuiLinearProgress-bar': {
                    transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    backgroundColor: getPercentageColor()
                  }
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: { xs: 2, md: 5 }
                }}
              >
                <Box>
                  <Typography color={percentage >= 25 ? 'white' : 'text.primary'} variant='h6' fontWeight='bold'>
                    Erishilgan summa
                  </Typography>
                  <Typography variant='h5' fontWeight='bold' color={percentage >= 25 ? 'white' : 'text.primary'}>
                    {formatCurrency(done_amount || 0)} so'm
                  </Typography>
                  <Chip
                    label={`${percentage.toFixed(1)}%`}
                    color={percentage >= 70 ? 'success' : percentage >= 40 ? 'warning' : 'error'}
                    size='small'
                    sx={{
                      mt: 1,
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: percentage >= 25 ? 'rgba(255,255,255,0.3)' : undefined
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography color={percentage >= 65 ? 'white' : 'text.primary'} variant='h6' fontWeight='bold'>
                    Kutilayotgan summasi
                  </Typography>
                  <Typography variant='h5' fontWeight='bold' color={percentage >= 65 ? 'white' : 'text.primary'}>
                    {formatCurrency(debts_amount)} so'm
                  </Typography>
                  <Chip
                    label={`${(percentage > 100 ? 0 : 100 - parseFloat(percentage.toFixed(1))).toFixed(1)}%`}
                    color={
                      (percentage > 100 ? 0 : 100 - percentage) >= 70
                        ? 'error'
                        : (percentage > 100 ? 0 : 100 - percentage) >= 40
                        ? 'warning'
                        : 'success'
                    }
                    size='small'
                    sx={{
                      mt: 1,
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: percentage >= 65 ? 'rgba(255,255,255,0.3)' : undefined
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              boxShadow: 2,
              background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant='subtitle1' sx={{ color: '#fff' }} fontWeight='medium'>
                  Kutilgan summa
                </Typography>
                <Assessment sx={{ opacity: 0.8 }} />
              </Box>
              <Typography variant='h5' fontWeight='bold' sx={{ color: '#fff' }}>
                {formatCurrency(planned_amount || 0)} so'm
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            onClick={() => handleHref('debtors_amount')}
            sx={{
              height: '100%',
              boxShadow: 2,
              cursor: 'pointer',
              background: `linear-gradient(145deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
              color: 'white'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant='subtitle1' fontWeight='medium' sx={{ color: '#fff' }}>
                  Qarzdorlik summasi
                </Typography>
                <TrendingDown sx={{ opacity: 0.8 }} />
              </Box>
              <Typography variant='h5' fontWeight='bold' sx={{ color: '#fff' }}>
                {formatCurrency(pending_amount || 0)} so'm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            onClick={() => handleHref('is_overpaid')}
            sx={{
              height: '100%',
              boxShadow: 2,
              cursor: 'pointer',
              background: `linear-gradient(145deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
              color: 'white'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant='subtitle1' fontWeight='medium' sx={{ color: '#fff' }}>
                  Ortiqcha to'lovlar
                </Typography>
                <TrendingUp sx={{ opacity: 0.8 }} />
              </Box>
              <Typography variant='h5' fontWeight='bold' sx={{ color: '#fff' }}>
                {formatCurrency(out_of_limit_amount || 0)} so'm
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  )
}
