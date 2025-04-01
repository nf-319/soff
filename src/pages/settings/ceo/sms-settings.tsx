'use client'

import { Box } from '@mui/material'
import { useState } from 'react'
import api from 'src/@core/utils/api'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setCompanyInfo } from 'src/store/apps/user'
import { SmsCard } from 'src/views/apps/sms-settings'
import { PLACEHOLDERS } from 'src/views/apps/sms-settings/constants'

const SmsSettings = () => {
  const dispatch = useAppDispatch()
  const { companyInfo } = useAppSelector((state: any) => state.user)

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
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
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
          formData.append('on_score', companyInfo?.auto_sms?.on_score)
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
          // formData.append('on_attend', !companyInfo?.auto_sms?.on_attend)

          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)

          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
          formData.append('debt_text', companyInfo?.auto_sms?.debt_text)
        } else if (key === 'attend_text') {
          setLoading('attend')
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
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
          formData.append('for_debtor', !companyInfo?.auto_sms?.for_debtor)

          formData.append('debt_text', companyInfo?.auto_sms?.attend_text)
          formData.append('payment_warning', companyInfo?.auto_sms?.payment_warning)
          formData.append('payment_text', companyInfo?.auto_sms?.payment_text)
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
          formData.append('absent_text', companyInfo?.auto_sms?.absent_text)
          formData.append('on_birthday', companyInfo?.auto_sms?.on_birthday)
          formData.append('birthday_text', companyInfo?.auto_sms?.birthday_text)
          formData.append('score_text', companyInfo?.auto_sms?.score_text)
          formData.append('on_score', companyInfo?.auto_sms?.on_score)

          formData.append('attend_text', companyInfo?.auto_sms?.attend_text)
          formData.append('on_attend', companyInfo?.auto_sms?.on_attend)
        } else if (key === 'debt_text') {
          setLoading('debtor')
          formData.append('for_debtor', companyInfo?.auto_sms?.for_debtor)
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
          formData.append('on_absent', companyInfo?.auto_sms?.on_absent)
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
      } else {
        if (key === 'extra_settings') {
          formData.append('extra_settings', JSON.stringify({ allow_debt_editing_on_payment: value }))
        }
        await api.patch('common/settings/update/', formData)
      }

      const getresp = await api.get('common/settings/list/')

      dispatch(setCompanyInfo(getresp.data[0]))
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
      <SmsCard
        title="Tug'ilgan kunda sms bilan tabriklash"
        loading={loading === 'birthdate'}
        onSwitch='on_birthday'
        name='birthday_text'
        onSwitchInfo={Boolean(companyInfo?.auto_sms?.on_birthday)}
        placeholders={PLACEHOLDERS.birthdate}
        updateSettings={updateSettings}
        defaultValue={companyInfo?.auto_sms?.birthday_text}
      />

      <SmsCard
        title="Darsga kelmaganlarga sms yuborish"
        alert="Kelmagan o'quvchiga sms xabarnoma ertasi kuni yuboriladi"
        loading={loading === 'absend'}
        onSwitch='on_absent'
        name='absent_text'
        onSwitchInfo={Boolean(companyInfo?.auto_sms?.on_absent)}
        placeholders={PLACEHOLDERS.notComeLesson}
        updateSettings={updateSettings}
        defaultValue={companyInfo?.auto_sms?.absent_text}
      />

      <SmsCard
        title="Darsga kelganlarga sms yuborish"
        alert="Kelgan o'quvchiga ertasi kuni sms xabarnoma yuboriladi"
        loading={loading === 'attend'}
        onSwitch='on_attend'
        name='attend_text'
        onSwitchInfo={Boolean(companyInfo?.auto_sms?.on_attend)}
        placeholders={PLACEHOLDERS.comeLesson}
        updateSettings={updateSettings}
        defaultValue={companyInfo?.auto_sms?.attend_text}
      />

      <SmsCard
        title="To'lovi yaqin qolganlarni ogohlantirish"
        alert="Sms xabarnoma o'quvchiga to'lovga 7 kun qolganda yuboriladi"
        loading={loading === 'payment'}
        onSwitch='payment_warning'
        name='payment_text'
        onSwitchInfo={Boolean(companyInfo?.auto_sms?.payment_warning)}
        placeholders={PLACEHOLDERS.whosePayment}
        updateSettings={updateSettings}
        defaultValue={companyInfo?.auto_sms?.payment_text}
      />

      <SmsCard
        title="Qarzdorlarni ogohlantirish"
        alert="O'quvchi qarzdor bo'lgan kuni 1 marta ogohlantirish boradi"
        loading={loading === 'debtor'}
        onSwitch='for_debtor'
        name='debt_text'
        onSwitchInfo={Boolean(companyInfo?.auto_sms?.for_debtor)}
        placeholders={PLACEHOLDERS.deptStudents}
        updateSettings={updateSettings}
        defaultValue={companyInfo?.auto_sms?.debt_text}
      />

      <SmsCard
        title="O'quvchi baholarini yuborish"
        alert="Kelmagan o'quvchiga ertasi kuni sms xabarnoma yuboriladi"
        loading={loading === 'debtor'}
        onSwitch='on_score'
        name='debt_text'
        onSwitchInfo={Boolean(companyInfo?.auto_sms?.on_score)}
        placeholders={PLACEHOLDERS.deptStudents}
        updateSettings={updateSettings}
        defaultValue={companyInfo?.auto_sms?.debt_text}
      />
    </Box>
  )
}

export default SmsSettings
