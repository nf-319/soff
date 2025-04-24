import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'

interface GuestGuardProps {
  children: ReactNode
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children } = props
  const router = useRouter()

  if (router.pathname.split('/').includes('r')) {
    return <>{children}</>
  }

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (window.localStorage.getItem('userData')) {
      void router.push('/')
    }
  }, [router.route])

  return <>{children}</>
}

export default GuestGuard
