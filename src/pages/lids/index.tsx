'use client'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'src/store'
import api from 'src/@core/utils/api'
import {
  editAmoCrmData,
  editDepartment,
  fetchAmoCrmPipelines,
  fetchDepartmentList,
  fetchSources,
  setAddSource,
  setDragonLoading,
  setLeadItems,
  setOpenActionModal,
  setOpenItem,
  setOpenLid,
  setSectionId
} from 'src/store/apps/leads'
import EmptyContent from 'src/@core/components/empty-content'
import { EyeIcon, Phone, PlusIcon, User } from 'lucide-react'
import { LidsDragonModal } from 'src/views/apps/lids/LidsDragonModal'
import IconifyIcon from 'src/@core/components/icon'
import CreateAnonimUserForm from 'src/views/apps/lids/anonimUser/CreateAnonimUserForm'
import { useTranslation } from 'react-i18next'
import { PersonAddAlt } from '@mui/icons-material'
import useResponsive from 'src/@core/hooks/useResponsive'
import CreateDepartmentItemDialog from 'src/views/apps/lids/departmentItem/Dialog'
import EditDepartmentItemForm from 'src/views/apps/lids/departmentItem/EditDepartmentItemForm'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useRouter } from 'next/router'
import CreateDepartmentDialog from 'src/views/apps/lids/department/create-dialog'
import LidsHeader from 'src/views/apps/lids/LidsHeader'
import EditDepartmentDialog from 'src/views/apps/lids/department/edit-dialog'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'

