'use client'

import { useEffect, FC, PropsWithChildren, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { Loading } from 'src/components'

export const PublicGuard: FC<PropsWithChildren> = ({ children }) => {
  const auth = useAuth()
  const router = useRouter()

  if (router.pathname.split('/').includes('r')) {
    return <Fragment>{children}</Fragment>
  }

  useEffect(() => {
    if (!router.isReady) return

    const storedUser = window.localStorage.getItem('userData')

    try {
      const userData = storedUser ? JSON.parse(storedUser) : null
      if (userData && typeof userData === 'object') {
        void router.push('/')
      }
    } catch (error) {
      window.localStorage.removeItem('userData')
    }
  }, [router.isReady])


  if (auth.loading || (!auth.loading && auth.user !== null)) {
    return <Loading />
  }

  return <Fragment>{children}</Fragment>
}

PublicGuard.displayName = 'PublicGuard'
