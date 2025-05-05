import { CSSProperties, FC, PropsWithChildren } from 'react'
import Link from 'next/link'
import { cleanPhone } from '@/shared/utils'

type Props = {
  phone?: string
  style?: CSSProperties
}

export const PhoneLink: FC<PropsWithChildren<Props>> = ({ children, phone, style = { textDecoration: 'none' } }) => {
  const cleaned = cleanPhone(phone)
  const href = cleaned ? `https://onmap.uz/tel/${cleaned}` : '#'

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </Link>
  )
}

PhoneLink.displayName = 'PhoneLink'
