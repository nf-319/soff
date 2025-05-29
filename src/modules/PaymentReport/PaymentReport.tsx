import { Box, width } from '@mui/system'
import { PaymentReportCards } from './ui/PaymentReportCards'
import { FormControl, Select, Tab, Tabs } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import { WidgetHeader } from '@components/WidgetHeader'
import { useAllBranches } from '@shared/hooks'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { uzbekMonths } from '@/shared/constants'
import { DateRangePicker } from '@/components/DateRangePicker'

export const PaymentReport = () => {
  const now = dayjs()
  const allBranches = useAllBranches()
  const { companyInfo } = useAppSelector(state => state.user)
  const [years, setYears] = useState<any[]>([])
  const [value, setValue] = useState('one')
  const searchParams = new URLSearchParams(window.location.search)

  const [branch, setBranch] = useState(searchParams.get('branch') || '')
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || String(now.year()))

  const [month, setMonth] = useState(searchParams.get('month') || uzbekMonths[now.month()])
  const [range, setRange] = useState<[Date | null, Date | null]>(() => {
    const start = searchParams.get('start_date')
    const end = searchParams.get('end_date')
    return start && end ? [new Date(start), new Date(end)] : [null, null]
  })
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  function getYearsFromDateToNow(dateStr: string) {
    const fromYear = new Date(dateStr).getFullYear()
    const currentYear = new Date().getFullYear()

    const years = []
    for (let year = fromYear; year <= currentYear; year++) {
      years.push(year)
    }

    return years
  }

  useEffect(() => {
    const params = new URLSearchParams()

    if (branch) params.set('branch', branch)
    if (selectedYear) params.set('year', selectedYear)
    if (month) params.set('month', month)
    if (range[0] && range[1]) {
      params.set('start_date', dayjs(range[0]).format('YYYY-MM-DD'))
      params.set('end_date', dayjs(range[1]).format('YYYY-MM-DD'))
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  }, [branch, selectedYear, month, range])

  useEffect(() => {
    const result = getYearsFromDateToNow(companyInfo?.created_at || '')
    setYears(result)
  }, [companyInfo.created_at])

  return (
    <Box component='section' display={'flex'} flexDirection={'column'} gap={5}>
      <WidgetHeader titleSize='large' childrenSx={{ width: '100%' }} title="To'lovlar hisoboti" isDemo>
        <Box
          display='flex'
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems='center'
          justifyContent='center'
          width='100%'
          gap={2}
        >
          <FormControl fullWidth>
            <Select
              size='small'
              displayEmpty
              value={branch}
              onChange={event => setBranch(event.target.value as string)}
            >
              {allBranches.map(branch => (
                <MenuItem value={branch.value}>{branch.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select value={selectedYear} displayEmpty onChange={e => setSelectedYear(e.target.value)} size='small'>
              {years.map(item => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Select value={month} displayEmpty onChange={e => setMonth(e.target.value)} size='small'>
              {uzbekMonths.map(item => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl fullWidth>
            <DateRangePicker
              placement='bottomEnd'
              value={range as [Date, Date]}
              onChange={val => setRange(val ?? [null, null])}
              label='Sanani tanlang'
            />
          </FormControl> */}
        </Box>
      </WidgetHeader>
      <PaymentReportCards />
      <Box>
        <Tabs value={value} onChange={handleChange} aria-label='wrapped label tabs example'>
          <Tab value='one' label="O'qituvchilar" wrapped />
          <Tab value='two' label='Hodimlar' wrapped />
        </Tabs>
      </Box>
    </Box>
  )
}

PaymentReport.displayName = 'PaymentReport'
