'use client'

import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Switch,
  Tooltip
} from '@mui/material'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useResponsive from 'src/@core/hooks/useResponsive'
import useDebounce from 'src/hooks/useDebounce'
import { useAppDispatch } from 'src/store'
import { setOpen } from 'src/store/apps/leads'
import { useGet } from '@/hooks/useApi'

export const LidsHeader = () => {
  const { push, query } = useRouter()
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const params = new URLSearchParams(window.location.search)
  const { data: amoCrmdata } = useGet('amocrm/data/')
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>(params.get('search') ?? '')
  const [isActive, setIsActive] = useState<boolean>(Boolean(!params.get('is_active')))
  const [isAmoCrm, setIsAmoCrm] = useState<boolean>(!!params.get('is_amocrm'))

  const searchVal = useDebounce(search, 800)

  useEffect(() => {
    const searchQuery = Array.isArray(query.search) ? query.search[0] : query.search || ''
    setSearch(searchQuery)
  }, [query.search])

  useEffect(() => {
    const updatedQuery = { ...query }

    if (searchVal?.trim()) {
      updatedQuery.search = searchVal.trim()
    } else {
      delete updatedQuery.search
    }

    if (isAmoCrm) {
      updatedQuery.is_amocrm = 'true'

      if (!isActive) {
        updatedQuery.is_active = 'false'
      } else {
        delete updatedQuery.is_active
      }
    } else {
      delete updatedQuery.is_amocrm

      if (!isActive) {
        updatedQuery.is_active = 'false'
      } else {
        delete updatedQuery.is_active
      }
    }

    if (isAmoCrm || !isActive) {
      delete updatedQuery.id
    }

    void push({
      pathname: '/lids',
      query: updatedQuery
    })
  }, [searchVal, isActive, isAmoCrm])

  return (
    <Box
      sx={{
        width: '100%',
        p: '10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <form style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onSubmit={e => e.preventDefault()}>
        <FormControl>
          <InputLabel size='small'>Qidirish</InputLabel>
          <OutlinedInput
            autoComplete='off'
            label="Qidirish"
            size='small'
            sx={{ maxWidth: '300px', width: '100%' }}
            color='primary'
            endAdornment={
              <InputAdornment position='end'>
                <Search size={18} />
              </InputAdornment>
            }
            placeholder='Qidirish...'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </FormControl>

        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Switch checked={!isActive} onChange={() => setIsActive(prev => !prev)} />
          <Tooltip title={t('Arxivdagi leadlarni ko‘rish.')} arrow>
            <span>{t('Arxiv')}</span>
          </Tooltip>
        </label>
        <Button variant='outlined' onClick={() => push('/lids/stats')}>
          <Tooltip title={t('Lidlar manbasi va hisoboti.')}>
            <span>{t('Manba')}</span>
          </Tooltip>
        </Button>
        {amoCrmdata && (
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Switch checked={isAmoCrm} onChange={() => setIsAmoCrm(prev => !prev)} />
            <Tooltip title={t('Arxivdagi leadlarni ko‘rish.')} arrow>
              <span>{t('Amocrm')}</span>
            </Tooltip>
          </label>
        )}
      </form>

      <Box
        width={isMobile ? '100%' : 'auto'}
        display={isMobile ? '' : 'flex'}
        flexDirection='row-reverse'
        alignItems='center'
        justifyContent='center'
        gap={4}
      >
        {isMobile ? (
          <Button
            fullWidth
            onClick={() => dispatch(setOpen('add-department'))}
            sx={{ minWidth: '300px', my: 4 }}
            size='medium'
            variant='contained'
            startIcon={<Plus />}
          >
            {t("Bo'lim yaratish")}
          </Button>
        ) : (
          <Button
            onClick={() => dispatch(setOpen('add-department'))}
            sx={{ minWidth: '300px' }}
            size='medium'
            variant='contained'
            startIcon={<Plus />}
          >
            {t("Bo'lim yaratish")}
          </Button>
        )}
      </Box>
    </Box>
  )
}

LidsHeader.displayName = 'LidsHeader'
