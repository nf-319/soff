'use client'

import { useEffect, useState } from 'react'
import { Box, Button, IconButton, Skeleton, Tab, Tabs } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'
import { setOpenActionModal, setOpenItem, setOpenLid } from 'src/store/apps/leads'
import { Plus } from 'lucide-react'
import IconifyIcon from 'src/@core/components/icon'
import CreateDepartmentItemDialog from 'src/views/apps/lids/departmentItem/Dialog'
import { useRouter } from 'next/router'
import CreateDepartmentDialog from 'src/views/apps/lids/department/create-dialog'
import EditDepartmentDialog from 'src/views/apps/lids/department/edit-dialog'
import { LidsDeleteModal } from 'src/entities/lids/modals/DeleteModal'
import { useGet } from 'src/hooks/useApi'
import { LeadsKaban, LeadsType, LidsHeader } from 'src/entities/lids'
import { useAuth } from 'src/hooks/useAuth'
import { LidsEditModal } from 'src/entities/lids/modals'

type DepartmentsResultType = {
  id: number
  name: string
  is_active: boolean
}

const Lids = () => {
  const { queryParams } = useSelector((state: RootState) => state.leads)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = new URLSearchParams(window.location.search)
  const { id, is_active } = router.query
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [currentData, setCurrentData] = useState<DepartmentsResultType | undefined>()
  const [openDialog, setOpenDialog] = useState<'edit' | 'recover' | null>(null)

  const { user } = useAuth()

  const { data: leadData, isLoading } = useGet<LeadsType<DepartmentsResultType[]>>('leads/departments/', {
    params: { branch: user?.active_branch, is_active: is_active || true, parent: null }
  })

  useEffect(() => {
    if (!leadData || leadData.results.length === 0) return

    if (id) {
      const index = leadData.results.findIndex(item => String(item.id) === String(id))
      if (index !== -1) {
        setCurrentData(leadData.results[index])
        setSelectedTab(index)
      }
    } else {
      const firstDept = leadData.results[0]
      setCurrentData(firstDept)
      setSelectedTab(0)

      // Don't update the URL with ID when loading without ID
    }
  }, [leadData, id])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (!leadData || !leadData.results[newValue]) return

    const selectedDept = leadData.results[newValue]
    setSelectedTab(newValue)
    setCurrentData(selectedDept)
  }

  const setOpen = (value: 'delete' | 'edit') => {
    dispatch(setOpenActionModal({ open: value, id: Number(currentData?.id) }))
  }

  const currentDepartmentId = currentData?.id ? String(currentData.id) : null

  return (
    <div>
      <LidsHeader />

      <Box display='flex' justifyContent='space-between' marginY={5} alignItems='center'>
        {isLoading ? (
          <Tabs variant='standard'>
            {[...Array(3)].map((_, index) => (
              <Tab key={index} label={<Skeleton width={80} height={20} />} disabled />
            ))}
          </Tabs>
        ) : (
          <Tabs value={selectedTab} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
            {leadData?.results.map((item, index) => (
              <Tab key={item.id} label={item.name} value={index} />
            ))}
          </Tabs>
        )}

        <Box display='flex' justifyContent='space-between' gap={4} alignItems='center' flexShrink={0}>
          <Button
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

                <IconButton
                  onClick={() => dispatch(setOpenItem(currentDepartmentId))}
                  sx={{ cursor: 'pointer', marginLeft: 'auto' }}
                >
                  <IconifyIcon icon={'heroicons-solid:view-grid-add'} color='#14b8a6' />
                </IconButton>

                <IconButton onClick={() => setOpen('edit')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                  <IconifyIcon icon={'fluent:text-bullet-list-square-edit-20-filled'} color='orange' />
                </IconButton>

                {currentData?.name?.toLowerCase() !== 'leads' && (
                  <IconButton onClick={() => setOpen('delete')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                    <IconifyIcon icon={'icon-park-solid:delete-four'} color='red' style={{ padding: 1 }} />
                  </IconButton>
                )}
              </div>
            </Box>
          )}
        </Box>
      </Box>

      <LeadsKaban defaultId={currentData?.id} />

      <EditDepartmentDialog id={Number(currentDepartmentId)} name={''} />
      <CreateDepartmentDialog />
      <LidsDeleteModal id={currentData?.id as number} />

      <CreateDepartmentItemDialog />

      <LidsEditModal
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
