'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material'
import IconifyIcon from 'src/components/icon'
import useResponsive from 'src/@core/hooks/useResponsive'
import usePayment from 'src/hooks/usePayment'
import useBranches from 'src/hooks/useBranch'
import LoadingButton from '@mui/lab/LoadingButton'
import api from 'src/@core/utils/api'
import { setCompanyInfo } from 'src/store/apps/user'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import showResponseError from 'src/@core/utils/show-response-error'
import { useAppDispatch, useAppSelector } from 'src/store'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/router'
import Image from 'next/image'

const VisuallyHiddenInput = styled('input')({
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

export default function AllSettings() {
  const { isMobile } = useResponsive()

  const [editable, setEditable] = useState<
    | null
    | 'title'
    | 'logo'
    | 'start-time'
    | 'end-time'
    | 'birthdate'
    | 'absend'
    | 'payment'
    | 'score'
    | 'attend'
    | 'debtor'
  >(null)
  const [createble, setCreatable] = useState<null | 'branch' | 'payment-type'>(null)
  const [id, setId] = useState<null | { key: 'branch' | 'payment-type'; id: any }>(null)
  const [deleteId, setDeleteId] = useState<null | { open: null | 'payment-type' | 'branch'; id: any }>(null)
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState<
    | 'name'
    | 'branch'
    | 'paytype'
    | 'start-time'
    | 'end-time'
    | 'birthdate'
    | 'absend'
    | 'delete'
    | 'payment'
    | 'score'
    | 'attend'
    | 'debtor'
    | 'extra_settings'
    | null
  >(null)
  const [error, setError] = useState<any>({})
  const [errorMessage, setErrorMessage] = useState<null | string>(null)
  const { push } = useRouter()

  const { getPaymentMethod, paymentMethods, createPaymentMethod, updatePaymentMethod } = usePayment()
  const { getBranches, branches } = useBranches()
  const dispatch = useAppDispatch()
  const { companyInfo } = useAppSelector((state: any) => state.user)
  const { t } = useTranslation()
  const [settinsLoading, setSettingsLoading] = useState(false)
  const { setUser, user } = useContext(AuthContext)
  const [tabIndex, setTabIndex] = useState(0)

  async function getSettingsList() {
    setSettingsLoading(true)
    await api.get('common/settings/').then(res => {
      dispatch(setCompanyInfo(res.data[0]))
    })
    setSettingsLoading(false)
  }

  async function handleChangeExtraSettings(event: any) {
    updateSettings('extra_settings', event.target.checked)
  }

  useEffect(() => {
    getSettingsList()
  }, [])

  const inputRef = useRef<any | null>(null)

  useEffect(() => {
    if (createble === 'branch' || (createble === 'payment-type' && inputRef.current)) {
      inputRef.current.focus()
    }
  }, [createble])

  const reloadProfile = async () => {
    await api.get('auth/profile/').then(async response => {
      setUser({
        phone: response.data?.gpa,
        gpa: response.data?.gpa,
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
  }

  const createPaymentType = async () => {
    setLoading('paytype')
    try {
      await createPaymentMethod({ name })
      setTimeout(() => {
        setLoading(null)
        setCreatable(null)
        getPaymentMethod()
      }, 400)
    } catch (err) {
      setLoading(null)
      console.log(err)
    }
  }

  const createBranch = async () => {
    setLoading('branch')
    try {
      await api.post(`common/branch/create`, { name })
      await reloadProfile()
      setTimeout(() => {
        setLoading(null)
        setCreatable(null)
        getBranches()
      }, 400)
    } catch (err) {
      setLoading(null)
      console.log(err)
    }
  }

  const updateBranch = async () => {
    setLoading('branch')
    try {
      await api.patch(`common/branch/update/${id?.id}`, { name })
      await reloadProfile()
      setCreatable(null)
      setLoading(null)
      getBranches()
      setId(null)
    } catch (err) {
      setLoading(null)
      console.log(err)
    }
  }

  const updateSettings = async (key: any, value: any) => {
    if (key === 'training_center_name') {
      setLoading('name')
    } else if (key === 'work_start_time') {
      setLoading('start-time')
    } else if (key === 'work_end_time') {
      setLoading('end-time')
    } else if (key === 'extra_settings') {
      setLoading('extra_settings')
    }

    try {
      const formData: any = new FormData()
      formData.append(key, value)

      if (key === 'extra_settings') {
        formData.append('extra_settings', JSON.stringify({ allow_debt_editing_on_payment: value }))
      }
      await api.patch('common/settings/update/', formData)

      const getresp = await api.get('common/settings/')

      dispatch(setCompanyInfo(getresp.data[0]))
      setEditable(null)
      setId(null)
    } catch (err: any) {
      if (err?.response?.data) {
        showResponseError(err?.response?.data, setError)
      }
    } finally {
      setLoading(null)
    }
  }

  function handleClose() {
    setDeleteId(null)
    setErrorMessage(null)
  }

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      void push('/')
      toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
    }
    Promise.all([getPaymentMethod(), getBranches()])
  }, [])

  return (
    <Box>
      <div className='row  w-100  mx-auto '>
        <div className='col-12 d-flex flex-column gap-4 col-md-6'>
          <div className='w-100'>
            <Card>
              <CardContent>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Tashkilot nomi')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editable === 'title' ? (
                      <>
                        <TextField
                          size='small'
                          focused
                          defaultValue={companyInfo?.training_center_name}
                          onChange={e => setName(e.target.value)}
                        />
                        <IconifyIcon
                          icon={loading === 'name' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            updateSettings('training_center_name', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          value={companyInfo?.training_center_name}
                          size='small'
                          placeholder={t('Tashkilot nomi')}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('title')}
                        />
                      </>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Logo')}:
                  </Typography>
                  {companyInfo?.logo ? (
                    <Image
                      src={
                        companyInfo.logo ||
                        'https://static-00.iconduck.com/assets.00/image-alt-text-icon-512x512-gm9in6oz.png'
                      }
                      alt='Company Logo'
                      width={46}
                      height={46}
                      priority={false}
                      placeholder='blur'
                      style={{ objectFit: 'contain' }}
                      blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wNPb9WipgAAAABJRU5ErkJggg==' // Blur uchun placeholder (ixtiyoriy)
                    />
                  ) : (
                    <Typography variant='body2'>Logosi mavjuda emas</Typography>
                  )}
                  <Button
                    component='label'
                    role={undefined}
                    variant='contained'
                    size='small'
                    tabIndex={-1}
                    startIcon={<IconifyIcon icon={'mynaui:upload'} />}
                  >
                    {t('Yangilash')}
                    <VisuallyHiddenInput
                      type='file'
                      onChange={(e: any) => {
                        void updateSettings('logo', e.target.files[0])
                      }}
                    />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>

          <div className='w-100'>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Tolov usullari')}:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {paymentMethods.map((method: any) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={method.id}>
                        {id?.id === method.id && id?.key === 'payment-type' ? (
                          <TextField
                            size='small'
                            focused
                            defaultValue={method.name}
                            onBlur={async e => {
                              setLoading('paytype')
                              await updatePaymentMethod(method.id, { name: e.target.value })
                              setLoading(null)
                            }}
                          />
                        ) : (
                          <TextField size='small' value={method.name} onBlur={e => console.log(e.target.value)} />
                        )}
                        {id?.id === method.id && id?.key === 'payment-type' ? (
                          <IconifyIcon
                            icon={loading === 'paytype' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setId(null)}
                          />
                        ) : (
                          <IconifyIcon
                            icon={'basil:edit-outline'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setId({ id: method.id, key: 'payment-type' })}
                          />
                        )}
                        <IconifyIcon
                          icon={'fluent:delete-20-regular'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setDeleteId({ open: 'payment-type', id: method.id })}
                        />
                      </Box>
                    ))}
                    {createble === 'payment-type' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TextField
                          size='small'
                          inputRef={inputRef}
                          placeholder="To'lov turi"
                          onChange={e => setName(e.target.value)}
                        />
                        <IconifyIcon
                          icon={loading === 'paytype' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={createPaymentType}
                        />
                        <IconifyIcon
                          icon={'ic:outline-close'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setCreatable(null)}
                        />
                      </Box>
                    )}
                    <Button
                      size='small'
                      startIcon={<IconifyIcon icon={'ic:outline-add'} />}
                      variant='outlined'
                      onClick={() => setCreatable('payment-type')}
                    >
                      {t('Yangi')}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className='w-100'>
            <Card>
              <CardContent>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={companyInfo?.extra_settings?.allow_debt_editing_on_payment}
                      onChange={handleChangeExtraSettings}
                    />
                  }
                  label="O'quvchi to'lovida kurs narxini tahrirlash"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className='col-12 d-flex flex-column gap-4 col-md-6 '>
          <div className='w-100'>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Filiallar')}:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {branches.map((branch: any) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={branch.id}>
                        {id?.id === branch.id && id?.key === 'branch' ? (
                          <TextField
                            size='small'
                            focused
                            defaultValue={branch.name}
                            onChange={e => setName(e.target.value)}
                            onBlur={updateBranch}
                          />
                        ) : (
                          <TextField size='small' value={branch.name} />
                        )}
                        {id?.id === branch.id && id?.key === 'branch' ? (
                          <IconifyIcon
                            icon={loading === 'branch' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                            style={{ cursor: 'pointer' }}
                            onClick={updateBranch}
                          />
                        ) : (
                          <IconifyIcon
                            icon={'basil:edit-outline'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setId({ id: branch.id, key: 'branch' })}
                          />
                        )}
                        <IconifyIcon
                          icon={'fluent:delete-20-regular'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setDeleteId({ open: 'branch', id: branch.id })}
                        />
                      </Box>
                    ))}
                    {createble === 'branch' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TextField
                          size='small'
                          inputRef={inputRef}
                          placeholder={t('Yangi filial')}
                          onChange={e => setName(e.target.value)}
                        />
                        <IconifyIcon
                          icon={loading === 'branch' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={createBranch}
                        />
                        <IconifyIcon
                          icon={'ic:outline-close'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setCreatable(null)}
                        />
                      </Box>
                    )}
                    <Button
                      size='small'
                      startIcon={<IconifyIcon icon={'ic:outline-add'} />}
                      variant='outlined'
                      onClick={() => setCreatable('branch')}
                    >
                      {t('Yangi')}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className='w-100'>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Ish boshlanish vaqti')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editable === 'start-time' ? (
                      <>
                        <TextField
                          type='time'
                          size='small'
                          focused
                          defaultValue={companyInfo?.work_start_time}
                          onChange={e => setName(e.target.value)}
                          onBlur={e => {
                            void updateSettings('work_start_time', e.target.value)
                          }}
                        />
                        <IconifyIcon
                          icon={loading === 'start-time' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            void updateSettings('work_start_time', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          type='text'
                          value={`${companyInfo?.work_start_time}`}
                          size='small'
                          placeholder={t('Ish boshlanish vaqti')}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('start-time')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                    {t('Ish tugash vaqti')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editable === 'end-time' ? (
                      <>
                        <TextField
                          type='time'
                          size='small'
                          focused
                          defaultValue={companyInfo?.work_end_time}
                          onBlur={e => {
                            void updateSettings('work_end_time', e.target.value)
                          }}
                        />
                        <IconifyIcon
                          icon={loading === 'end-time' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            void updateSettings('work_end_time', name)
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <TextField
                          type='text'
                          value={`${companyInfo?.work_end_time}`}
                          size='small'
                          placeholder={t('Boshlanish vaqti')}
                        />
                        <IconifyIcon
                          icon={'basil:edit-outline'}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setEditable('end-time')}
                        />
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={deleteId?.open === 'payment-type'} onClose={() => setDeleteId(null)}>
        <DialogContent>
          <Typography sx={{ fontSize: '20px', margin: '10px 10px 20px' }}>{t("O'chirishni tasdiqlang")}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => setDeleteId(null)}>
              Bekor qilish
            </Button>
            <LoadingButton
              loading={loading === 'delete'}
              variant='contained'
              color='error'
              onClick={async () => {
                setLoading('delete')
                try {
                  await updatePaymentMethod(deleteId?.id, { is_active: false })
                  setDeleteId(null)
                  setLoading(null)
                } catch {
                  setLoading(null)
                }
              }}
            >
              Ok
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId?.open === 'branch'} onClose={handleClose}>
        <DialogContent>
          <Typography sx={{ fontSize: '20px', margin: '10px 10px 20px' }}>{t("O'chirishni tasdiqlang")}</Typography>
          {errorMessage && (
            <Typography sx={{ color: 'red', fontSize: '15px', marginBottom: '20px', marginX: '10px' }}>
              {errorMessage}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={handleClose}>
              {t('Bekor qilish')}
            </Button>
            <LoadingButton
              loading={loading === 'delete'}
              variant='contained'
              color='error'
              onClick={async () => {
                setLoading('delete')
                try {
                  await api
                    .delete(`common/branch/delete/${deleteId?.id}`)
                    .then(res => {
                      reloadProfile()
                      setDeleteId(null)
                      getBranches()
                      setLoading(null)
                    })
                    .catch(error => {
                      console.log(error)
                      setErrorMessage(error.response.data.msg)
                      setLoading(null)
                    })
                } catch {
                  setLoading(null)
                }
              }}
            >
              Ok
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
