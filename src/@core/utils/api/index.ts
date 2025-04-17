import axios from 'axios'

import authConfg from 'src/configs/auth'

const api = axios.create()

api.interceptors.request.use(
  (config: any) => {
    const storedToken = localStorage.getItem(authConfg.storageTokenKeyName)
    const subdomain = location.hostname.split('.')
    const baseURL =
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_TEST_BASE_URL
        : subdomain.length < 3
          ? `https://${process.env.NEXT_PUBLIC_BASE_URL}/api`
          : `https://${subdomain[0]}.${process.env.NEXT_PUBLIC_BASE_URL}/api`

    config.baseURL = baseURL

    const version = config.headers?.['x-api-version'] === 'v2' ? 'v2' : 'v1'

    if (!config.url.startsWith(`/v1`) && !config.url.startsWith(`/v2`)) {
      config.url = `/${version}/${config.url}`
    }

    if (storedToken) {
      config.headers['Authorization'] = `Bearer ${storedToken}`
    }

    const language = localStorage.getItem('i18nextLng')
    if (language) {
      config.headers['Accept-Language'] = language
    }

    return config
  },
  err => Promise.reject(err)
)

api.interceptors.response.use(
  resp => resp,
  err => {
    if (err.response && [403, 401].includes(err.response.status)) {
      localStorage.removeItem(authConfg.storageTokenKeyName)
      localStorage.removeItem('settings')
      window.location.href = '/'
      return Promise.reject({ message: err.response.data })
    }

    return Promise.reject(err)
  }
)

export default api
