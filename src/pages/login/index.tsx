'use client'

import { useState, ReactNode, useEffect } from 'react'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import themeConfig from 'src/configs/themeConfig'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import LoadingButton from '@mui/lab/LoadingButton'
import toast from 'react-hot-toast'
import PhoneInput from '../../components/phone-input'
import { useTranslation } from 'react-i18next'
import { reversePhone } from '../../components/phone-input/format-phone-number'
import api from 'src/@core/utils/api'
import { RootState, useAppDispatch } from 'src/store'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import { TypographyProps } from '@mui/material'
import Zoom from '@mui/material/Zoom'
import authConfig from 'src/configs/auth'
import { setCompanyInfo, setRoles } from 'src/store/apps/user'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { Eye } from 'lucide-react'
import { setPublicSettings } from 'src/store/apps/page'

const schema = yup.object().shape({
  phone: yup.string().required('Telefon raqam kiriting'),
  password: yup.string().min(1).required('Parol kiriting')
})

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))


const defaultValues = {
  phone: '',
  password: ''
}

type FormData = {
  phone: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const auth = useAuth()
  const { public_settings }  = useSelector((item: RootState) => item.page)
  const router = useRouter()
  const { t } = useTranslation()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    const pageLoad = async () => {
      try {
        const response = await api.get('common/public-settings/')
        if (response.status === 200) {
          dispatch(setPublicSettings(response.data))
          localStorage.setItem('school_type', response.data?.type)
          dispatch(setPublicSettings(response.data))
        }
      } catch {
        toast.error("Markaz ma'lumotini olib bo'lmadi")
      }
    }
    void pageLoad()
  }, [dispatch])

  const handleLogin = async (params: { phone: string, password: string }) => {
    try {
      setLoading(true)
      const response = await api.post(authConfig.loginEndpoint, params)
      window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.tokens.access)
      window.localStorage.setItem('userData', JSON.stringify({ ...response.data }))
      const userRoles = response.data.roles.filter((el: any) => el.exists).map((el: any) => el.name?.toLowerCase())
      
      dispatch(setRoles(userRoles))

      if (
        !window.location.hostname.split('.').includes('c-panel') &&
        !window.location.hostname.split('.').includes('localhost')
      ) {
        const resp = await api.get('common/settings/list/')
        dispatch(setCompanyInfo(resp.data[0]))
      }

      const isMarketable = userRoles.includes('marketolog')
      const paymentPage = response.data.payment_page
      const returnUrl = router.query.returnUrl
      const redirectURL = isMarketable
        ? '/lids'
        : paymentPage
        ? '/crm-payments'
        : returnUrl && returnUrl !== '/'
        ? returnUrl
        : '/'


      await router.push(redirectURL as string)

      dispatch(setRoles(userRoles))
      auth.setUser({
        last_login: response.data?.last_login,
        phone: response.data.phone,
        gpa: response.data?.gpa,
        id: response.data.id,
        fullName: response.data.first_name,
        username: response.data.phone,
        password: 'null',
        avatar: response.data.image,
        payment_page: response.data.payment_page,
        role: userRoles,
        balance: response.data?.balance || 0,
        branches: response.data?.branches,
        active_branch: response.data.active_branch
      })
      setLoading(false)
      auth.initAuth()
    } catch (err: any) {
      if (err?.response?.data) {
        Object.keys(err.response.data).forEach((key: any) => {
          setError(key, {
            type: 'manual',
            message: err.response.data[key]
          })
        })
      } else {
        toast.error('Network Error!', { position: 'top-center' })
      }
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    await handleLogin({
      phone: reversePhone(data.phone),
      password: data.password
    })
  }

  return (
      <Box sx={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Image
          src='/images/request-form-bg.webp'
          alt='Login Background'
          fill
          style={{objectFit: "cover"}}
          priority
        />

      <Zoom in timeout={500}>
        <Box className='content-right' sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {public_settings && (
            <div className='login-card'>
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                {public_settings?.logo && (
                  <Image src={public_settings?.logo} alt='Brand logo' width={100} height={80} style={{ objectFit: 'scale-down' }} />
                )}

                {public_settings ? (
                  <TypographyStyled variant='h5'>{`${
                    public_settings?.training_center_name || themeConfig.templateName
                  }! ga Xush kelibsiz 👋🏻`}</TypographyStyled>
                ) : (
                  <TypographyStyled variant='h5'>Xush kelibsiz 👋🏻</TypographyStyled>
                )}
                <Typography variant='body2'>Iltimos tizimga kirish uchun shaxsiy malumotlaringizni kiriting</Typography>
              </Box>

              <form noValidate autoComplete='off' style={{ display: "grid", gap: 20 }} onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gap={5}>
                  <FormControl fullWidth>
                    <InputLabel error={Boolean(errors.phone)} htmlFor='login-input'>
                      {t('phone')}
                    </InputLabel>

                    <Controller
                      name='phone'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <PhoneInput
                          id='login-input'
                          size='medium'
                          label='Telefon raqam'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.phone)}
                        />
                      )}
                    />
                    {errors.phone && <FormHelperText error>{errors.phone.message}</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                      Parol
                    </InputLabel>

                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          onBlur={onBlur}
                          label='Parol'
                          onChange={onChange}
                          id='auth-login-v2-password'
                          error={Boolean(errors.password)}
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton onClick={() => setShowPassword(!showPassword)}>
                                <Eye />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                  </FormControl>
                </Box>

                <LoadingButton loading={loading} fullWidth size='large' type='submit' variant='contained'>
                  Kirish
                </LoadingButton>
              </form>
            </div>
          )}
        </Box>
      </Zoom>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true
LoginPage.displayName = 'LoginPage'
export default LoginPage
