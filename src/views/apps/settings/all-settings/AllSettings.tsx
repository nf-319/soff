'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Tab, Tabs } from '@mui/material'
import CenterSetting from './CenterSetting'
import SmsSettings from 'src/pages/settings/ceo/sms-settings'

interface TabOption {
  label: string
  value: string
}

const tabOptions: TabOption[] = [
  { label: '🏢 Markaz Sozlamalari', value: 'center' },
  { label: '📩 Auto SMS Sozlamalari', value: 'sms' },
]

export const AllSettings = () => {
  const router = useRouter()
  const [tabIndex, setTabIndex] = useState<string>('center') // doimiy default

  useEffect(() => {
    if (router.isReady) {
      const tabFromURL = router.query.tab as string | undefined

      if (tabFromURL && tabOptions.some(tab => tab.value === tabFromURL)) {
        setTabIndex(tabFromURL)
      } else {
        setTabIndex('center')
      }
    }
  }, [router.isReady, router.query.tab])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue)

    const query = { ...router.query }

    if (newValue !== 'center') {
      query.tab = newValue
    } else {
      delete query.tab
    }

    void router.push(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <Box>
      <Tabs
        value={tabIndex}
        sx={{ marginBottom: 3 }}
        onChange={handleTabChange}
        variant="fullWidth"
      >
        {tabOptions.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      {tabIndex === 'center' && <CenterSetting />}
      {tabIndex === 'sms' && <SmsSettings />}
    </Box>
  )
}
