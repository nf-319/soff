'use client'

import { ReactNode } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'

type FooterIllustrationsProp = {
  image?: ReactNode
}

const MaskImg = styled('img')(({ theme }) => ({
  zIndex: -1,
  bottom: '0',
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: '17.5%'
  }
}))

const FooterIllustrationsV2 = (props: FooterIllustrationsProp) => {
  const { image } = props
  const hidden = useMediaQuery('md')
  const src = (image as string) || `/images/request-form-bg.svg`

  if (!hidden) {
    return <>{image && typeof image !== 'string' ? image : <MaskImg alt='mask' src={src} />}</>
  } else {
    return null
  }
}

FooterIllustrationsV2.displayName = 'FooterIllustrationsV2'
export default FooterIllustrationsV2
