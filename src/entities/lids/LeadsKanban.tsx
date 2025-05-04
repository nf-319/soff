'use client'

import { Close, Delete, PersonAddAlt } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Tooltip,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import { useState, useEffect, FC } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import MessageIcon from '@mui/icons-material/Message';
import { useSelector } from 'react-redux'
import { EmptyContent } from '@components/empty-content'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useGet, usePatch, usePost } from 'src/hooks/useApi'
import { RootState, useAppDispatch, useAppSelector } from 'src/store'
import { setAddSource, setOpenLid, setSectionId } from 'src/store/apps/leads'
import CreateAnonimUserForm from 'src/views/apps/lids/anonimUser/CreateAnonimUserForm'
import { LeadsType } from './model'
import IconifyIcon from '../../components/icon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from 'src/@core/utils/api'
import EditDepartmentItemForm from 'src/views/apps/lids/departmentItem/EditDepartmentItemForm'
import { EditAnonimDialogDialog } from 'src/views/apps/lids/anonimUser/EditAnonimUserDialog'
import toast from 'react-hot-toast'
import UserSuspendDialog from 'src/views/apps/mentors/view/UserSuspendDialog'
import { LeadKanbanItem } from './LeadKanbanItem'
import { SendSMSModal } from '@/views/apps/students/view/UserViewLeft'
import { AccessDeniedModal } from '@components/AccessDeniedModal'
import { MessageSquare } from 'lucide-react'

type LeadsChild = {
  id: number
  first_name: string
  phone: string
}

export type LeadsResult = {
  id: number
  name: string
  leads: LeadsChild[]
}

type Props = {
  defaultId: number | undefined
  selectedData?: any
}

export type MenuOpenType =
  | 'note'
  | 'sms'
  | 'merge-to-amo'
  | 'merge-to'
  | 'add-group'
  | 'branch'
  | 'edit'
  | 'delete'
  | 'recover'
  | null

