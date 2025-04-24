import { Box, Card, Typography } from '@mui/material'
import { ArrowRightLeft, Award, Clock, TrendingDown, TrendingUp, TriangleAlert, User } from 'lucide-react'

const LidsReportsCard = () => {
  return (
    <div className='row w-full g-4'>
      <div className='col-12  col-sm-6 col-md-3 col-lg-2'>
        <Card
          sx={{
            padding: 5,
            height: '100%',
            transition: '0.3s',
            border: '1px solid hsl(240, 5.9%, 90%)',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
              cursor: 'pointer'
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className='d-flex justify-content-between align-items-start'>
              <User size={40} color='black' />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: '#29bf12',
                  px: 3,
                  py: 1,
                  borderRadius: 1
                }}
              >
                <TrendingUp size={16} color='white' />
                <Typography color='white' fontSize={13} fontWeight={500}>
                  12.5%
                </Typography>
              </Box>
            </div>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>1245</Typography>
            <Typography sx={{ fontSize: 15 }}>New Leads</Typography>
            <Typography
              sx={{
                fontSize: 15,
                color: 'black',
                marginTop: 2,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'background-color 0.3s ease', // smooth hover transition
                '&:hover': {
                  backgroundColor: '#f0f0f0'
                }
              }}
            >
              View Details
            </Typography>
          </div>
        </Card>
      </div>
      <div className='col-12  col-sm-6 col-md-3 col-lg-2'>
        <Card
          sx={{
            padding: 5,
            height: '100%',
            transition: '0.3s',
            border: '1px solid hsl(240, 5.9%, 90%)',

            boxShadow: 'none',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
              cursor: 'pointer'
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className='d-flex justify-content-between align-items-start'>
              <ArrowRightLeft size={40} color='#29bf12' />
              <Box
                sx={{
                  background: '#29bf12',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  paddingX: 3,
                  paddingY: 1,
                  borderRadius: 1
                }}
              >
                <TrendingUp size={16} color='white' />
                <Typography color={'white'} fontSize={13} fontWeight={500}>
                  12.5%
                </Typography>
              </Box>
            </div>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>1245</Typography>
            <Typography sx={{ fontSize: 15 }}>New Leads</Typography>
            <Typography sx={{ fontSize: 15, color: 'black', marginTop: 2, cursor: 'pointer' }}>View Details</Typography>
          </div>
        </Card>
      </div>
      <div className='col-12  col-sm-6 col-md-3 col-lg-2'>
        <Card
          sx={{
            padding: 5,
            height: '100%',
            transition: '0.3s',
            border: '1px solid hsl(240, 5.9%, 90%)',

            boxShadow: 'none',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
              cursor: 'pointer'
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className='d-flex justify-content-between align-items-start'>
              <TriangleAlert size={40} color='#ef233c' />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: '#ef233c',
                  paddingX: 3,
                  paddingY: 1,
                  borderRadius: 1
                }}
              >
                <TrendingDown size={16} color='white' />
                <Typography color={'white'} fontSize={13} fontWeight={500}>
                  12.5%
                </Typography>
              </Box>
            </div>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>1245</Typography>
            <Typography sx={{ fontSize: 15 }}>New Leads</Typography>
            <Typography sx={{ fontSize: 15, color: 'black', marginTop: 2, cursor: 'pointer' }}>View Details</Typography>
          </div>
        </Card>
      </div>
      <div className='col-12  col-sm-6 col-md-3 col-lg-2'>
        <Card
          sx={{
            padding: 5,
            height: '100%',
            transition: '0.3s',
            border: '1px solid hsl(240, 5.9%, 90%)',

            boxShadow: 'none',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
              cursor: 'pointer'
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className='d-flex justify-content-between align-items-start'>
              <Clock size={40} color='#ffc300' />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: '#ef233c',
                  paddingX: 3,
                  paddingY: 1,
                  borderRadius: 1
                }}
              >
                <TrendingDown size={16} color='white' />

                <Typography color={'white'} fontSize={13} fontWeight={500}>
                  12.5%
                </Typography>
              </Box>
            </div>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>12 min</Typography>
            <Typography sx={{ fontSize: 15 }}>Response Time</Typography>
            <Typography sx={{ fontSize: 15, color: 'black', marginTop: 2, cursor: 'pointer' }}>View Details</Typography>
          </div>
        </Card>
      </div>
      <div className='col-12  col-sm-6 col-md-3 col-lg-2'>
        <Card
          sx={{
            padding: 5,
            height: '100%',
            transition: '0.3s',
            border: '1px solid hsl(240, 5.9%, 90%)',

            boxShadow: 'none',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
              cursor: 'pointer'
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className='d-flex justify-content-between align-items-start'>
              <TriangleAlert size={40} color='#ef233c' />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  background: '#ef233c',
                  paddingX: 3,
                  paddingY: 1,
                  borderRadius: 1
                }}
              >
                <TrendingDown size={16} color='white' />

                <Typography color={'white'} fontSize={13} fontWeight={500}>
                  12.5%
                </Typography>
              </Box>
            </div>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>1245</Typography>
            <Typography sx={{ fontSize: 15 }}>New Leads</Typography>
            <Typography sx={{ fontSize: 15, color: 'black', marginTop: 2, cursor: 'pointer' }}>View Details</Typography>
          </div>
        </Card>
      </div>
      <div className='col-12  col-sm-6 col-md-3 col-lg-2'>
        <Card
          sx={{
            padding: 5,
            height: '100%',
            transition: '0.3s',
            border: '1px solid hsl(240, 5.9%, 90%)',

            boxShadow: 'none',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
              cursor: 'pointer'
            }
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div className='d-flex justify-content-between align-items-start'>
              <Award size={40} color='#7209b7' />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#29bf12',
                  gap: 1,
                  paddingX: 3,
                  paddingY: 1,
                  borderRadius: 1
                }}
              >
                <TrendingUp size={16} color='white' />
                <Typography color={'white'} fontSize={13} fontWeight={500}>
                  12.5%
                </Typography>
              </Box>
            </div>
            <Typography sx={{ fontWeight: 700, fontSize: 22, color: 'black' }}>John Doe</Typography>
            <Typography sx={{ fontSize: 15 }}>Best Sales Rep</Typography>
            <Typography sx={{ fontSize: 15, color: 'black', marginTop: 2, cursor: 'pointer' }}>View Details</Typography>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LidsReportsCard
