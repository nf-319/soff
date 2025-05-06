import { Button } from '@mui/material'
import { MoveRight, TriangleAlert, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Alert, Container, Row, Col } from 'react-bootstrap'
import { AuthContext } from 'src/context/AuthContext'
import useResponsive from '@/@core/hooks/useResponsive'

const AppBarWarning = ({ setShowWarning }: { setShowWarning: (status: boolean) => void }) => {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const userData = localStorage.getItem('userData')
  const { isMobile } = useResponsive()

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
        backgroundColor: backgroundColor,
        borderRadius: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'visible'
      }}
    >
      <Container fluid className='px-3 py-2'>
        <Row className='align-items-center'>
          <Col xs={1} sm={1} className='p-0 d-flex justify-content-center'>
            <TriangleAlert
              size={24}
              style={{
                color: textColor,
                minWidth: '24px',
                flexShrink: 0
              }}
            />
          </Col>
          <Col xs={8} sm={7} md={8} className='p-0 ps-2'>
            <span className='small fw-medium' style={{ color: textColor }}>
              Tizimdan foydalanish muddati tugagungacha <b>{daysLeft}</b> kun qoldi!{' '}
              {!isMobile && "Tizimdan uzluksiz foydalanish uchun to'lovni amalga oshiring"}
            </span>
          </Col>
          {user?.currentRole == 'ceo' && (
            <Col xs={3} sm={4} md={3} className='p-0 d-flex justify-content-end'>
              <Button
                onClick={() => router.push('/crm-payments')}
                sx={{
                  color: textColor,
                  fontSize: { xs: 10, sm: 11 },
                  padding: { xs: '3px 6px', sm: '6px 20px' },
                  display: 'flex',
                  marginRight: { xs: 0, sm: 30 },
                  gap: 0.5,
                  fontWeight: 'medium',
                  whiteSpace: 'nowrap',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: isCritical ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                  }
                }}
              >
                <span>To'lovni</span>
                <MoveRight size={14} />
              </Button>
            </Col>
          )}
        </Row>
      </Container>

      <Button
        onClick={() => setShowWarning(false)}
        sx={{
          position: 'absolute',
          top: { xs: '2px', sm: '10px' },
          right: { xs: '2px', sm: '10px' },
          color: textColor,
          background: 'transparent',
          border: 'none',
          padding: '4px',
          minWidth: '28px',
          width: '28px',
          height: '28px',
          opacity: 0.8,
          zIndex: 10,
          '&:hover': {
            opacity: 1,
            background: 'rgba(0,0,0,0.05)'
          }
        }}
      >
        <X size={22} />
      </Button>
    </Alert>
  )
}

export default AppBarWarning
