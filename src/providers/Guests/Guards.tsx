import { FC, Fragment, PropsWithChildren } from 'react'
import { PublicGuard } from './PublicGuest'
import { ProtectedGuard } from './ProtectedGuest'

type Props = {
  authGuard: boolean
  guestGuard: boolean
}

export const Guard: FC<PropsWithChildren<Props>> = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) return <PublicGuard>{children}</PublicGuard>
  if (authGuard) return <ProtectedGuard>{children}</ProtectedGuard>

  return <Fragment>{children}</Fragment>
}

Guard.displayName = 'Guard'
