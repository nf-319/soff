import { Box, Menu, MenuItem } from '@mui/material'
import { useAppSelector } from '../../../store'
import IconifyIcon from '../../icon'
import { useTranslation } from 'react-i18next'
import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { AccessDeniedModal } from '@components/AccessDeniedModal'

type Props = {
  anchorEl: any
  setAnchorEl: any
  getSMSTemps: any
  getBranches: any
  setOpen: any
  is_amocrm?: boolean
}

export const KanbanItemMenu: FC<Props> = ({
  anchorEl,
  setAnchorEl,
  getSMSTemps,
  getBranches,
  setOpen: setOpenNative,
  is_amocrm
}) => {
  const { queryParams } = useAppSelector(state => state.leads)
  const { companyInfo } = useAppSelector(state => state.user)
  const { t } = useTranslation()
  const [accessModal, setAccessModal] = useState<boolean>(false)
  const rowOptionsOpen = Boolean(anchorEl)
  const router = useRouter()
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const setOpen = (value: any) => {
    setAnchorEl(null)
    setOpenNative(value)
  }

  const handleModalsOpen = () => {
    if (companyInfo.access) {
      void getSMSTemps()
      setOpen('sms')
    } else {
      setAccessModal(true)
    }
  }

  return (
    <Menu
      keepMounted
      anchorEl={anchorEl}
      open={rowOptionsOpen}
      onClose={handleRowOptionsClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      PaperProps={{ style: { minWidth: '8rem' } }}
    >
      {queryParams.is_active ? (
        <Box>
          {is_amocrm ? (
            <>
              <MenuItem onClick={() => setOpen('add-group')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='material-symbols:group-add' fontSize={17} />
                {t("Guruhga qo'shish")}
              </MenuItem>
              <MenuItem onClick={() => setOpen('merge-to')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='subway:round-arrow-2' fontSize={17} />
                {t("Soff crmga qo'shish")}
              </MenuItem>
              <MenuItem onClick={() => setOpen('merge-to-amo')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='subway:round-arrow-2' fontSize={17} />
                {t("Boshqa bo'limga o'tkazish")}
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={() => setOpen('note')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='ph:flag-light' fontSize={20} />
                {t('Yangi eslatma')}
              </MenuItem>
              <MenuItem onClick={handleModalsOpen} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='mdi:sms' fontSize={20} />
                {t('SMS yuborish')}
              </MenuItem>
              <MenuItem onClick={() => (getBranches(), setOpen('branch'))} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='system-uicons:branch' fontSize={20} />
                {t('Boshqa Filialga')}
              </MenuItem>
              <MenuItem onClick={() => setOpen('merge-to')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='subway:round-arrow-2' fontSize={17} />
                {t("Boshqa bo'limga")}
              </MenuItem>
              <MenuItem onClick={() => setOpen('add-group')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='material-symbols:group-add' fontSize={17} />
                {t("Guruhga qo'shish")}
              </MenuItem>
              <MenuItem onClick={() => setOpen('edit')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='mdi:edit' fontSize={20} />
                {t('Tahrirlash')}
              </MenuItem>
              <MenuItem onClick={() => setOpen('delete')} sx={{ '& svg': { mr: 2 } }}>
                <IconifyIcon icon='mdi:delete' fontSize={20} />
                {t("O'chirish")}
              </MenuItem>
              {router.query.is_active == 'false' && (
                <MenuItem onClick={() => setOpen('recover')} sx={{ '& svg': { mr: 2 } }}>
                  <IconifyIcon icon='mdi:reload' fontSize={20} />
                  {t('Arxivdan chiqarish')}
                </MenuItem>
              )}
            </>
          )}
        </Box>
      ) : (
        <>
          <MenuItem onClick={() => (getSMSTemps(), setOpen('sms'))} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:sms' fontSize={20} />
            {t('SMS yuborish')}
          </MenuItem>

          <MenuItem onClick={() => setOpen('recover')} sx={{ '& svg': { mr: 2 } }}>
            <IconifyIcon icon='mdi:reload' fontSize={20} />
            {t('Tiklash')}
          </MenuItem>
        </>
      )}

      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />
    </Menu>
  )
}
