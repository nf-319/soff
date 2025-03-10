'use client'

import { useEffect, FC, PropsWithChildren, Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { Loading } from 'src/components'

export const PublicGuard: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth()
  const router = useRouter()
  const [forcedRender, setForcedRender] = useState(false)

  if (router.pathname.split('/').includes('r')) {
    return <Fragment>{children}</Fragment>
  }

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (auth.loading) {
        setForcedRender(true)
        try {
          window.localStorage.clear()
        } catch (error) {
          console.error('Failed to clear userData:', error)
        }
      }
    }, 3000)

    return () => clearTimeout(loadingTimeout)
  }, [auth.loading])

  useEffect(() => {
    if (!router.isReady) return

    let redirectTimeout: NodeJS.Timeout

    try {
      const storedUser = window.localStorage.getItem('userData')

      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData && typeof userData === 'object') {
            redirectTimeout = setTimeout(() => {
              void router.push('/')
            }, 100)
          }
        } catch (parseError) {
          console.error('Error parsing userData:', parseError)
          window.localStorage.clear()
        }
      }
    } catch (storageError) {
      console.error('Error accessing localStorage:', storageError)
    }

    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout)
    }
  }, [router.isReady, router])

  if (forcedRender) {
    return <Fragment>{children}</Fragment>
  }

  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return <Loading />
  }

  return <Fragment>{children}</Fragment>
}

PublicGuard.displayName = 'PublicGuard'
