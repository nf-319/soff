'use client'

import { Close, Delete, PersonAddAlt } from '@mui/icons-material'
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState, useEffect, FC } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { EmptyContent } from '../../components/empty-content'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useGet, usePatch } from 'src/hooks/useApi'
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
import Link from 'next/link'
import { LeadKanbanItem } from './LeadKanbanItem'
import { SendSMSModal } from '@/views/apps/students/view/UserViewLeft'

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

export const LeadsKanban: FC<Props> = ({ defaultId }) => {
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
  const { id, search, is_active } = router.query
  const { mutate, isPending } = usePatch()
  const [sectionLeads, setSectionLeads] = useState<any[]>([])
  const [openSmsModal, setOpenSmsModal] = useState<string | null>(null)
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
    params: apiParams,
    deps: ['departments-leads']
  })

  const [localLeadData, setLocalLeadData] = useState<LeadsType<LeadsResult[]> | null>(null)

  useEffect(() => {
    if (leadData) {
      setLocalLeadData(leadData)
    }
  }, [leadData])

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

  if (isLoading) {
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='section-list' direction={isMobile ? 'vertical' : 'horizontal'} type='SECTION'>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='kanban'
            style={{
              display: 'flex',
              overflow: 'auto',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'start',
              height: '100%',
              gap: 20
            }}
          >
            {displayData?.results?.length ? (
              displayData.results.map((section, sectionIndex) => (
                <Draggable key={section.id} draggableId={`section-${section.id}`} index={sectionIndex}>
                  {(sectionProvided, sectionSnapshot) => (
                    <div
                      ref={sectionProvided.innerRef}
                      {...sectionProvided.draggableProps}
                      style={{
                        ...sectionProvided.draggableProps.style,
                        opacity: sectionSnapshot.isDragging ? 0.8 : 1
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

                                <Chip color='primary' variant='outlined' label={section.leads.length} />
                              </div>

                              <Box display={'flex'}>
                                <IconButton
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    setOpenSmsModal('sms'), setSectionLeads(section?.leads)
                                  }}
                                >
                                  <IconifyIcon fontSize={20} icon='material-symbols:sms-rounded' color='orange' />
                                </IconButton>
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
                              style={{ marginBottom: 10, maxHeight: '50vh', paddingRight: 10, overflow: 'auto' }}
                              className='kanban__section__content'
                            >
                              {section.leads && section.leads.length > 0 ? (
                                section.leads.map((lead: any, index: number) => (
                                  <Draggable key={lead?.id} draggableId={String(lead?.id)} index={index}>
                                    {(provided, snapshot) => (
                                      <LeadKanbanItem lead={lead} provided={provided} snapshot={snapshot} />
                                    )}
                                  </Draggable>
                                ))
                              ) : (
                                <Box sx={{ p: 2, textAlign: 'center' }}>
                                  <Typography variant='body2' color='text.secondary'>
                                    Bo'sh
                                  </Typography>
                                </Box>
                              )}
                              {leadsProvided.placeholder}
                            </div>

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
          setOpenSmsModal(null), setSectionLeads([])
        }}
        openEdit={openSmsModal}
        // smsTemps={smsTemps}
        setOpenEdit={setOpenSmsModal}
        // usersData={studentIds}
      />
    </DragDropContext>
  )
}

LeadsKanban.displayName = 'LeadsKanban'
