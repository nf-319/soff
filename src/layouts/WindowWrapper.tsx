'use client'

import { useState, useEffect, FC, PropsWithChildren, Fragment } from 'react'
import { useRouter } from 'next/router'

export const WindowWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowReadyFlag(true)
    }
  }, [router.route])

  return windowReadyFlag ? <Fragment>{children}</Fragment> : null
}

WindowWrapper.displayName = 'WindowWrapper'
