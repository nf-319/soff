import { Button } from '@mui/material'
import { Bell, MoveRight, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Alert, Container } from 'react-bootstrap'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
const AppBarWarningVertical = ({ setShowWarning }: { setShowWarning: (status: boolean) => void }) => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const userData = localStorage.getItem('userData')
  const { isMobile } = useResponsive()
  const formattedUserData = JSON.parse(userData as string)
  return (
    <Alert
      variant='danger'
      className='text-white m-0 p-0 position-relative'
      style={{ height: isMobile ? 'auto' : '40px', backgroundColor: '#FF4D4D', borderRadius: 0 }}
    >
      <Container className='d-flex flex-wrap justify-content-around align-items-center'>
        <div className='d-flex align-items-center gap-2 text-white'>
          <Bell size={14} />
          <span className='small fw-medium'>
            Tizimdan foydalanish muddati tugagungacha {formattedUserData.payment_days || 0} kun qoldi, Tizimdan uzluksiz
            foydalanish uchun to'lovni amalga oshiring
          </span>
        </div>
        {user?.currentRole == 'ceo' && (
          <Button
            onClick={() => router.push('/crm-payments')}
            sx={{ color: 'white', fontSize: 10, padding: 2, display: 'flex', gap: 2 }}
          >
            <span>To'lovni amalga oshirish</span>
            <MoveRight size={16} />
          </Button>
        )}
      </Container>

      <Button
        onClick={() => setShowWarning(false)}
        className='position-absolute'
        style={{
          top: '2px',
          right: '2px',
          color: 'white',
          background: 'transparent',
          border: 'none'
        }}
      >
        <X size={20} />
      </Button>
    </Alert>
  )
}

export default AppBarWarningVertical
