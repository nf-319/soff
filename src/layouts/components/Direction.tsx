'use client'

import { useEffect, FC, PropsWithChildren } from 'react'
import { Direction as DrectionUI } from '@mui/material'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import stylisRTLPlugin from 'stylis-plugin-rtl'

type Props = {
  direction: DrectionUI
}

const styleCache = () =>
  createCache({
    key: 'rtl',
    prepend: true,
    stylisPlugins: [stylisRTLPlugin]
  })

export const Direction: FC<PropsWithChildren<Props>> = ({ children, direction }) => {
  useEffect(() => {
    document.dir = direction
  }, [direction])

  if (direction === 'rtl') {
    return <CacheProvider value={styleCache()}>{children}</CacheProvider>
  }

  return <>{children}</>
}

Direction.displayName = 'Direction'
