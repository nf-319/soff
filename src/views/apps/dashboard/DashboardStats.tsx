// @ts-nocheck
'use client'

import Box from '@mui/material/Box'
import { useAppDispatch, useAppSelector } from 'src/store'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Skeleton, Tooltip } from '@mui/material'
import { updateStudentParams } from 'src/store/apps/students'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { useGet } from 'src/hooks/useApi'
import { AuthContext } from 'src/context/AuthContext'
import { useContext, useEffect } from 'react'
import IconifyIcon from '@components/icon'
import CardStatsVertical from '@components/card-statistics/card-stats-vertical'

const DashboardStats = () => {
  const { statsData } = useAppSelector(state => state.dashboard)

  const dispatch = useAppDispatch()
  const { isMobile, isTablet } = useResponsive()
  const { push } = useRouter()
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const { data: stats, isLoading, refetch } = useGet('common/dashboard/statistic-list/')

  useEffect(() => {
    const fetchData = async () => {
      await refetch()
    }

    void fetchData()
  }, [user?.active_branch, refetch])

  function click(link) {
    if (link === 'debtors_amount') {
      dispatch(updateStudentParams({ is_debtor: true, last_payment: '' }))
      return push('/students')
    } else if (link === 'active_debts_count') {
      dispatch(updateStudentParams({ is_debtor: true, last_payment: '' }))
      return push('/students')
    } else if (link === 'last_payment') {
      dispatch(updateStudentParams({ is_debtor: '', last_payment: true }))
      return push('/students')
    } else if (link === 'group_status') {
      dispatch(updateStudentParams({ group_status: 'new' }))
      return push('/students')
    } else if (link === 'active_students') {
      dispatch(updateStudentParams({ group_status: 'active' }))
      return push('/students')
    } else if (link === 'not_activated') {
      dispatch(updateStudentParams({ group_status: 'not_activated' }))
      return push('/students')
    }

    void push(link)
  }

  const tooltip = {
    active_groups: 'Faol guruhlar soni.',
    active_students: "Ayni vaqtda faol o'quvchilar soni",
    active_debts_count: `Umumiy qarzdor o'quvchilar soni : ${stats?.debtor_users} ta, arxivdagi o'quvchilar soni : ${stats?.active_debts_count} ta (1 ta o'quvchi 2 va undan ortiq guruhda o'qishi mumkin)`,
    active_debts_amount: `Umumiy o'quvchilar qarzdorligi : ${formatCurrency(stats?.debtors_amount) + " so'm"}
    ${
      stats?.archive_debts_amount < 0 &&
      `Arxivdagi o'quvchilar qarzdorligi : ${formatCurrency(stats.archive_debts_amount) + " so'm"}`
    }
    `,
    leads_count: "Hozirda faol bo'lgan va ishlov berilishi kerak bo'lgan lidlar ro'yxati.",
    not_activated_students: "Sinov darsiga kelib ketgan o'quvchilar soni",
    payment_approaching: "To'lov qilishiga 7 kundan kam qolgan o'quvchilar soni",
    teacher_count: "O'qituvchilar soni",
    test_students: "Sinov darsida o'qiyotgan o'quvchilar soni"
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: '12px',
        width: '100%',
        mb: 4,
        gridTemplateColumns: {
          xs: 'repeat(3, minmax(40px, 1fr))',
          sm: 'repeat(4, minmax(80px, 1fr))',
          md: 'repeat(auto-fill, minmax(100px, 1fr))',
          lg: 'repeat(auto-fill, minmax(130px, 1fr))'
        }
      }}
    >
      {isLoading &&
        Array.from({ length: 9 }).map((_, index) => (
          <Box key={`skeleton-${index}`} sx={{ width: '100%', height: '100%' }}>
            <Skeleton
              sx={{ bgcolor: 'grey.200' }}
              variant='rectangular'
              width={'100%'}
              height={110}
              style={{ borderRadius: '8px' }}
              animation='wave'
            />
          </Box>
        ))}

      {stats && !isLoading && (
        <>
          {statsData
            .filter(el => stats?.[el.key] !== undefined)
            .map((item, index) => (
              <Tooltip key={`${item.key}-${index}`} arrow title={t(tooltip[item.key] || '')} enterDelay={2000}>
                <Box
                  sx={{
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onClick={() => click(item.link)}
                >
                  <CardStatsVertical
                    data_key={item.key}
                    stats={t(item.title)}
                    title={stats?.[item.key] || '0'}
                    color={item.color}
                    icon={<IconifyIcon fontSize={isMobile ? '1.2rem' : '1.5rem'} icon={item.icon} />}
                  />
                </Box>
              </Tooltip>
            ))}
        </>
      )}
    </Box>
  )
}

DashboardStats.displayName = 'DashboardStats'
export default DashboardStats
