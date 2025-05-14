'use client'

import { Box } from '@mui/system'
import { MentorOverview } from '@/widgets/MentorOverview'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { useAuth } from '@hooks/useAuth'

const MentorProfile = () => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const pageLoad = async () => {
      if (user?.currentRole === 'teacher') {
        toast.error('Sahifaga kirish huquqingiz yoq!')
        void router.push('/')
      }
    }

    void pageLoad()
  }, [])

  return (
    <Box>
      <MentorOverview />
      {/*<MentorTable />*/}
    </Box>
  )
}

MentorProfile.displayName = 'MentorProfile'
export default MentorProfile
