'use client'

import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { AuthContext } from 'src/context/AuthContext'
import DashboardPage from 'src/views/apps/dashboard/DashboardPage'
import { MentorOverview } from '@/widgets/MentorOverview'
import { Box } from '@mui/system'
import { MentorGroups } from '@/widgets/MentorGroups'
import MyGroups from '@/views/my-groups'

const AppCalendar = () => {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const pageLoad = async () => {
    if (
      !user?.role.includes('admin') &&
      !user?.role.includes('ceo') &&
      !user?.role.includes('teacher') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      void router.push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
  }

  useEffect(() => {
    void pageLoad()
  }, [])

  return user?.currentRole === 'teacher' || (user?.role.length === 1 && user.role.includes('teacher')) ? (
    <Box display="grid" gridTemplateColumns="1fr 2fr" gap={4}>
      <Box gridColumn="span 1">
        <MentorOverview />
      </Box>

      <Box gridColumn="span 1">
        <MentorGroups />
      </Box>
    </Box>

  ) : (
    <DashboardPage />
  )
}

export default AppCalendar
