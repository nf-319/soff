import { Icon } from '@iconify/react'
import { Box, CardContent, Chip, CircularProgress, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'
import api from 'src/@core/utils/api'
import showResponseError from 'src/@core/utils/show-response-error'
import IconifyIcon from 'src/components/icon'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setCompanyInfo } from 'src/store/apps/user'

const SmsSettings = () => {
  const { isMobile } = useResponsive()
  const [id, setId] = useState<null | { key: 'branch' | 'payment-type'; id: any }>(null)
  const [name, setName] = useState<string>('')
  const [error, setError] = useState<any>({})
  const dispatch = useAppDispatch()
  const { companyInfo } = useAppSelector((state: any) => state.user)
  const { t } = useTranslation()
  const [birthday_text, setBirthday_text] = useState(companyInfo?.auto_sms?.birthday_text)
  const textFieldRef = useRef<HTMLTextAreaElement | null>(null);
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
  const updateSettings = async (key: any, value: any) => {
    try {
      const formData: any = new FormData()
      formData.append(key, value)

      if (
        key === 'on_birthday' ||
        key === 'birthday_text' ||
        key === 'on_absent' ||
        key === 'absent_text' ||
        key === 'payment_warning' ||
        key === 'payment_text' ||
        key === 'on_score' ||
        key === 'score_text' ||
        key === 'on_attend' ||
        key === 'attend_text' ||
        key === 'debt_text' ||
        key === 'for_debtor'
      ) {
        if (key === 'on_birthday') {
          setLoading('birthdate')
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'birthday_text') {
          setLoading('birthdate')
          formData.append('on_birthday', true)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'payment_warning') {
          setLoading('payment')
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'payment_text') {
          setLoading('payment')
          formData.append('payment_warning', true)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'on_score') {
          setLoading('score')
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'score_text') {
          setLoading('score')
          formData.append('on_score', true)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'on_attend') {
          setLoading('attend')
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'attend_text') {
          setLoading('attend')
          formData.append('on_attend', true)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'for_debtor') {
          setLoading('debtor')
          formData.append('debt_text', companyInfo?.auto_sms?.attend_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
        } else if (key === 'debt_text') {
          setLoading('debtor')
          formData.append('for_debtor', true)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
        } else if (key === 'on_absent') {
          setLoading('absend')
          formData.append(
            'absent_text',
            'Assalomu Alaykum, siz kecha dars qoldirdingiz iltimos sababini bildirishni unurtmang'
          )
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else {
          setLoading('absend')
          formData.append('on_absent', true)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        }

        await api.put('common/auto-sms/update/', formData)
        setName('')
      } else {
        if (key === 'extra_settings') {
          formData.append('extra_settings', JSON.stringify({ allow_debt_editing_on_payment: value }))
        }
        await api.patch('common/settings/update/', formData)
      }

      const getresp = await api.get('common/settings/list/')

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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Box>
              <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                {t("Tug'ilgan kunda sms bilan tabriklash")}:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {loading === 'birthdate' ? (
                <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
              ) : (
                <Switch
                  checked={Boolean(companyInfo?.auto_sms?.on_birthday)}
                  onChange={async (e, i) => {
                    await updateSettings('on_birthday', i)
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography sx={{ marginBottom: 5 }} fontSize={12}>
            {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t('SMS Matni')}:
            </Typography>
            {editable === 'birthdate' && (
              <Box display={'flex'} gap={2}>
                <div onClick={() => setBirthday_text((prev: any) => prev + '${first_name}')}>
                  <Chip sx={{ cursor: 'pointer' }} color='error' label={'Ism familiya'} />
                </div>
                <div onClick={() => setBirthday_text((prev: any) => prev + '${date}')}>
                  <Chip sx={{ cursor: 'pointer' }} color='info' label={'Sana'} />
                </div>
                <div onClick={() => setBirthday_text((prev: any) => prev + '${amount}')}>
                  <Chip sx={{ cursor: 'pointer' }} color='primary' label={'Summa'} />
                </div>
                <div onClick={() => setBirthday_text((prev: any) => prev + '${group}')}>
                  <Chip sx={{ cursor: 'pointer' }} color='secondary' label={'Guruh'} />
                </div>
                <div onClick={() => setBirthday_text((prev: any) => prev + '${grade}')}>
                  <Chip sx={{ cursor: 'pointer' }} color='success' label={"O'quvchi bahosi"} />
                </div>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
              {editable === 'birthdate' ? (
                <>
                  <TextField
                    multiline
                    rows={4}
                    size='small'
                    value={birthday_text}
                    // defaultValue={companyInfo?.auto_sms?.birthday_text}
                    // onBlur={e => {
                    //   updateSettings('birthday_text', e.target.value)
                    // }}
                    onChange={e => {
                      setBirthday_text(e.target.value)
                    }}
                    fullWidth
                  />
                  <IconifyIcon
                    icon={loading === 'birthdate' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      updateSettings('birthday_text', birthday_text)
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    type='text'
                    value={companyInfo?.auto_sms?.birthday_text}
                    size='small'
                    placeholder={t('SMS Matni')}
                    // onBlur={e => console.log(e.target.value)}
                  />
                  <IconifyIcon
                    icon={'basil:edit-outline'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEditable('birthdate')}
                  />
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t('Darsga kelmaganlarga sms yuborish')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {loading === 'absend' ? (
                <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
              ) : (
                <Switch
                  checked={Boolean(companyInfo?.auto_sms?.on_absent)}
                  onChange={async (e, i) => {
                    setLoading('absend')
                    await updateSettings('on_absent', i)
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography sx={{ marginBottom: 5 }} fontSize={12}>
            {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t(`SMS matnini kiriting (kelmagan o'quvchiga ertasi kuni yuboriladi)`)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
              {editable === 'absend' ? (
                <>
                  <TextField
                    multiline
                    rows={4}
                    size='small'
                    focused
                    defaultValue={companyInfo?.auto_sms?.absent_text}
                    onBlur={e => {
                      updateSettings('absent_text', e.target.value)
                    }}
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    fullWidth
                  />
                  <IconifyIcon
                    icon={loading === 'absend' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      updateSettings('absent_text', name)
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    type='text'
                    value={`${companyInfo?.auto_sms?.absent_text}`}
                    size='small'
                    placeholder={t('Boshlanish vaqti')}
                    // onBlur={e => console.log(e.target.value)}
                  />
                  <IconifyIcon
                    icon={'basil:edit-outline'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEditable('absend')}
                  />
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t('Darsga kelganlarga sms yuborish')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {loading === 'attend' ? (
                <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
              ) : (
                <Switch
                  checked={companyInfo?.auto_sms?.on_attend}
                  onChange={async (e, i) => {
                    setLoading('attend')
                    await updateSettings('on_attend', i)
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography sx={{ marginBottom: 5 }} fontSize={12}>
            {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t(`SMS matnini kiriting (kelgan o'quvchiga ertasi kuni yuboriladi)`)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
              {editable === 'attend' ? (
                <>
                  <TextField
                    multiline
                    rows={4}
                    size='small'
                    focused
                    defaultValue={companyInfo?.auto_sms?.attend_text}
                    onBlur={e => {
                      updateSettings('attend_text', e.target.value)
                    }}
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    fullWidth
                  />
                  <IconifyIcon
                    icon={loading === 'attend' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      updateSettings('attend_text', name)
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    type='text'
                    value={companyInfo?.auto_sms?.attend_text || 'Text'}
                    size='small'
                    placeholder={t('Boshlanish vaqti')}
                    // onBlur={e => console.log(e.target.value)}
                  />
                  <IconifyIcon
                    icon={'basil:edit-outline'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEditable('attend')}
                  />
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t("To'lovi yaqin qolganlarni ogohlantirish")}:{' '}
              <Tooltip
                title={
                  <Typography
                    color='white'
                    sx={{
                      minWidth: isMobile ? '90px' : '180px',
                      fontSize: isMobile ? '10px' : '13px'
                    }}
                  >
                    {t("Xabar to'lovga 7 kun qolganda yuboriladi")}
                  </Typography>
                }
                arrow
              >
                <span style={{ cursor: 'pointer' }}>
                  <Icon
                    icon='mdi:help-circle-outline'
                    style={{ fontSize: isMobile ? '16px' : '20px', marginLeft: '5px' }}
                  />
                </span>
              </Tooltip>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {loading === 'payment' ? (
                <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
              ) : (
                <Switch
                  checked={Boolean(companyInfo?.auto_sms?.payment_warning)}
                  onChange={async (e, i) => {
                    await updateSettings('payment_warning', i)
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography sx={{ marginBottom: 2 }} fontSize={12}>
            {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
          </Typography>
          <Typography sx={{ marginBottom: 2 }} fontSize={12}>
            {"Xabar matniga kunni  qo'shish uchun ${date} kalit so'zi qoldiring."}
          </Typography>
          <Typography sx={{ marginBottom: 5 }} fontSize={12}>
            {"Xabar matniga summani  qo'shish uchun ${amount} kalit so'zi qoldiring."}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t('SMS Matni')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
              {editable === 'payment' ? (
                <>
                  <TextField
                    multiline
                    rows={4}
                    size='small'
                    focused
                    defaultValue={companyInfo?.auto_sms?.payment_text || ''}
                    onBlur={e => {
                      updateSettings('payment_text', e.target.value)
                    }}
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    fullWidth
                  />
                  <IconifyIcon
                    icon={loading === 'payment' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      updateSettings('payment_text', name)
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    type='text'
                    value={`${companyInfo?.auto_sms?.payment_text}`}
                    size='small'
                    placeholder={t('SMS Matni')}
                    // onBlur={e => console.log(e.target.value)}
                  />
                  <IconifyIcon
                    icon={'basil:edit-outline'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEditable('payment')}
                  />
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Box display={'flex'}>
              <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
                {t('Qarzdorlarni ogohlantirish')}:{' '}
              </Typography>
              <Tooltip
                title={
                  <Typography
                    color='white'
                    sx={{
                      minWidth: isMobile ? '90px' : '180px',
                      fontSize: isMobile ? '10px' : '13px'
                    }}
                  >
                    {t("O'quvchi qarzdor bo'lgan kuni 1 marta ogohlantirish boradi")}
                  </Typography>
                }
                arrow
              >
                <span style={{ cursor: 'pointer' }}>
                  <Icon
                    icon='mdi:help-circle-outline'
                    style={{ fontSize: isMobile ? '16px' : '20px', marginLeft: '5px' }}
                  />
                </span>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {loading === 'debtor' ? (
                <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
              ) : (
                <Switch
                  checked={Boolean(companyInfo?.auto_sms?.for_debtor)}
                  onChange={async (e, i) => {
                    await updateSettings('for_debtor', i)
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography sx={{ marginBottom: 2 }} fontSize={12}>
            {"Xabar matniga kunni  qo'shish uchun ${date} kalit so'zi qoldiring."}
          </Typography>
          <Typography sx={{ marginBottom: 2 }} fontSize={12}>
            {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
          </Typography>
          <Typography sx={{ marginBottom: 5 }} fontSize={12}>
            {"Xabar matniga summani  qo'shish uchun ${amount} kalit so'zi qoldiring."}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t('SMS Matni')}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
              {editable === 'debtor' ? (
                <>
                  <TextField
                    multiline
                    rows={4}
                    size='small'
                    focused
                    defaultValue={companyInfo?.auto_sms?.debt_text || ''}
                    onBlur={e => {
                      updateSettings('debt_text', e.target.value)
                    }}
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    fullWidth
                  />
                  <IconifyIcon
                    icon={loading === 'debtor' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      updateSettings('debt_text', name)
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    type='text'
                    value={companyInfo?.auto_sms?.debt_text || 'Text'}
                    size='small'
                    placeholder={t('SMS Matni')}
                    // onBlur={e => console.log(e.target.value)}
                  />
                  <IconifyIcon
                    icon={'basil:edit-outline'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEditable('debtor')}
                  />
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t("O'quvchi baholarini yuborish")}:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {loading === 'score' ? (
                <CircularProgress disableShrink size={'20px'} sx={{ margin: '10px 0', marginLeft: '15px' }} />
              ) : (
                <Switch
                  checked={Boolean(companyInfo?.auto_sms?.on_score)}
                  onChange={async (e, i) => {
                    setLoading('score')
                    await updateSettings('on_score', i)
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography sx={{ marginBottom: 2 }} fontSize={12}>
            {"Xabar matniga talaba ismini qo'shish uchun ${first_name} kalit so'zi qoldiring."}
          </Typography>

          <Typography sx={{ marginBottom: 2 }} fontSize={12}>
            {"Xabar matniga guruh nomini qo'shish uchun ${group} kalit so'zi qoldiring."}
          </Typography>
          <Typography sx={{ marginBottom: 5 }} fontSize={12}>
            {"Xabar matniga talaba bahosini qo'shish uchun ${score} kalit so'zi qoldiring."}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexDirection: 'column' }}>
            <Typography sx={{ minWidth: isMobile ? '90px' : '180px', fontSize: isMobile ? '13px' : '16px' }}>
              {t(`SMS matnini kiriting (kelmagan o'quvchiga ertasi kuni yuboriladi)`)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
              {editable === 'score' ? (
                <>
                  <TextField
                    multiline
                    rows={4}
                    size='small'
                    focused
                    defaultValue={companyInfo?.auto_sms?.score_text}
                    onBlur={e => {
                      updateSettings('score_text', e.target.value)
                    }}
                    onChange={e => {
                      setName(e.target.value)
                    }}
                    fullWidth
                  />
                  <IconifyIcon
                    icon={loading === 'score' ? 'line-md:loading-loop' : 'ic:baseline-check'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      updateSettings('score_text', name)
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    type='text'
                    value={companyInfo?.auto_sms?.score_text}
                    size='small'
                    placeholder={t('Boshlanish vaqti')}
                    // onBlur={e => console.log(e.target.value)}
                  />
                  <IconifyIcon
                    icon={'basil:edit-outline'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setEditable('score')}
                  />
                </>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SmsSettings
