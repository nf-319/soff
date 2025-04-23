import useResponsive from '@/@core/hooks/useResponsive'
import { useGet } from '@/hooks/useApi'
import { Box, MenuItem, Select, Skeleton } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const AmoCrmLeads = () => {
  const { query } = useRouter()
  const [selectedTab, setSelectedTab] = useState<any>(null)
  const { data: amoCrmLeadData, isLoading: amoCrmLoading } = useGet('amocrm/pipelines/?with_steps=true', {
    options: { enabled: !!query.is_amocrm }
  })
  const { isMobile } = useResponsive()

  useEffect(() => {
    if (!amoCrmLoading && amoCrmLeadData?.[0]?.steps?.length && selectedTab === null) {
      setSelectedTab(amoCrmLeadData[0].steps[0].id)
    }
  }, [amoCrmLeadData, amoCrmLoading, selectedTab])

  function handleTabChange(val: any) {
    setSelectedTab(val.target.value)
  }

  return (
    <Box marginY={5}>
      {amoCrmLoading ? (
        <Skeleton variant='rectangular' width={120} height={40} />
      ) : (
        <Select
          placeholder={"Bo'lim"}
          sx={{ marginBottom: isMobile ? 4 : 0 }}
          fullWidth={isMobile}
          size='medium'
          value={selectedTab}
          onChange={handleTabChange}
          displayEmpty
        >
          {amoCrmLeadData[0]?.steps?.map((item: any) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  )
}

export default AmoCrmLeads
