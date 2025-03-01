'use client'

import { Box, Button, Switch, TextField } from '@mui/material'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import VideoHeader, { videoUrls } from 'src/@core/components/video-header/video-header'
import useResponsive from 'src/@core/hooks/useResponsive'
import useDebounce from 'src/hooks/useDebounce'

export const LidsHeader = () => {
  const { push, query } = useRouter()
  const { t } = useTranslation()
  const { isMobile } = useResponsive()
  const params = new URLSearchParams(window.location.search)

  const searchQuery = Array.isArray(query.search) ? query.search[0] : query.search || ''
  const isActiveQuery = Array.isArray(query.is_active) ? query.is_active[0] : query.is_active

  const [search, setSearch] = useState<string>(searchQuery)
  const [isActive, setIsActive] = useState<boolean>(isActiveQuery !== 'false')
  const searchVal = useDebounce(search, 800)

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

      <Box display='flex' flexDirection='row-reverse' alignItems='center' justifyContent='center' gap={4}>
        {isMobile ? (
          <Button
            fullWidth
            onClick={() => push('/lids/add-department')}
            sx={{ minWidth: '300px', my: 4 }}
            size='small'
            variant='contained'
            startIcon={<Plus />}
          >
            {t("Bo'lim yaratish")}
          </Button>
        ) : (
          <Button
            onClick={() => push('/lids/add-department')}
            sx={{ minWidth: '300px' }}
            size='medium'
            variant='contained'
            startIcon={<Plus />}
          >
            {t("Bo'lim yaratish")}
          </Button>
        )}

        <VideoHeader item={videoUrls.leads} />
      </Box>
    </Box>
  )
}

LidsHeader.displayName = 'LidsHeader'
