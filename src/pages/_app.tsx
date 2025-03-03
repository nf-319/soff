import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'
import { defaultACLObj } from 'src/configs/acl'
import { Toaster } from 'react-hot-toast'
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'
import DisabledProvider from 'src/@core/layouts/DisabledProvider'
import { disableCache } from '@iconify/react'
import { Guard, Providers, ThemeProvider } from 'src/providers'
import { MyHead } from 'src/@core/components/Head'
import { WindowWrapper } from 'src/layouts'

import './globals.css'
import 'src/configs/i18n'

type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

disableCache('all')

const App = ({ Component, emotionCache = clientSideEmotionCache, pageProps }: ExtendedAppProps) => {
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  return (
    <Providers>
      <CacheProvider value={emotionCache}>
        <MyHead />

        <AuthProvider>
          <DisabledProvider>
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
              <SettingsConsumer>
                {({ settings }) => (
                  <ThemeProvider settings={settings}>
                    <WindowWrapper>
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                    </WindowWrapper>

                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </ThemeProvider>
                )}
              </SettingsConsumer>
            </SettingsProvider>
          </DisabledProvider>
        </AuthProvider>
      </CacheProvider>
    </Providers>
  )
}

App.displayName = 'App'
export default App
