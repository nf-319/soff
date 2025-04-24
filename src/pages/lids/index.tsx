'use client'

import { Fragment, useEffect, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Tab,
  Tabs,
  Tooltip
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'
import { setOpenActionModal, setOpenItem, setOpenLid } from 'src/store/apps/leads'
import { Plus } from 'lucide-react'
import IconifyIcon from '../../components/icon'
import CreateDepartmentItemDialog from 'src/views/apps/lids/departmentItem/Dialog'
import { useRouter } from 'next/router'
import CreateDepartmentDialog from 'src/views/apps/lids/department/create-dialog'
import EditDepartmentDialog from 'src/views/apps/lids/department/edit-dialog'
import { LidsDeleteModal } from 'src/entities/lids/modals/DeleteModal'
import { useGet } from 'src/hooks/useApi'
import { LeadsKanban, LeadsType, LidsHeader } from 'src/entities/lids'
import { useAuth } from 'src/hooks/useAuth'
import { LidsEditModal } from 'src/entities/lids/modals'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useTranslation } from 'react-i18next'

export type DepartmentsResultType = {
  id: number
  name: string
  is_active: boolean
}

type AmoLeads = {
  id: number
  name: string
  steps: AmoLeadItem[]
}

type AmoLeadItem = {
  id: number
  name: string
  sort: number
  is_editable: boolean
  pipeline_id: number
  color: string
  type: number
  account_id: number
}

