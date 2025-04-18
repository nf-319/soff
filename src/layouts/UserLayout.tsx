'use client'

import { FC, PropsWithChildren, useContext, useEffect } from 'react'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Layout from 'src/@core/layouts/Layout'
import VerticalNavItems, { CPanelNavigation, StudentNavigation, TeacherNavigation } from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'
import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'
import { useSettings } from 'src/@core/hooks/useSettings'
import { AuthContext } from 'src/context/AuthContext'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import QRCodeScanner from '../components/qrCodeScanner'
import api from '../@core/utils/api'
import { setCompanyInfo } from '../store/apps/user'
import { useDispatch } from 'react-redux'
import AppBarWarningVertical from 'src/components/AppBarWarningVertical'

type Props = {
  contentHeightFixed?: boolean
}

const UserLayout: FC<PropsWithChildren<Props>> = ({ children, contentHeightFixed }) => {
  const { settings, saveSettings } = useSettings()
  const { user } = useContext(AuthContext)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const router = useRouter()

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const resp = await api.get('common/settings/list/')
        dispatch(setCompanyInfo(resp.data[0]))
      } catch (error) {
        console.error('Error fetching company info:', error)
      }
    }

    void fetchCompanyInfo()
  }, [dispatch])


  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems:
          router.pathname.split('/')?.[1] === 'c-panel'
          ? CPanelNavigation(t)
          : user?.role.length === 1 && user?.role.includes('teacher')
          ? TeacherNavigation(t)
          : user?.role.includes('student')
          ? StudentNavigation(t)
          : user?.role.includes('teacher')
          ? VerticalNavItems(t)
          : VerticalNavItems(t)
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
            hidden={hidden}
            settings={settings}
            saveSettings={saveSettings}
            toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems:
            router.pathname.split('/')?.[1] === 'c-panel'
            ? CPanelNavigation(t)
            : user?.currentRole === 'teacher' || user?.role.length === 1 && user?.role.includes('teacher')
            ? TeacherNavigation(t)
            : user?.role.includes('student')
            ? StudentNavigation(t)
            : HorizontalNavItems(t)
          },
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {children}

      {user?.currentRole !== "student" && <QRCodeScanner />}
    </Layout>
  )
}

export default UserLayout
