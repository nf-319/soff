'use client'

import { Fragment, useEffect, useState } from 'react'
import { Box, Button, IconButton, MenuItem, Select, SelectChangeEvent, Skeleton, Tab, Tabs } from '@mui/material'
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

export type DepartmentsResultType = {
  id: number
  name: string
  is_active: boolean
}

const Lids = () => {
  const { queryParams } = useSelector((state: RootState) => state.leads)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { id, is_active } = router.query
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [currentData, setCurrentData] = useState<DepartmentsResultType | undefined>()
  const [openDialog, setOpenDialog] = useState<'edit' | 'recover' | null>(null)
  const { isMobile } = useResponsive()
  const { user } = useAuth()

  const {
    data: leadData,
    isLoading,
    refetch
  } = useGet<LeadsType<DepartmentsResultType[]>>('leads/departments/', {
    deps: ['leads'],
    params: { branch: user?.active_branch, is_active: is_active || true, parent: null }
  })

  // Modified approach
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

  console.log(currentData?.id)

  return (
    <div>
      <LidsHeader />
      <Box display={isMobile ? '' : 'flex'} justifyContent='space-between' marginY={5} alignItems='center'>
        {isLoading ? (
          <Skeleton variant='rectangular' width={120} height={40} />
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

        <Box display='flex' justifyContent='space-between' gap={4} alignItems='center' flexShrink={0}>
          <Button
            fullWidth={isMobile}
            size='medium'
            variant='outlined'
            onClick={() => dispatch(setOpenItem(currentDepartmentId))}
            startIcon={<Plus />}
          >
            <b>{currentData?.name}</b>ga yangi bo'lim qo'shish
          </Button>

          {queryParams.is_active && (
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <div>
                <IconButton
                  onClick={() => dispatch(setOpenLid(currentDepartmentId))}
                  sx={{ cursor: 'pointer', marginLeft: 'auto' }}
                >
                  <IconifyIcon icon={'fluent:person-add-24-filled'} color='#84cc16' />
                </IconButton>

                {currentData?.name?.toLowerCase() !== 'leads' && (
                  <Fragment>
                    <IconButton onClick={() => setOpen('edit')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                      <IconifyIcon icon={'fluent:text-bullet-list-square-edit-20-filled'} color='orange' />
                    </IconButton>

                    <IconButton onClick={() => setOpen('delete')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                      <IconifyIcon icon={'icon-park-solid:delete-four'} color='red' style={{ padding: 1 }} />
                    </IconButton>
                  </Fragment>
                )}
              </div>
            </Box>
          )}
        </Box>
      </Box>

      <LeadsKanban defaultId={currentData?.id} />

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
