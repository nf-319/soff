import { Box, Button, Chip, IconButton, Pagination, Typography, Select, MenuItem } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatCurrency } from 'src/@core/utils/format-currency'
import 'react-datepicker/dist/react-datepicker.css'
import DataTable from '../../../components/table'
import { useAppDispatch, useAppSelector } from 'src/store'
import { getAdvanceList, getStaffs, setOpenCreateModal, updateParams } from 'src/store/apps/finance/advanceSlice'
import CreateModal from 'src/views/apps/finance/advance/CreateModal'
import EditModal from 'src/views/apps/finance/advance/EditModal'
import { monthItems, yearItems } from 'src/views/apps/finance/FinanceAllNumber'
import { today } from '../../../components/card-statistics/kanban-item'
import IconifyIcon from '../../../components/icon'
import Router, { useRouter } from 'next/router'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'

function Slug() {
  const { isLoading, queryParams, advanceList, columns } = useAppSelector(state => state.advanceSlice)
  const dispatch = useAppDispatch()
  const { allNumbersParams } = useAppSelector(state => state.finance)
  const [year, setYear] = useState<number>(Number(allNumbersParams.date_year.split('-')[0]))
  const [month, setMonth] = useState<string>(allNumbersParams.date_month)

  const { user } = useContext(AuthContext)
  const router = useRouter()

  const { t } = useTranslation()
  const { isMobile } = useResponsive()

    console.log(year,month);
    
    
  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('casher') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      toast.error('Sahifaga kirish huquqingiz yoq!')
      router.push('/')
    }
    const queryString = new URLSearchParams({ ...queryParams, page: `1`,date_year:`${year}-${month}-01`,date_month:`${year}-${month}-01` }).toString()
    dispatch(getAdvanceList(queryString))
    dispatch(getStaffs())
  }, [])

  const handlePagination = async (page: number) => {
    const queryString = new URLSearchParams({ ...queryParams, page: String(page) }).toString()
    dispatch(updateParams({ page: page }))
    await dispatch(getAdvanceList(queryString))
  }

  const handleYearDate = async (value: any, t: 'm' | 'y') => {
    let params: any = {
      date_year: ``,
      date_month: ``
    }

    if (value) {
      if (t === 'y') {
        setYear(value)
        setMonth(``)
        params.date_year = `${value}-01-01`
      } else {
        setMonth(value)
        params.date_month = `${year}-${value}-01`
        params.date_year = `${year}-01-01`
      }
    } else {
      if (t === 'y') {
        setYear(new Date().getFullYear())
      } else {
        setMonth(today.split('-')[1])
      }
    }
    const queryString = new URLSearchParams({ ...queryParams, ...params }).toString()
    dispatch(updateParams(params))
    await dispatch(getAdvanceList(queryString))
  }

  return (
    <Box>
      <Box className='header'>
        <Box
          sx={{
            display: isMobile ? 'grid' : 'flex',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            alignItems: 'center',
            mb: 4,
            px: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center', order: 1 }}>
            <IconButton color='primary'>
              <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={() => Router.back()} />
            </IconButton>
            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Avanslar')}</Typography>
          </Box>
          <Select
            value={year}
            onChange={e => handleYearDate(e.target.value, 'y')}
            size='small'
            sx={{ width: isMobile ? 'auto' : 224, margin: isMobile ? '0' : '0 10px 0 auto', order: 3 }}
          >
            {yearItems.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={month}
            onChange={e => handleYearDate(e.target.value, 'm')}
            size='small'
            sx={{ width: isMobile ? 'auto' : 224, order: 4 }}
          >
            {monthItems.map(item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <Typography
            sx={{
              fontSize: '14px',
              order: 2,
              color: 'error.main',
              ml: 4,
              display: 'flex',
              alignItems: 'center',
              mr: 4,
              gap: '5px'
            }}
          >
            <Chip
              variant='outlined'
              size='medium'
              sx={{ fontSize: '14px', fontWeight: 'bold' }}
              color='success'
              label={`${formatCurrency(advanceList?.total_prepayments)} UZS`}
            />
          </Typography>
          <Button
            variant='contained'
            size='small'
            sx={{ order: 5, gridColumn: '1/3' }}
            onClick={() => dispatch(setOpenCreateModal(true))}
          >
            {t('Avans berish')}
          </Button>
        </Box>
      </Box>
      <DataTable loading={isLoading} columns={columns} data={advanceList?.results as []} />
      {advanceList && advanceList?.count > 10 && !isLoading && (
        <Pagination
          defaultPage={queryParams?.page || 1}
          count={Math.ceil(advanceList?.count / 10)}
          variant='outlined'
          shape='rounded'
          onChange={(e: any, page) => handlePagination(page)}
        />
      )}
      <CreateModal />
      <EditModal />
    </Box>
  )
}

export default Slug
