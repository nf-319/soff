'use client'

import { FC, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Paper,
  Tooltip
} from '@mui/material'
import { PlaceholdersButtonsAreaTypes } from 'src/types'
import { TextAreaWithPlaceholders } from 'src/components'
import InfoIcon from '@mui/icons-material/Info'

type Props = {
  loading: boolean
  updateSettings: (key: string, value: any) => Promise<void>
  defaultValue?: string | null
  placeholders: PlaceholdersButtonsAreaTypes[]
  title: string
  companyName: string
  onSwitch: string
  name: string
  onSwitchInfo: boolean
  alert?: string
}

export const SmsCard: FC<Props> = ({
  onSwitchInfo,
  loading,
  updateSettings,
  defaultValue = '',
  name,
  companyName,
  alert,
  onSwitch,
  title,
  placeholders
}) => {
  const [value, setValue] = useState(defaultValue || '')
  const [editable, setEditable] = useState(false)

  const handleSave = async () => {
    if (!editable) {
      setEditable(true)
      return
    }
    await updateSettings(name, value)
    setEditable(false)
  }

  const handleCancel = () => {
    setValue(defaultValue || '')
    setEditable(false)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        marginBottom: 3,
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.20)',
        overflow: 'hidden',
        boxShadow: 'none'
      }}
    >
      <Card sx={{ border: 'none', boxShadow: 'none' }}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: '#f5f5f5',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant='h6' sx={{ fontWeight: 500 }}>
                {title}
              </Typography>

              {alert && (
                <Tooltip title={alert}>
                  <InfoIcon fontSize='small' color='primary' />
                </Tooltip>
              )}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={onSwitchInfo}
                  onChange={async (_, checked) => {
                    await updateSettings(onSwitch, checked)
                  }}
                />
              }
              label={onSwitchInfo ? 'Faol' : "O'chirilgan"}
              labelPlacement='start'
              sx={{
                mr: 0,
                '.MuiFormControlLabel-label': {
                  fontSize: '16px',
                  fontWeight: 600,
                  color: onSwitchInfo ? 'success.main' : 'text.secondary'
                }
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ p: onSwitchInfo ? 4 : 0 }}>
          {onSwitchInfo ? (
            <TextAreaWithPlaceholders
              value={value}
              shortDescription="Xabar matniga dinamik ma'lumotlarni qo'shish uchun quyidagi tugmalardan foydalaning"
              editable={editable}
              loading={loading}
              alert={alert}
              companyName={companyName}
              handleCancel={handleCancel}
              handleChange={handleSave}
              setEditable={setEditable}
              placeholders={placeholders}
              defaultValue={defaultValue || ''}
              onChange={setValue}
            />
          ) : (
            <Box sx={{ paddingTop: 4, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant='body2'>Ushbu xususiyatni yoqish uchun yuqoridagi tugmani yoqing</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Paper>
  )
}
