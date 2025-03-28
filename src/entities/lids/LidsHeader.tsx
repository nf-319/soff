'use client'

import { Box, Button, Switch, TextField } from '@mui/material'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import VideoHeader, { videoUrls } from '../../components/video-header/video-header'
import useResponsive from 'src/@core/hooks/useResponsive'
import useDebounce from 'src/hooks/useDebounce'
import { useAppDispatch } from 'src/store'
import { setOpen } from 'src/store/apps/leads'

export const LidsHeader = () => {
  const { push, query } = useRouter()
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const params = new URLSearchParams(window.location.search)

  const searchQuery = Array.isArray(query.search) ? query.search[0] : query.search || ''
  const isActiveQuery = Array.isArray(query.is_active) ? query.is_active[0] : query.is_active
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>(searchQuery)
  const [isActive, setIsActive] = useState<boolean>(isActiveQuery !== 'false')
  const searchVal = useDebounce(search, 800)

  useEffect(() => {
    const searchQuery = Array.isArray(query.search) ? query.search[0] : query.search || '';
    setSearch(searchQuery);
  }, [query.search]);

  useEffect(() => {
    const updatedQuery = { ...query }

    if (searchVal && searchVal.trim().length > 0) {
      updatedQuery.search = searchVal
    } else {
      delete updatedQuery.search
    }

    if (!isActive) {
      updatedQuery.is_active = 'false'
      delete updatedQuery.id
      params.delete('id')
    } else {
      delete updatedQuery.is_active
    }

    void push({
      pathname: '/lids',
      query: updatedQuery
    })
  }, [searchVal, isActive])

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
        <TextField
          autoComplete='off'
          size='small'
          sx={{ maxWidth: '300px', width: '100%' }}
          color='primary'
          placeholder={`${t('Qidirish')}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Switch checked={!isActive} onChange={() => setIsActive(prev => !prev)} />
          
          {t('Arxiv')}
        </label>
        <Button variant='outlined' onClick={() => push('/lids/stats')}>
          {t('Hisobot')}
        </Button>
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

        <Box>
          <VideoHeader item={videoUrls.leads} />
        </Box>
      </Box>
    </Box>
  )
}

LidsHeader.displayName = 'LidsHeader'
