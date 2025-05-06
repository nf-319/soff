import { useContext, useEffect, useState } from 'react'

import Fab from '@mui/material/Fab'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Icon from '../../components/icon'
import themeConfig from 'src/configs/themeConfig'
import { LayoutProps } from 'src/@core/layouts/types'

import AppBar from './components/vertical/appBar'
import Customizer from '../../components/customizer'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from '../../components/scroll-to-top'
import { useAuth } from 'src/hooks/useAuth'
import StaticsModal from '../../components/statics-modal'
import QrCodeModal from '../../components/qrCode-Modal'
import { AuthContext } from 'src/context/AuthContext'
import DraggableIcon from 'src/pages/soffBotIcon'
import { useRouter } from 'next/router'
import { APP_BAR_ACCESS } from '@/shared/config'
import AppBarWarning from '@components/AppBarWarning'

const VerticalLayoutWrapper = styled(Box)({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))

const VerticalLayout = (props: LayoutProps) => {
  const { hidden, settings, children, scrollToTop, footerProps, contentHeightFixed, verticalLayoutProps } = props

  const { skin, navHidden, contentWidth } = settings
  const { navigationSize, disableCustomizer, collapsedNavigationSize } = themeConfig
  const navWidth = navigationSize
  const navigationBorderWidth = skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = collapsedNavigationSize
  const auth = useAuth()
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [navVisible, setNavVisible] = useState<boolean>(false)
  const [showWarning, setShowWarning] = useState(false)
  const userData = localStorage.getItem('userData')
  const formattedUserData = JSON.parse(userData as string)
  const toggleNavVisibility = () => setNavVisible(!navVisible)
  const subdomain = window.location.hostname.split('.')[0]


  useEffect(() => {
    if (
     !APP_BAR_ACCESS.includes(subdomain) &&
      formattedUserData.payment_days >= 0
    ) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }, [window.location.pathname])

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {navHidden && !(navHidden && settings.lastLayout === 'horizontal')
          ? null
          : !auth.user?.payment_page && (
              <Navigation
                navWidth={navWidth}
                navVisible={navVisible}
                setNavVisible={setNavVisible}
                collapsedNavWidth={collapsedNavWidth}
                toggleNavVisibility={toggleNavVisibility}
                navigationBorderWidth={navigationBorderWidth}
                navMenuContent={verticalLayoutProps?.navMenu.content}
                navMenuBranding={verticalLayoutProps?.navMenu.branding}
                menuLockedIcon={verticalLayoutProps?.navMenu.lockedIcon}
                verticalNavItems={verticalLayoutProps?.navMenu.navItems}
                navMenuProps={verticalLayoutProps?.navMenu.componentProps}
                menuUnlockedIcon={verticalLayoutProps?.navMenu.unlockedIcon}
                afterNavMenuContent={verticalLayoutProps?.navMenu.afterContent}
                beforeNavMenuContent={verticalLayoutProps?.navMenu.beforeContent}
                {...props}
              />
            )}
        <MainContentWrapper
          className='layout-content-wrapper'
          sx={{ ...(contentHeightFixed && { maxHeight: '100vh' }) }}
        >
          {showWarning && <AppBarWarning setShowWarning={setShowWarning} />}

          {!auth?.user?.payment_page && (
            <AppBar
              toggleNavVisibility={toggleNavVisibility}
              appBarContent={verticalLayoutProps?.appBar?.content}
              appBarProps={verticalLayoutProps?.appBar?.componentProps}
              {...props}
            />
          )}

          <ContentWrapper
            className='layout-page-content'
            sx={{
              ...(contentHeightFixed && {
                overflow: 'hidden',
                '& > :first-of-type': { height: '100%' },
                padding: '0 1.5rem'
              }),
              ...(contentWidth === 'boxed' && {
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' },
                padding: '0 1.5rem'
              })
            }}
          >
            {children}
          </ContentWrapper>

          <Footer footerStyles={footerProps?.sx} footerContent={footerProps?.content} {...props} />
          {(user?.role.includes('ceo') || user?.role.includes('admin')) && !router.pathname.includes('/c-panel') && (
            <DraggableIcon />
          )}
        </MainContentWrapper>
      </VerticalLayoutWrapper>

      {disableCustomizer || hidden ? null : <Customizer />}

      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <Icon icon='mdi:arrow-up' />
          </Fab>
        </ScrollToTop>
      )}

      {(user?.role.includes('admin') || user?.role.includes('ceo')) && !router.pathname.includes('/c-panel') && (
        <StaticsModal />
      )}
      <QrCodeModal />
    </>
  )
}

export default VerticalLayout
