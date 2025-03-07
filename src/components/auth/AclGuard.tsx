import { FC, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { ACLObj, AppAbility } from '../../configs/acl'
import { AbilityContext } from '../../layouts/components/acl/Can'
import { buildAbilityFor } from '../../configs/acl'
import NotAuthorized from '../../pages/401'
import BlankLayout from '../../@core/layouts/BlankLayout'
import { useAuth } from '../../hooks/useAuth'
import { Loading } from '../Loading'

type Props = {
  children: ReactNode
  guestGuard: boolean
  aclAbilities: ACLObj
}

const AclGuard: FC<Props> = ({ aclAbilities, children, guestGuard }) => {
  const [ability, setAbility] = useState<AppAbility | null>(null)
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.user?.role) {
      setAbility(buildAbilityFor(auth.user.role, aclAbilities.subject))
    }
  }, [auth.user, aclAbilities.subject])

  if (guestGuard || ['/404', '/500', '/'].includes(router.route)) {
    return <>{children}</>
  }

  if (!auth.user) {
    return null
  }

  if (!ability) {
    return <Loading />
  }

  if (ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

AclGuard.displayName = 'AclGuard'
export default AclGuard
