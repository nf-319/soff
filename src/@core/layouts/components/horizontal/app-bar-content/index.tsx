import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { LayoutProps } from 'src/@core/layouts/types'
import { useAppSelector } from 'src/store'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Props {
  hidden: LayoutProps['hidden']
  settings: LayoutProps['settings']
  saveSettings: LayoutProps['saveSettings']
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content']
  appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding']
}

const StyledLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const AppBarContent = (props: Props) => {
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props
  const { companyInfo } = useAppSelector((state: any) => state.user)


  const [logoSrc, setLogoSrc] = useState<string | null>(null)

  useEffect(() => {
    if (companyInfo?.logo) {
      setLogoSrc(companyInfo.logo)
    }
  }, [companyInfo])

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <StyledLink href='/'>
          {logoSrc && (
            <Image
              src={logoSrc}
              alt='Brand logo'
              height={35}
              width={100}
              style={{ objectFit: 'scale-down', width: 'auto' }}
              onError={() => setLogoSrc('/images/default-logo.jpg')}
            />
          )}

          <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
            {companyInfo.training_center_name || 'SOFF CRM'}
          </Typography>
        </StyledLink>
      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