const Lids = () => {
  const { queryParams } = useSelector((state: RootState) => state.leads)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { id, is_active, is_amocrm } = router.query
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [selectedAmoLeadTab, setSelectedAmoLeadTab] = useState<any>(null)
  const [selectedAmoData, setSelectedAmoData] = useState<AmoLeads | null>(null)

  const [currentData, setCurrentData] = useState<DepartmentsResultType | undefined>()
  const [openDialog, setOpenDialog] = useState<'edit' | 'recover' | null>(null)
  const { isMobile } = useResponsive()
  const { user } = useAuth()
  const { t } = useTranslation()
  const {
    data: leadData,
    isLoading,
    refetch
  } = useGet<LeadsType<DepartmentsResultType[]>>('leads/departments/', {
    deps: ['leads'],
    options: { enabled: !is_amocrm },
    params: { branch: user?.active_branch, is_active: is_active || true, parent: null }
  })

  const { data: amoCrmLeadData, isLoading: amoCrmLoading } = useGet<AmoLeads[]>('amocrm/pipelines/?with_steps=true', {
    options: { enabled: !!is_amocrm },
    deps:['amo-leads']
  })

  useEffect(() => {
    if (!amoCrmLoading && amoCrmLeadData?.length && selectedAmoLeadTab === null && is_amocrm) {
      setSelectedAmoLeadTab(amoCrmLeadData[0]?.id)
      setSelectedAmoData(amoCrmLeadData[0])
    }
  }, [amoCrmLeadData, amoCrmLoading, selectedAmoLeadTab])

  useEffect(() => {
    if (!leadData || leadData.results.length === 0) return

    const currentDeptId = currentData?.id

    if (id) {
      const index = leadData.results.findIndex(item => String(item.id) === String(id))
      if (index !== -1) {
        setCurrentData(leadData.results[index])
        setSelectedTab(index)
      }
    } else if (currentDeptId) {
      const index = leadData.results.findIndex(item => item.id === currentDeptId)
      if (index !== -1) {
        setCurrentData(leadData.results[index])
        setSelectedTab(index)
      } else {
        setCurrentData(leadData.results[0])
        setSelectedTab(0)
      }
    } else {
      const firstDept = leadData.results[0]
      setCurrentData(firstDept)
      setSelectedTab(0)
    }
  }, [leadData, id, router.query.search])

  function handleAmoTabChange(val: any) {
    setSelectedAmoLeadTab(val.target.value)
    const selectedData = amoCrmLeadData?.find((item: any) => item.id == val.target.value)
    setSelectedAmoData(selectedData || null)
  }

  const handleTabChange = (event: SelectChangeEvent<number>) => {
    if (!leadData || !leadData.results[event.target.value as number]) return
    const selectedDept = leadData.results[event.target.value as number]
    setSelectedTab(Number(event.target.value))
    setCurrentData(selectedDept)
  }

  const setOpen = (value: 'delete' | 'edit') => {
    dispatch(setOpenActionModal({ open: value, id: Number(currentData?.id) }))
  }

  const currentDepartmentId = currentData?.id ? String(currentData.id) : null

  return (
    <div>
      <LidsHeader />
      <Box display={isMobile ? '' : 'flex'} justifyContent='space-between' marginY={5} alignItems='center'>
        {isLoading || amoCrmLoading ? (
          <Skeleton variant='rectangular' sx={{ borderRadius: 1 }} width={150} height={50} />
        ) : is_amocrm ? (
          <Select
            placeholder={"Bo'lim"}
            sx={{ marginBottom: isMobile ? 4 : 0 }}
            fullWidth={isMobile}
            size='medium'
            value={selectedAmoLeadTab}
            onChange={e => handleAmoTabChange(e)}
            displayEmpty
          >
            {amoCrmLeadData?.map((item: any) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Select
            sx={{ marginBottom: isMobile ? 4 : 0 }}
            fullWidth={isMobile}
            size='medium'
            value={selectedTab}
            onChange={handleTabChange}
            displayEmpty
          >
            {leadData?.results.map((item, index) => (
              <MenuItem key={item.id} value={index}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        )}

        {!is_amocrm && (
          <Box display='flex' justifyContent='space-between' gap={4} alignItems='center' flexShrink={0}>
            <Button
              fullWidth={isMobile}
              size='medium'
              variant='outlined'
              onClick={() => dispatch(setOpenItem(currentDepartmentId))}
              startIcon={<Plus />}
            >
              <b>{currentData?.name}</b>
              {t('ga yangi bo‘lim qo‘shish')}
            </Button>

            {queryParams.is_active && (
              <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <div>
                  <Tooltip title={t("Yangi lead qo'shish")}>
                    <IconButton
                      onClick={() => dispatch(setOpenLid(currentDepartmentId))}
                      sx={{ cursor: 'pointer', marginLeft: 'auto' }}
                    >
                      <IconifyIcon icon={'fluent:person-add-24-filled'} color='#84cc16' />
                    </IconButton>
                  </Tooltip>

                  {currentData?.name?.toLowerCase() !== 'leads' && (
                    <Fragment>
                      <Tooltip title={t('Bo‘lim nomini tahrirlash')}>
                        <IconButton onClick={() => setOpen('edit')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                          <IconifyIcon icon={'fluent:text-bullet-list-square-edit-20-filled'} color='orange' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('Bo‘limni o‘chirish')}>
                        <IconButton onClick={() => setOpen('delete')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                          <IconifyIcon icon={'icon-park-solid:delete-four'} color='red' style={{ padding: 1 }} />
                        </IconButton>
                      </Tooltip>
                    </Fragment>
                  )}
                </div>
              </Box>
            )}
          </Box>
        )}
      </Box>
      {is_amocrm ? (
        <LeadsKanban selectedData={selectedAmoData} defaultId={selectedAmoData?.id} />
      ) : (
        <LeadsKanban defaultId={currentData?.id} />
      )}

      <EditDepartmentDialog id={Number(currentDepartmentId)} name={(currentData && currentData.name) || ''} />
      <CreateDepartmentDialog />
      <LidsDeleteModal refetch={refetch} id={currentData?.id as number} />

      <CreateDepartmentItemDialog />

      <LidsEditModal
        refetch={refetch}
        title={currentData?.name as string}
        id={currentData?.id as number}
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </div>
  )
}

Lids.displayName = 'Lids'
export default Lids
