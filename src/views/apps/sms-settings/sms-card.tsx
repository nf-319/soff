import { FC, useState, useRef } from 'react'
import {
  Box,
  Card,
  CardContent,
  Switch,
  Typography,
  Button,
  Stack,
  Tooltip,
  Chip, ButtonProps
} from '@mui/material'
import { ChipProps } from '@mui/material/Chip'

type PlaceholderType = {
  label: string
  value: string
  color: string
  placeholder: string
}

type Props = {
  companyInfo: any
  loading: boolean
  updateSettings: (key: string, value: any) => Promise<void>
  defaultValue?: string
  placeholders: PlaceholderType[]
  title: string
  subtitle: string
}

export const SmsCard: FC<Props> = ({
  companyInfo,
  loading,
  updateSettings,
  defaultValue = '',
  subtitle,
  title,
  placeholders
}) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState<(string | PlaceholderType)[]>(
    defaultValue?.split(/(\$\{\w+\})/).map(item => {
      const match = placeholders.find(ph => ph.value === item)
      return match ? match : item
    })
  )
  const [editable, setEditable] = useState(false)

  const handlePlaceholderInsert = (placeholder: PlaceholderType) => {
    setValue(prev => [...prev, placeholder, ' '])
  }

  const handleSave = async () => {
    if (!editable) {
      setEditable(true)
      return
    }
    const cleanValue = value.map(item => (typeof item === 'string' ? item : item.value)).join('')
    await updateSettings('birthday_text', cleanValue)
    setEditable(false)
  }

  return (
    <Card sx={{ width: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography>{title}</Typography>
          <Switch
            checked={Boolean(companyInfo?.auto_sms?.on_birthday)}
            onChange={async (_, checked) => {
              await updateSettings('on_birthday', checked)
            }}
          />
        </Box>
        <Typography variant='caption' sx={{ display: 'block', mb: 2, color: 'text.secondary' }}>
          {subtitle}
        </Typography>

        <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {placeholders.map((placeholder, index) => (
            <Tooltip key={index} title={placeholder.placeholder} placement='top'>
              <Button
                variant='contained'
                disabled={!editable}
                color={placeholder.color as ButtonProps['color']}
                size='small'
                onClick={() => handlePlaceholderInsert(placeholder)}
              >
                {placeholder.label}
              </Button>
            </Tooltip>
          ))}
        </Stack>

        <Typography
          ref={textRef}
          component='div'
          variant='body1'
          contentEditable={editable}
          suppressContentEditableWarning
          sx={{
            width: '100%',
            padding: '16.5px 14px',
            border: '1px solid rgba(0,0,0,0.23)',
            borderRadius: 1,
            minHeight: '125px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            outline: 'none'
          }}
          onInput={e => {
            const text = e.currentTarget.textContent || ''
            const newValue = text.split(/(\$\{\w+\})/).map(item => {
              const match = placeholders.find(ph => `\${${ph.value}}` === item)
              return match ? match : item
            })
            setValue(newValue)
          }}
        >
          {value?.map((item, index) =>
            typeof item === 'string' ? (
              <span key={index}>{item}</span>
            ) : (
              <Chip key={index} label={item.label} color={item.color as ChipProps['color']} size='small' />
            )
          )}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {editable && (
            <Button variant='outlined' color='secondary' onClick={() => setEditable(false)}>
              Bekor qilish
            </Button>
          )}
          <Button variant='contained' color='primary' onClick={handleSave} disabled={loading}>
            {editable ? 'Saqlash' : 'Tahrirlash'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
