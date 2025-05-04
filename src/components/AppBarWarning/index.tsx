import { Button } from '@mui/material'
import { Bell, MoveRight, TriangleAlert, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Alert, Container } from 'react-bootstrap'
import { AuthContext } from 'src/context/AuthContext'

const AppBarWarning = ({ setShowWarning }: { setShowWarning: (status: boolean) => void }) => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const userData = localStorage.getItem('userData')

  const formattedUserData = JSON.parse(userData as string)
  const daysLeft = formattedUserData.payment_days || 0

  if (daysLeft > 7) {
    return null
  }

  const isCritical = daysLeft <= 2
  const backgroundColor = isCritical ? '#FF4D4D' : '#FFC107'
  const textColor = isCritical ? 'white' : '#333333'
  const alertVariant = isCritical ? 'danger' : 'warning'

  return (
    <Alert
      variant={alertVariant}
      className='m-0 p-0 position-relative'
      style={{
        height: '40px',
        backgroundColor: backgroundColor,
        borderRadius: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Container className='d-flex justify-content-between align-items-center h-100'>
        <div className='d-flex align-items-center gap-2' style={{ color: textColor }}>
          <TriangleAlert size={20} className='me-1' />
          <span className='small fw-medium'>
            Tizimdan foydalanish muddati tugagungacha <b>{daysLeft}</b> kun qoldi! Tizimdan uzluksiz foydalanish
            uchun to'lovni amalga oshiring
          </span>
        </div>
        {user?.currentRole == 'ceo' && (
          <Button
            onClick={() => router.push('/crm-payments')}
            sx={{
              color: textColor,
              fontSize: 11,
              padding: '4px 10px',
              display: 'flex',
              gap: 1,
              fontWeight: 'medium',
              '&:hover': {
                backgroundColor: isCritical ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <span>To'lovni amalga oshirish</span>
            <MoveRight size={14} />
          </Button>
        )}
      </Container>

      <Button
        onClick={() => setShowWarning(false)}
        className='position-absolute'
        style={{
          top: '4px',
          right: '4px',
          color: textColor,
          background: 'transparent',
          border: 'none',
          padding: '4px',
          minWidth: 'unset',
          opacity: 0.8,
        }}
      >
        <X size={18} />
      </Button>
    </Alert>
  )
}

export default AppBarWarning
