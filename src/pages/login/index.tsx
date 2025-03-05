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
import Icon from '../../components/icon'
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
import { setPublicSettings } from 'src/store/apps/page'
import { useAppDispatch } from 'src/store'
import Image from 'next/image'
import { styled } from '@mui/material/styles'
import { TypographyProps } from '@mui/material'
import Zoom from '@mui/material/Zoom'

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
  const [data, setData] = useState<any>(null)
  const dispatch = useAppDispatch()
  const auth = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    const pageLoad = async () => {
      try {
        const response = await api.get('common/public-settings/')
        if (response.status === 200) {
          dispatch(setPublicSettings(response.data))
          localStorage.setItem('school_type', response.data?.type)
          setData(response.data)
        }
      } catch {
        toast.error("Markaz ma'lumotini olib bo'lmadi")
      }
    }
    pageLoad()
  }, [dispatch])

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

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const { phone, password } = data
    await auth.login({ phone: reversePhone(phone), password }, (resp: any) => {
      if (resp?.response) {
        setLoading(false)
        Object.keys(resp?.response?.data).map((el: any) => {
          return setError(el, {
            type: 'manual',
            message: resp?.response?.data[el]
          })
        })
      } else {
        toast.error('Network Error!', { position: 'top-center' })
      }
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
          {data && (
            <Box sx={{ maxWidth: '600px', width: '100%', p: 10, backgroundColor: 'rgba(255, 255, 255)', borderRadius: 1, boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px' }}>
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                {data?.logo && (
                  <Image src={data?.logo} alt='Brand logo' width={100} height={80} style={{ objectFit: 'scale-down' }} />
                )}
                {data ? (
                  <TypographyStyled variant='h5'>{`${
                    data?.training_center_name || themeConfig.templateName
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
                                <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
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
            </Box>
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
