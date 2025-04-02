import { Box, Button, Card, CardContent, TextField, Typography, IconButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import { useGetSettings } from 'src/hooks/useSettings'
import { usePatchSettings } from 'src/hooks/useSettings/useSettings'
import { toast } from 'react-hot-toast'
import { Check, Edit, Upload } from 'lucide-react'

export const CompanyInfo = () => {
  const { t } = useTranslation()
  const [editable, setEditable] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const { data, isLoading } = useGetSettings()
  const { mutate, isPending } = usePatchSettings()

  const updateSettings = useCallback(
    async (field: string, value: any) => {
      try {
        await mutate({ [field]: value })
        toast.success('Yangilandi')
        setEditable(false)
      } catch (error: any) {
        console.error(error)
        toast.error(error?.msg || t('Xatolik yuz berdi'))
      }
    },
    [mutate, t]
  )

  return (
    <Card>
      <CardContent>
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <Typography sx={{ minWidth: '180px', fontSize: '16px' }}>{t('Tashkilot nomi')}:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {editable ? (
              <>
                <TextField size='small' focused defaultValue={data?.training_center_name} onChange={e => setName(e.target.value)} />
                <IconButton onClick={() => updateSettings('training_center_name', name)}>
                  <Check size={20} />
                </IconButton>
              </>
            ) : (
              <>
                <TextField value={data?.training_center_name} size='small' disabled />
                <IconButton onClick={() => setEditable(true)}>
                  <Edit size={20} />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography sx={{ minWidth: '180px', fontSize: '16px' }}>{t('Logo')}:</Typography>
          <img src={data?.logo} height={35} alt='Company Logo' />
          <Button component='label' variant='contained' size='small' startIcon={<Upload size={20} />}>
            {t('Yangilash')}
            <input
              type='file'
              hidden
              onChange={(e: any) => {
                if (e.target.files?.[0]) {
                  updateSettings('logo', e.target.files[0])
                }
              }}
            />
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