const Lids = () => {
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const {
    leadItems,
    leadData,
    openLid,
    openActionModal: open,
    pipelines,
    dragonLoading,
    actionId,
    queryParams
  } = useSelector((state: RootState) => state.leads)
  const [data, setData] = useState(leadItems)
  const [source, setSource] = useState<any>(null)
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { settings } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)
  const [item, setItem] = useState<any>(null)
  const router = useRouter()
  const query = window.location?.search?.split('?slug=')[1]
  const { isMobile } = useResponsive()
  const [leadTitle, setLeadTitle] = useState('')
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [openDialog, setOpenDialog] = useState<'sms' | 'edit' | 'delete' | 'recover' | 'merge' | null>(null)

  async function handleGetLealdItems(departmentId: string | null) {
    if (!departmentId && leadData && leadData.length > 0) {
      departmentId = String(leadData[0].id)
    }

    if (!departmentId) return

    dispatch(setDragonLoading(true))

    try {
      const res = await api.get(`leads/department/${departmentId}`)
      dispatch(setLeadItems(res.data))
      setData(res.data)
    } catch (err) {
      console.error('Error fetching leads:', err)
    } finally {
      dispatch(setDragonLoading(false))
    }
  }

  const newPipelines = pipelines.find(value => value.name.toLowerCase() === leadTitle.toLowerCase())

  useEffect(() => {
    setData(leadItems)
  }, [leadItems])

  useEffect(() => {
    dispatch(fetchDepartmentList())
    dispatch(fetchSources())
  }, [])

  useEffect(() => {
    if (leadData && leadData.length > 0) {
      if (!query && leadData[0]) {
        const defaultId = String(leadData[0].id)
        const url = new URL(window.location.href)
        url.searchParams.set('slug', defaultId)
        router.push(url.pathname + '?slug=' + defaultId, undefined, { shallow: true })

        handleGetLealdItems(defaultId)
        setSelectedTab(0)
      } else {
        const tabIndex = leadData.findIndex(item => item.id == Number(query))
        setSelectedTab(tabIndex >= 0 ? tabIndex : 0)

        if (tabIndex >= 0) {
          const leadtitle = leadData[tabIndex]
          setLeadTitle(String(leadtitle?.name || ''))
          handleGetLealdItems(query)
        } else if (query) {
          handleGetLealdItems(query)
        }
      }
    }
  }, [leadData, query])

  const closeCreateLid = () => {
    dispatch(setOpenLid(null))
    dispatch(setAddSource(false))
    dispatch(setSectionId(null))
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (leadData && leadData[newValue]) {
      const selectedId = leadData[newValue].id
      setSelectedTab(newValue)

      const url = new URL(window.location.href)
      url.searchParams.set('slug', String(selectedId))
      router.push(url.pathname + '?slug=' + selectedId, undefined, { shallow: true })
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination || !data) return

    const { source, destination } = result

    const sourceColIndex = data.findIndex(e => String(e.id) === source.droppableId)
    const destinationColIndex = data.findIndex(e => String(e.id) === destination.droppableId)

    if (sourceColIndex === -1 || destinationColIndex === -1) return

    const sourceCol = data[sourceColIndex]
    const destinationCol = data[destinationColIndex]

    if (!sourceCol || !destinationCol) return

    if (sourceColIndex === destinationColIndex) {
      const updatedLeads = [...sourceCol.leads]
      const [movedLead] = updatedLeads.splice(source.index, 1)
      updatedLeads.splice(destination.index, 0, movedLead)

      const newData = [...data]
      newData[sourceColIndex] = { ...sourceCol, leads: updatedLeads }

      setData(newData)
    } else {
      const sourceLeads = [...sourceCol.leads]
      const destinationLeads = [...destinationCol.leads]

      const [movedLead] = sourceLeads.splice(source.index, 1)
      destinationLeads.splice(destination.index, 0, movedLead)

      const newData = [...data]
      newData[sourceColIndex] = { ...sourceCol, leads: sourceLeads }
      newData[destinationColIndex] = { ...destinationCol, leads: destinationLeads }

      setData(newData)

      try {
        await api.patch(`leads/anonim-user/update/${movedLead.id}/`, {
          department: destinationCol.id
        })
      } catch (error) {
        console.error("Failed to update lead's department:", error)
      }
    }
  }

  const handleMenuOpen = (event: any, lead: any) => {
    setStudentModalOpen(true)
    setSelectedLead(lead)
  }

  function handleClose() {
    setStudentModalOpen(false)
  }

  const setOpen = (value: 'delete' | 'edit' | null) => {
    if (!value) {
      dispatch(setOpenActionModal({ open: null, id: null }))
      return
    }

    dispatch(setOpenActionModal({ open: value, id: Number(query) }))
  }

  const deleteDepartmentItem = async () => {
    await dispatch(editDepartment({ is_active: false, id: query }))
    setOpen(null)
    toast.success("Muvaffaqiyatli o'chirildi")
    await dispatch(fetchDepartmentList())
  }

  const deleteAmoCrmData = async () => {
    await dispatch(editAmoCrmData({ data_id: query, is_delete: true, condition: 'pipeline' }))
    setOpen(null)
    toast.success("Muvaffaqiyatli o'chirildi", {
      position: 'top-center'
    })
    await dispatch(fetchAmoCrmPipelines(queryParams))
  }

  const currentDepartmentId = query || (leadData && leadData.length > 0 ? String(leadData[0].id) : null)

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <LidsHeader />

      <Box display='flex' justifyContent='space-between' marginY={5} alignItems='center'>
        {leadData && leadData.length > 0 ? (
          <Tabs value={selectedTab} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
            {leadData.map((item, index) => (
              <Tab key={item.id} label={item.name} value={index} />
            ))}
          </Tabs>
        ) : (
          <Tabs variant='scrollable' scrollButtons='auto'>
            {[...Array(3)].map((_, index) => (
              <Tab key={index} label={<Skeleton width={80} height={20} />} disabled />
            ))}
          </Tabs>
        )}

        <Box display='flex' justifyContent='space-between' gap={4} alignItems='center'>
          <Button
            size='medium'
            variant='outlined'
            onClick={() => dispatch(setOpenItem(currentDepartmentId))}
            startIcon={<PlusIcon />}
          >
            <b>{leadTitle}</b>ga yangi bo'lim qo'shish
          </Button>

          {queryParams.is_active && (
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <div>
                <IconButton onClick={() => dispatch(setOpenLid(query))} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                  <IconifyIcon icon={'fluent:person-add-24-filled'} color='#84cc16' />
                </IconButton>
                <IconButton onClick={() => dispatch(setOpenItem(query))} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                  <IconifyIcon icon={'heroicons-solid:view-grid-add'} color='#14b8a6' />
                </IconButton>
                <IconButton onClick={() => setOpen('edit')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                  <IconifyIcon icon={'fluent:text-bullet-list-square-edit-20-filled'} color='orange' />
                </IconButton>

                {leadTitle?.toLowerCase() !== 'leads' && (
                  <IconButton onClick={() => setOpen('delete')} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                    <IconifyIcon icon={'icon-park-solid:delete-four'} color='red' style={{ padding: 1 }} />
                  </IconButton>
                )}
              </div>
            </Box>
          )}
        </Box>
      </Box>

      <div
        className='kanban'
        style={{
          paddingBottom: 20,
          display: 'flex',
          overflow: 'auto',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'start',
          gap: 20
        }}
      >
        {dragonLoading ? (
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
        ) : data?.length ? (
          data?.map(section => (
            <Droppable key={section?.id} droppableId={String(section?.id)}>
              {provided => (
                <div
                  {...provided.droppableProps}
                  className='kanban__section'
                  ref={provided.innerRef}
                  style={{
                    width: isMobile ? '100%' : 'auto',
                    padding: 20,
                    background: settings.mode == 'dark' ? '#282A42' : 'white',
                    borderRadius: 10
                  }}
                >
                  <Box display='flex' alignItems='center' marginBottom={2} gap={3}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        background: settings.mode == 'dark' ? '#282A42' : 'white',
                        borderRadius: 10,
                        minWidth: 300,
                        fontSize: 25
                      }}
                    >
                      {section.name}
                      <Chip color='primary' variant='outlined' label={section.leads.length} />
                    </div>
                    <IconButton onClick={() => setItem(section)} sx={{ cursor: 'pointer', marginLeft: 'auto' }}>
                      <IconifyIcon
                        icon={'fluent:text-bullet-list-square-edit-20-filled'}
                        color='orange'
                        onClick={() => setOpenDialog('edit')}
                      />
                    </IconButton>
                  </Box>

                  <div
                    style={{ marginBottom: 10, maxHeight: '50vh', paddingRight: 10, overflow: 'auto' }}
                    className='kanban__section__content'
                  >
                    {section.leads?.map((lead: any, index: any) => (
                      <Draggable key={lead?.id} draggableId={String(lead?.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className={`shadow-sm p-3 ${settings.mode == 'dark' ? 'bg-#282A42' : 'bg-light'}   rounded`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? '0.5' : '1',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderRadius: 10,
                              marginBottom: 10,
                              textAlign: 'center',
                              padding: '5px'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <User width={20} height={20} color='blue' />

                                {lead.first_name}
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <Phone width={18} height={18} color='blue' />
                                <Typography fontSize={12}>{lead?.phone}</Typography>
                              </div>
                            </div>

                            <IconButton onClick={event => handleMenuOpen(event, lead)}>
                              <EyeIcon />
                            </IconButton>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  <Box>
                    <Button
                      size='medium'
                      fullWidth
                      onClick={() => {
                        setSource(section?.id), dispatch(setOpenLid(currentDepartmentId))
                      }}
                      variant='outlined'
                      startIcon={<PersonAddAlt />}
                    >
                      Yangi lid qo'shish
                    </Button>
                  </Box>
                </div>
              )}
            </Droppable>
          ))
        ) : (
          <EmptyContent />
        )}
      </div>

      <EditDepartmentDialog id={Number(query)} name={leadTitle} />

      <CreateDepartmentDialog />

      <Dialog open={open === 'delete' && actionId === Number(query)}>
        <DialogContent sx={{ width: '320px', padding: '20px 0' }}>
          <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
            {t("Bo'limni rostdan ham o'chirmoqchimisiz?")}
          </Typography>
        </DialogContent>

        <Box sx={{ padding: '0 0 20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button color='primary' variant='outlined' onClick={() => setOpen(null)}>
            {t('Bekor qilish')}
          </Button>

          <LoadingButton
            color='error'
            loading={loading}
            variant='contained'
            onClick={leadData ? deleteAmoCrmData : deleteDepartmentItem}
          >
            {t("O'chirish")}
          </LoadingButton>
        </Box>
      </Dialog>

      <LidsDragonModal handleClose={handleClose} openModal={studentModalOpen} selectedLead={selectedLead} />

      <Dialog onClose={closeCreateLid} open={openLid !== null}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t('Yangi Lid')}
          </Typography>
          <IconButton aria-label='close' onClick={closeCreateLid}>
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: '320px' }}>
          <CreateAnonimUserForm source={source ? source : null} />
        </DialogContent>
      </Dialog>

      <CreateDepartmentItemDialog />

      <Dialog open={openDialog === 'edit'} onClose={() => setOpenDialog(null)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('Tahrirlash')}</Typography>
          <IconifyIcon onClick={() => setOpenDialog(null)} icon={'material-symbols:close'} />
        </DialogTitle>

        <DialogContent sx={{ minWidth: '300px' }}>
          <EditDepartmentItemForm
            loading={loading}
            setLoading={setLoading}
            id={item?.id}
            setOpenDialog={setOpenDialog}
            defaultName={item?.name}
          />
        </DialogContent>
      </Dialog>
    </DragDropContext>
  )
}

Lids.displayName = 'Lids'
export default Lids
