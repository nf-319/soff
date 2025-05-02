import api from '@/@core/utils/api'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyDetails } from '@/store/apps/c-panel/companySlice'
import { LoadingButton } from '@mui/lab'
import { Box, FormControl, FormHelperText, InputLabel, TextField, Typography } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DeleteIcon, Trash } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const SmsProviderDetail = () => {
  const { t } = useTranslation()
  const { details } = useAppSelector(state => state.companyDetails)
  const dispatch = useAppDispatch()
  const { query } = useRouter()
  const [loading, setLoading] = useState(false)

  const deleteSms = async (id: string | number) => {
    setLoading(true)
    await api
      .delete(`owner/sms-provider/delete/${id}/`)
      .then(res => {
        dispatch(fetchCompanyDetails(Number(query?.slug)))
      })
      .catch(err => {
        console.log(err)
        toast.error(err.response.data.msg || 'Xatolik')
      })
    setLoading(false)
  }

  return (
    <form>
      <Box
        sx={{
          marginTop: 5,
          display: 'flex',
          gap: '20px',
          maxWidth: '400px',
          width: '100%',
          flexDirection: 'column'
        }}
      >
        <Typography sx={{ fontSize: '20px' }}>{t('Sms paket')}</Typography>
        <FormControl fullWidth>
          <TextField name='login' size='medium' label={t('Login')} value={details?.provider_data?.login} />
        </FormControl>
        <FormControl fullWidth>
          <TextField name='parol' size='medium' label={t('Parol')} value={details?.provider_data?.password} />
        </FormControl>
        <FormControl fullWidth>
          <TextField name='type' size='medium' label={t('Type')} value={details?.provider_data?.type} />
        </FormControl>

        <LoadingButton
          onClick={() => deleteSms(Number(details?.provider_data?.id))}
          loading={loading}
          variant='contained'
          color='error'
          startIcon={<Trash size={15} />}
          type='submit'
        >
          {t("O'chirish")}
        </LoadingButton>
      </Box>
    </form>
  )
}

export default SmsProviderDetail
