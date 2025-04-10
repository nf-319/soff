import { useState } from 'react'

import Radio from '@mui/material/Radio'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'

import Icon from '../icon'

import { Settings } from '@/@core/context/settingsContext'

import { useSettings } from '@/@core/hooks/useSettings'
import { useTranslation } from 'react-i18next'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  bottom: '5%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  zIndex: theme.zIndex.modal,
  padding: theme.spacing(2.5),
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const Customizer = () => {
  const [open, setOpen] = useState<boolean>(false)

  const { settings, saveSettings } = useSettings()
  const { t } = useTranslation()

  const {
    mode,
    appBar,
    layout,
    contentWidth,
  } = settings

  const handleChange = (field: keyof Settings, value: Settings[keyof Settings]): void => {
    saveSettings({ ...settings, [field]: value })
  }

  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
        <Icon icon='mdi:cog-outline' fontSize={20} />
      </Toggler>
      <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {t('Sayt sozlamalari')}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{t("O'zingizga mos ko'rinishni tanlang")}</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
        <Box>
          <CustomizerSpacing className='customizer-body'>
            <Box sx={{ mb: 4 }}>
              <Typography>{t('Rejim')}</Typography>
              <RadioGroup
                row
                value={mode}
                onChange={e => handleChange('mode', e.target.value as any)}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='light' label={t('Yorqin')} control={<Radio />} />
                <FormControlLabel value='dark' label={t('Tungi')} control={<Radio />} />
                {layout === 'horizontal' ? null : (
                  <FormControlLabel value='semi-dark' label={t('Aralash')} control={<Radio />} />
                )}
              </RadioGroup>
            </Box>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Box sx={{ mb: 4 }}>
              <Typography>{t("Sahifa o'lchami")}</Typography>
              <RadioGroup
                row
                value={contentWidth}
                onChange={e => handleChange('contentWidth', e.target.value as Settings['contentWidth'])}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='full' label={t("To'liq")} control={<Radio />} />
                <FormControlLabel value='boxed' label={t('Chegaralangan')} control={<Radio />} />
              </RadioGroup>
            </Box>
          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Box sx={{ mb: layout === 'horizontal' && appBar === 'hidden' ? {} : 4 }}>
              <Typography>{t('Menyu joylashuvi')}</Typography>
              <RadioGroup
                row
                value={layout}
                onChange={e => {
                  saveSettings({
                    ...settings,
                    layout: e.target.value as Settings['layout'],
                    lastLayout: e.target.value as Settings['lastLayout']
                  })
                }}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <FormControlLabel value='vertical' label={t('Vertikal')} control={<Radio />} />
                <FormControlLabel value='horizontal' label={t('Gorizontal')} control={<Radio />} />
              </RadioGroup>
            </Box>
          </CustomizerSpacing>
        </Box>
      </Drawer>
    </div>
  )
}

Customizer.displayName = 'Customizer'
export default Customizer
