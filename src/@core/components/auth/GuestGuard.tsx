// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  if (router.pathname.split('/').includes('r')) {
    return <>{children}</>
  }

  const handleUserCheck = () => {
    if (window.localStorage.getItem('userData')) {
      router.replace('/')
    }
  }
  useEffect(() => {
    if (!router.isReady) {
      return
    }

    handleUserCheck()
  }, [router.route])

  handleUserCheck()

  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
