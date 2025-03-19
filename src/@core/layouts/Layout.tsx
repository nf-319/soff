import { useContext, useEffect, useRef, useState } from 'react'
import { LayoutProps } from 'src/@core/layouts/types'
import VerticalLayout from './VerticalLayout'
import HorizontalLayout from './HorizontalLayout'
import { useAppDispatch } from 'src/store'
import { toggleModal } from 'src/store/apps/page'
import { AuthContext } from 'src/context/AuthContext'
import { useRouter } from 'next/router'

const Layout = (props: LayoutProps) => {
  const { hidden, children, settings, saveSettings } = props
  const dispatch = useAppDispatch()
  let currentDate = new Date().toISOString()
  const { user } = useContext(AuthContext)
  const isCollapsed = useRef(settings.navCollapsed)
  const router = useRouter()
  const getYearMonthDay = (timestamp: any) => {
    if (timestamp) {
      const [date] = timestamp.split('T')
      return date
    }
  }

  const formattedCurrentDate = getYearMonthDay(currentDate)
  const formattedLastLogin = getYearMonthDay(user?.last_login)

  useEffect(() => {
    if (formattedCurrentDate !== formattedLastLogin) {
      if (router.pathname !== '/c-panel' || !user?.role.includes('student')) {
        dispatch(toggleModal(true))
      }
    }
  }, [])

  useEffect(() => {
    if (hidden) {
      if (settings.navCollapsed) {
        saveSettings({ ...settings, navCollapsed: false, layout: 'vertical' })
        isCollapsed.current = true
      }
    } else {
      if (isCollapsed.current) {
        saveSettings({ ...settings, navCollapsed: true, layout: settings.lastLayout })
        isCollapsed.current = false
      } else {
        if (settings.lastLayout !== settings.layout) {
          saveSettings({ ...settings, layout: settings.lastLayout })
        }
      }
    }
  }, [hidden])

  if (settings.layout === 'horizontal') {
    return <HorizontalLayout {...props}>{children}</HorizontalLayout>
  }

  return <VerticalLayout {...props}>{children}</VerticalLayout>
}

export default Layout
