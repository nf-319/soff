import { useRouter } from 'next/router'
import { MentorProfile } from '@modules/MentorProfile'

const MentorDetailPage = () => {
  const router = useRouter()
  const { id } = router.query

  return <MentorProfile id={String(id)} />
}

MentorDetailPage.displayName = 'MentorDetailPage'
export default MentorDetailPage
