import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Router from 'next/router'
import authConfig from 'src/configs/auth'

const api = axios.create()

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const storedToken = typeof window !== 'undefined'
      ? localStorage.getItem(authConfig.storageTokenKeyName)
      : null

    let baseURL: string

    if (typeof window !== 'undefined') {
      const subdomain = window.location.hostname.split('.')

      if (process.env.NODE_ENV === 'development') {
        baseURL = process.env.NEXT_PUBLIC_TEST_BASE_URL || ''
      } else if (subdomain.length < 3) {
        baseURL = `https://${process.env.NEXT_PUBLIC_BASE_URL}/api`
      } else {
        baseURL = `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}/api`
      }
    } else {
      baseURL = process.env.NEXT_PUBLIC_TEST_BASE_URL || ''
    }

    config.baseURL = baseURL

    const version = config.headers?.['x-api-version'] === 'v2' ? 'v2' : 'v1'

    const url = config.url || ''
    if (!url.startsWith('/v1') && !url.startsWith('/v2')) {
      config.url = `/${version}/${url}`
    }

    if (storedToken) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${storedToken}`
    }

    if (typeof window !== 'undefined') {
      const language = localStorage.getItem('i18nextLng')
      if (language) {
        config.headers = config.headers || {}
        config.headers['Accept-Language'] = language
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      if (typeof window !== 'undefined') {
        localStorage.clear()
        void Router.push('/login')
      }
      return Promise.reject({ message: error.response?.data || 'Authentication error' })
    }

    return Promise.reject(error)
  }
)

export default api
