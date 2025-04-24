import { ReactNode } from 'react';
import Head from 'next/head';
import { Router } from 'next/router';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useAppSelector } from 'src/store';
import NProgress from 'nprogress';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import { defaultACLObj } from 'src/configs/acl';
import themeConfig from 'src/configs/themeConfig';
import UserLayout from 'src/layouts/UserLayout';
import AclGuard from 'src/components/auth/AclGuard';
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import AuthGuard from 'src/components/auth/AuthGuard';
import GuestGuard from 'src/components/auth/GuestGuard';
import WindowWrapper from 'src/components/window-wrapper';
import Spinner from 'src/components/spinner';
import { AuthProvider } from 'src/context/AuthContext';
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';
import DisabledProvider from 'src/@core/layouts/DisabledProvider';
import { disableCache } from '@iconify/react'
import { Providers } from '@/providers'
import dynamic from 'next/dynamic'

import 'src/configs/i18n';

import 'react-perfect-scrollbar/dist/css/styles.css';
import 'src/iconify-bundle/icons-bundle-react';
import './globals.css';

const ToastPortal = dynamic(
  () => import('@/layouts/ToastPortal'),
  { ssr: false }
);

type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', NProgress.start)
  Router.events.on('routeChangeError', NProgress.done)
  Router.events.on('routeChangeComplete', NProgress.done)
}

disableCache('all')

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) return <GuestGuard>{children}</GuestGuard>
  if (authGuard) return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  return <>{children}</>
}

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: ExtendedAppProps) => {
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout = Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  const MyHead = () => {
    const { companyInfo } = useAppSelector(state => state.user)

    return (
      <Head>
        <meta name='robots' content='noindex, nofollow' />
        <title>
          {`${companyInfo?.training_center_name || 'Soffcrm'} - Taʼlim tizimini nazorat qilish platformasi`}
        </title>

        <link rel='shortcut icon' href={companyInfo.logo} />
      </Head>
    )
  }

  return (
    <Providers>
        <CacheProvider value={emotionCache}>
          <MyHead />

          <AuthProvider>
            <DisabledProvider>
              <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                  {({ settings }) => {
                    return (
                      <ThemeComponent settings={settings}>
                        <WindowWrapper>
                          <Guard authGuard={authGuard} guestGuard={guestGuard}>
                            <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                              {getLayout(<Component {...pageProps} />)}
                            </AclGuard>
                          </Guard>
                        </WindowWrapper>

                        <ToastPortal settings={settings} />
                      </ThemeComponent>
                    )
                  }}
                </SettingsConsumer>
              </SettingsProvider>
            </DisabledProvider>
          </AuthProvider>
        </CacheProvider>
    </Providers>
  )
}

export default App
