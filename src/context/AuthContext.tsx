import { createContext, useEffect, useState, ReactNode } from 'react'

import { useRouter } from 'next/router'

import authConfig from 'src/configs/auth'

import { AuthValuesType, UserDataType } from './types'
import api from 'src/@core/utils/api'
import { setCompanyInfo, setRoles } from 'src/store/apps/user'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'src/store'
import Cookies from 'js-cookie'

const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  logout: () => Promise.resolve(),
  initAuth: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const { i18n } = useTranslation()
  const router = useRouter()
  const { pathname, query, asPath } = router

  const dispatch = useAppDispatch()

  const initAuth = async (): Promise<void> => {
    const token = Cookies.get(authConfig.storageTokenKeyName)

    if (token) {
      const settings: any = window.localStorage.getItem('settings')
      void i18n.changeLanguage(JSON.parse(settings)?.locale || 'uz')

      setLoading(true)

      await api
        .get(authConfig.meEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(async response => {
          setLoading(false)
          if (response?.data) {
            dispatch(
              setRoles(response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()))
            )
          }
          setUser({
            payment_days: response.data?.payment_days,
            phone: response.data.phone,
            last_login: response.data?.last_login,
            gpa: response.data.gpa,
            id: response.data.id,
            fullName: response.data.first_name,
            username: response.data.phone,
            password: 'null',
            avatar: response.data.image,
            payment_page: response.data.payment_page,
            role: response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase()),
            balance: response.data?.balance || 0,
            branches: response.data.branches.filter((item: any) => item.exists === true),
            active_branch: response.data.active_branch,
            qr_code: response.data.qr_code
          })
        })
        .catch(() => {
          const allCookies = Cookies.get()
          Object.keys(allCookies).forEach(cookieName => {
            Cookies.remove(cookieName)
          })
          localStorage.clear()
          setUser(null)
          setLoading(false)
          router.replace('/login')
        })
      if (
        !window.location.hostname.split('.').includes('c-panel') &&
        !window.location.hostname.split('.').includes('localhost')
      ) {
        const resp = await api.get('common/settings/')
        dispatch(setCompanyInfo(resp.data))
      }
    } else {
      handleLogout()
    }
  }

  useEffect(() => {
    void initAuth()
  }, [])

  useEffect(() => {
    void router.push({ pathname, query }, asPath)
  }, [i18n.language])

  // const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
  //   api
  //     .post(authConfig.loginEndpoint, params)
  //     .then(async response => {
  //       if (!params.rememberMe) {
  //         window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.tokens.access)
  //         window.localStorage.setItem('userData', JSON.stringify({ ...response.data, role: 'admin', tokens: null }))
  //       }

  //       const settings: any = window.localStorage.getItem('settings')
  //       i18n.changeLanguage(JSON.parse(settings)?.locale || 'uz')

  //       const userRoles = response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase())

  //       const isMarketolog = userRoles.includes('marketolog')

  //       if (!response.data.payment_page) {
  //         if (
  //           !window.location.hostname.split('.').includes('c-panel') &&
  //           !window.location.hostname.split('.').includes('localhost')
  //         ) {
  //           const resp = await api.get('common/settings/')
  //           dispatch(setCompanyInfo(resp.data))
  //         }

  //         const returnUrl = router.query.returnUrl

  //         const redirectURL = isMarketolog ? '/lids' : returnUrl && returnUrl !== '/' ? returnUrl : '/'
  //         router.replace(redirectURL as string)
  //       } else {
  //         router.replace('/crm-payments')
  //       }

  //       dispatch(setRoles(userRoles))
  //       setUser({
  //         last_login: response.data?.last_login,
  //         phone: response.data.phone,
  //         gpa: response.data.gpa,
  //         id: response.data.id,
  //         fullName: response.data.first_name,
  //         payment_days: response.data.payment_days,
  //         username: response.data.phone,
  //         password: 'null',
  //         avatar: response.data.image,
  //         payment_page: response.data.payment_page,
  //         role: userRoles,
  //         balance: response.data?.balance || 0,
  //         branches: response.data.branches.filter((item: any) => item.exists === true),
  //         active_branch: response.data.active_branch
  //       })
  //     })
  //     .catch(err => {
  //       if (errorCallback) errorCallback(err)
  //     })
  // }

  const handleLogout = () => {
    setUser(null)
    localStorage.clear()

    const allCookies = Cookies.get()
    Object.keys(allCookies).forEach(cookieName => {
      if (cookieName !== 'user_blocked') {
        Cookies.remove(cookieName)
      }
    })

    router.push('/login')
  }

  // const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
  //   axios
  //     .post(authConfig.registerEndpoint, params)
  //     .then(res => {
  //       if (res.data.error) {
  //         if (errorCallback) errorCallback(res.data.error)
  //       } else {
  //         handleLogin({ phone: params.phone, password: params.password })
  //       }
  //     })
  //     .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  // }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    logout: handleLogout,
    initAuth
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
