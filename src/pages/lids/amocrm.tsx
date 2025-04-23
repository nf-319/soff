import useResponsive from '@/@core/hooks/useResponsive'
import { useGet } from '@/hooks/useApi'
import { Box, MenuItem, Select, Skeleton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export type AmoLeads = {
  id: number
  name: string
  steps: AmoLeadItem[]
}

export type AmoLeadItem = {
  id: number
  name: string
  sort: number
  is_editable: boolean
  pipeline_id: number
  color: string
  type: number
  account_id: number
}

const AmoCrmLeads = () => {
  const { query } = useRouter()
  const [selectedTab, setSelectedTab] = useState<any>(null)
  const [selectedData, setSelectedData] = useState<AmoLeads |null>(null)
  const { data: amoCrmLeadData, isLoading: amoCrmLoading } = useGet<AmoLeads[]>('amocrm/pipelines/?with_steps=true', {
    options: { enabled: !!query.is_amocrm }
  })
  const { data: amoLeadDataChild, isLoading: amoLeadDataChildLoding } = useGet(
    `amocrm/leads/?pipeline_id=${selectedTab}`,
    { options: { enabled: !!selectedTab } }
  )
  const { isMobile } = useResponsive()


  useEffect(() => {
    if (!amoCrmLoading && amoCrmLeadData?.length && selectedTab === null) {
      setSelectedTab(amoCrmLeadData[0]?.id)
      setSelectedData(amoCrmLeadData[0])
    }
  }, [amoCrmLeadData, amoCrmLoading, selectedTab])

  function handleTabChange(val: any) {
    setSelectedTab(val.target.value)
    const selectedData = amoCrmLeadData?.find((item: any) => item.id == val.target.value)
    setSelectedData(selectedData ||null)
  }

  return (
    <Box marginY={5}>
      {amoCrmLoading ? (
        <Skeleton variant='rectangular' sx={{ borderRadius: 1 }} width={150} height={50} />
      ) : (
        <Select
          placeholder={"Bo'lim"}
          sx={{ marginBottom: isMobile ? 4 : 0 }}
          fullWidth={isMobile}
          size='medium'
          value={selectedTab}
          onChange={e => handleTabChange(e)}
          displayEmpty
        >
          {amoCrmLeadData?.map((item: any) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      )}
      {amoCrmLoading ? (
        <Box display='flex' flexDirection='column' marginBottom={10} gap={5}>
          <Box display='flex' gap={5}>
            <Skeleton variant='rounded' width={300} height={50} />
            <Skeleton variant='rounded' width={300} height={50} />
            <Skeleton variant='rounded' width={300} height={50} />
            <Skeleton variant='rounded' width={300} height={50} />
          </Box>

          <Box display='flex' gap={5}>
            <Skeleton variant='rounded' width={300} height={80} />
            <Skeleton variant='rounded' width={300} height={80} />
            <Skeleton variant='rounded' width={300} height={80} />
            <Skeleton variant='rounded' width={300} height={80} />
          </Box>
        </Box>
      ) : (
          
        selectedData?.steps?.map((item) => <Typography>{item.name}</Typography>)
      )}
    </Box>
  )
}

export default AmoCrmLeads