export const LeadsKanban: FC<Props> = ({ defaultId, selectedData }) => {
  const { isMobile } = useResponsive()
  const { settings } = useSettings()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { openLid } = useSelector((state: RootState) => state.leads)
  const [source, setSource] = useState<any>(null)
  const [edit, setEdit] = useState<any>()
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [deleteItem, setDeleteItem] = useState<any | null>(null)
  const { id, search, is_active, is_amocrm } = router.query
  const { mutate, isPending } = usePatch()
  const { mutate: updateDepartmentMutation } = usePost()
  const [sectionLeads, setSectionLeads] = useState<any[]>([])
  const [accessModal, setAccessModal] = useState<boolean>(false)
  const [openSmsModal, setOpenSmsModal] = useState<string | null>(null)

  const { companyInfo } = useAppSelector(item => item.user)

  const [mergedSteps, setMergedSteps] = useState<any[] | null>(null)
  const { data: amoLeadDataChild, isLoading: amoLeadDataChildLoding } = useGet(
    `amocrm/leads/?pipeline_id=${defaultId}`,
    { options: { enabled: !!router.query.is_amocrm } }
  )

  useEffect(() => {
    const mergedSteps = selectedData?.steps.map((step: any) => {
      const matchingLeads = amoLeadDataChild?.filter((lead: any) => lead.status_id === step.id)

      const transformedLeads = matchingLeads?.map((lead: any) => ({
        ...lead,
        first_name: lead.name,
        name: undefined
      }))

      return {
        ...step,
        leads: transformedLeads
      }
    })
    if (mergedSteps) {
      setMergedSteps(mergedSteps)
    }
  }, [selectedData, amoLeadDataChild])

  const handleSubmit = (data: any) => {
    updateDepartmentMutation(
      'leads/departments/bulk-ordering/',
      { departments: data },
      {
        onSuccess: response => {
          console.log('Success:', response)
        },
        onError: error => {
          console.error('Error:', error)
        }
      }
    )
  }
  const apiParams = {
    is_active: is_active ?? true
  }

  if (id || defaultId) {
    // @ts-ignore
    apiParams.parent = id || defaultId
  }

  if (search && search !== 'undefined') {
    // @ts-ignore
    apiParams.search = search
  }

  const {
    data: leadData,
    isLoading,
    refetch
  } = useGet<LeadsType<LeadsResult[]>>('leads/departments/leads/', {
    options: { enabled: !router.query.is_amocrm },
    params: apiParams,
    deps: ['departments-leads']
  })

  const [localLeadData, setLocalLeadData] = useState<LeadsType<LeadsResult[]> | null>(null)
  const [localAmoLeadData, setLocalAmoLeadData] = useState<any | null>(null)

  useEffect(() => {
    if (leadData) {
      setLocalLeadData(leadData)
    }
  }, [leadData])

  useEffect(() => {
    setLocalAmoLeadData(null)
  }, [selectedData])

  const updateLeadMutation = useMutation({
    mutationFn: (data: { leadId: number; departmentId: number }) => {
      return api.patch(`leads/anonim-user/update/${data.leadId}/`, {
        department: data.departmentId
      })
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/'] })
    }
  })
  const updateAmoLeadMutation = useMutation({
    mutationFn: (data: { leadId: number; departmentId: number }) => {
      return api.patch(`amocrm/lead/update/${data.leadId}/`, {
        status_id: data.departmentId
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['amocrm/pipelines/?with_steps=true'] })
      void queryClient.invalidateQueries({ queryKey: [`amocrm/leads/?pipeline_id=${defaultId}`] })
    },
    onError: () => {
      toast.error("Bu bo'limga lidni otkazib bo'lmadi")
      setLocalAmoLeadData(mergedSteps)
    }
  })

  const updateDepartmentOrderMutation = useMutation({
    mutationFn: (data: { departmentId: number; order: number }) => {
      return api.patch(`leads/department-update/${data.departmentId}`, {
        order: data.order
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/'] })
    }
  })

  const handleDelete = async () => {
    if (!deleteItem?.id) return

    mutate(
      `leads/department-update/${deleteItem?.id}`,
      { is_active: false },
      {
        onSuccess: () => {
          setDeleteItem(null)
          toast.success("Bo'lim o'chirildi")
          queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/'] })
        },
        onError: (err: any) => {
          toast.error(err.response?.data || 'Xatolik yuz berdi')
        }
      }
    )
  }

  const closeCreateLid = () => {
    dispatch(setOpenLid(null))
    dispatch(setAddSource(false))
    dispatch(setSectionId(null))
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination || !localLeadData) return

    const { source, destination, type } = result

    if (type === 'SECTION') {
      const newResults = Array.from(localLeadData.results)
      const [movedSection] = newResults.splice(source.index, 1)
      newResults.splice(destination.index, 0, movedSection)
      const newResultsOrdered = newResults.map((item, index) => ({
        obj_id: item?.id,
        order: index
      }))
      if (newResultsOrdered) {
        handleSubmit(newResultsOrdered)
      }
      setLocalLeadData({
        ...localLeadData,
        results: newResults
      })

      updateDepartmentOrderMutation.mutate({
        departmentId: movedSection.id,
        order: destination.index
      })

      return
    }

    const sourceColIndex = localLeadData.results.findIndex(e => String(e.id) === source.droppableId)
    const destinationColIndex = localLeadData.results.findIndex(e => String(e.id) === destination.droppableId)

    if (sourceColIndex === -1 || destinationColIndex === -1) return

    const sourceCol = localLeadData.results[sourceColIndex]
    const destinationCol = localLeadData.results[destinationColIndex]

    if (!sourceCol || !destinationCol) return

    const newResults = JSON.parse(JSON.stringify(localLeadData.results))

    if (sourceColIndex === destinationColIndex) {
      const updatedLeads = [...newResults[sourceColIndex].leads]
      const [movedLead] = updatedLeads.splice(source.index, 1)
      updatedLeads.splice(destination.index, 0, movedLead)

      newResults[sourceColIndex].leads = updatedLeads
    } else {
      const sourceLeads = [...newResults[sourceColIndex].leads]
      const destinationLeads = [...newResults[destinationColIndex].leads]

      const [movedLead] = sourceLeads.splice(source.index, 1)

      destinationLeads.splice(destination.index, 0, movedLead)

      newResults[sourceColIndex].leads = sourceLeads
      newResults[destinationColIndex].leads = destinationLeads

      updateLeadMutation.mutate({
        leadId: movedLead.id,
        departmentId: destinationCol.id
      })
    }

    setLocalLeadData({
      ...localLeadData,
      results: newResults
    })
  }
  const leadIds = sectionLeads?.map(item => item.id)

  const onDragEndAmo = async (result: any) => {
    if (!result.destination || !mergedSteps) return

    const { source, destination, type } = result

    if (type === 'SECTION') {
      const newResults = Array.from(mergedSteps)
      const [movedSection] = newResults.splice(source.index, 1)
      newResults.splice(destination.index, 0, movedSection)

      updateDepartmentOrderMutation.mutate({
        departmentId: movedSection.id,
        order: destination.index
      })

      return
    }

    const sourceColIndex = mergedSteps.findIndex(e => String(e.id) === source.droppableId)
    const destinationColIndex = mergedSteps.findIndex(e => String(e.id) === destination.droppableId)

    if (sourceColIndex === -1 || destinationColIndex === -1) return

    const sourceCol = mergedSteps[sourceColIndex]
    const destinationCol = mergedSteps[destinationColIndex]

    if (!sourceCol || !destinationCol) return

    const newResults = JSON.parse(JSON.stringify(mergedSteps))

    if (sourceColIndex === destinationColIndex) {
      const updatedLeads = [...newResults[sourceColIndex].leads]
      const [movedLead] = updatedLeads.splice(source.index, 1)
      updatedLeads.splice(destination.index, 0, movedLead)

      newResults[sourceColIndex].leads = updatedLeads
    } else {
      const sourceLeads = [...newResults[sourceColIndex].leads]
      const destinationLeads = [...newResults[destinationColIndex].leads]

      const [movedLead] = sourceLeads.splice(source.index, 1)

      destinationLeads.splice(destination.index, 0, movedLead)

      newResults[sourceColIndex].leads = sourceLeads
      newResults[destinationColIndex].leads = destinationLeads

      updateAmoLeadMutation.mutate({
        leadId: movedLead?.id,
        departmentId: destinationCol?.id
      })
    }

    setLocalAmoLeadData(newResults)
  }

  if (isLoading || amoLeadDataChildLoding) {
    return (
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
    )
  }

  const displayData = localLeadData || leadData
  const amoLeadData = localAmoLeadData || mergedSteps

  const handleAccessModal = (section: any) => {
    if (companyInfo?.access){
      setOpenSmsModal('sms');
      setSectionLeads(section?.leads)
    } else {
      setAccessModal(true)
    }
  }


  return (
    <DragDropContext onDragEnd={is_amocrm ? onDragEndAmo : onDragEnd}>
      <Droppable droppableId='section-list' direction='horizontal' type='SECTION'>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='kanban'
            style={{
              display: 'flex',
              overflow: 'auto',
              flexDirection: 'row',
              alignItems: 'start',
              height: '100%',
              gap: 20
            }}
          >
            {(!is_amocrm && displayData?.results.length) || (is_amocrm && amoLeadData?.length) ? (
              (is_amocrm ? amoLeadData : displayData?.results)?.map((section: any, sectionIndex: any) => (
                <Draggable key={section.id} draggableId={`section-${section.id}`} index={sectionIndex}>
                  {(sectionProvided, sectionSnapshot) => (
                    <div
                      ref={sectionProvided.innerRef}
                      {...sectionProvided.draggableProps}
                      style={{
                        ...sectionProvided.draggableProps.style,
                        opacity: sectionSnapshot.isDragging ? 0.8 : 1,
                        border: '1px solid #e0e0e0e0',
                        borderRadius: 10
                      }}
                    >
                      <Droppable key={section.id} droppableId={String(section.id)} type='LEAD'>
                        {leadsProvided => (
                          <div
                            {...leadsProvided.droppableProps}
                            className='kanban__section'
                            ref={leadsProvided.innerRef}
                            style={{
                              width: isMobile ? '100%' : 'auto',
                              minWidth: 350,
                              padding: 20,
                              background: settings.mode == 'dark' ? '#282A42' : 'white',
                              borderRadius: 10
                            }}
                          >
                            <Box
                              display='flex'
                              alignItems='center'
                              justifyContent='space-between'
                              {...sectionProvided.dragHandleProps}
                              sx={{ cursor: 'grab' }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  background: settings.mode == 'dark' ? '#282A42' : 'white',
                                  borderRadius: 10,
                                  minWidth: 240,
                                  fontSize: 25
                                }}
                              >
                                {section.name}

                                <Chip color='primary' variant='outlined' label={section?.leads?.length} />
                              </div>

                              <Box display={'flex'}>
                                <Tooltip title={`${section.name}dagi barcha lidlarga SMS yuborish`}>
                                  <IconButton sx={{ cursor: 'pointer' }} onClick={() => handleAccessModal(section)}>
                                    <MessageIcon sx={{ fontSize: 20, color: 'orange' }}  />
                                  </IconButton>
                                </Tooltip>

                                <IconButton
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setOpen(true)
                                    setEdit(section)
                                  }}
                                >
                                  <IconifyIcon icon='fluent:text-bullet-list-square-edit-20-filled' color='orange' />
                                </IconButton>

                                <IconButton
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setDeleteItem(section)
                                  }}
                                >
                                  <Delete color='error' />
                                </IconButton>
                              </Box>
                            </Box>

                            <div
                              style={{
                                marginBottom: 10,
                                marginTop: 10,
                                maxHeight: '50vh',
                                paddingRight: 10,
                                overflow: 'auto'
                              }}
                              className='kanban__section__content'
                            >
                              {section.leads && section.leads.length > 0 ? (
                                section.leads.map((lead: any, index: number) => (
                                  <Draggable key={lead?.id} draggableId={String(lead?.id)} index={index}>
                                    {(provided, snapshot) => (
                                      <LeadKanbanItem
                                        defaultId={defaultId}
                                        lead={lead}
                                        provided={provided}
                                        snapshot={snapshot}
                                      />
                                    )}
                                  </Draggable>
                                ))
                              ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                  <Typography variant='body2' color='text.secondary'>
                                    Bo'sh kanban
                                  </Typography>
                                </Box>
                              )}
                              {leadsProvided.placeholder}
                            </div>

                            {!is_amocrm && (
                              <Box>
                                <Button
                                  size='medium'
                                  fullWidth
                                  onClick={() => {
                                    setSource(section?.id)
                                    dispatch(setOpenLid('createAnonim'))
                                  }}
                                  variant='outlined'
                                  startIcon={<PersonAddAlt />}
                                >
                                  {t("Yangi lid qo'shish")}
                                </Button>
                              </Box>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <EmptyContent />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <EditAnonimDialogDialog department={id} open={open} lead={edit} setOpen={setOpen} />

      <Dialog
        onClose={closeCreateLid}
        open={openLid !== null}
        maxWidth='xs'
        fullWidth
        PaperProps={{
          sx: {
            width: '100%',
            minHeight: 400,
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' component='span'>
            {t('Yangi Lid')}
          </Typography>

          <IconButton aria-label='close' onClick={closeCreateLid}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            overflowY: 'visible',
            px: 3,
            pb: 3
          }}
        >
          <CreateAnonimUserForm defaultId={String(defaultId)} source={source} />
        </DialogContent>
      </Dialog>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('Tahrirlash')}</Typography>
          <IconifyIcon onClick={() => setOpen(false)} icon={'material-symbols:close'} />
        </DialogTitle>

        <DialogContent sx={{ minWidth: '300px' }}>
          <EditDepartmentItemForm
            loading={loading}
            setLoading={setLoading}
            id={edit?.id}
            refetch={refetch}
            setOpenDialog={setOpen}
            defaultName={edit?.name}
          />
        </DialogContent>
      </Dialog>

      <UserSuspendDialog
        loading={isPending}
        open={Boolean(deleteItem)}
        setOpen={setDeleteItem}
        handleOk={handleDelete}
      />
      <SendSMSModal
        for_lead={true}
        usersData={leadIds}
        handleEditClose={() => {
          setOpenSmsModal(null)
          setSectionLeads([])
        }}
        openEdit={openSmsModal}
        // smsTemps={smsTemps}
        setOpenEdit={setOpenSmsModal}
        // usersData={studentIds}
      />

      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />
    </DragDropContext>
  )
}

LeadsKanban.displayName = 'LeadsKanban'
