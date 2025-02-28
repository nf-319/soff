'use client'

import { Close, PersonAddAlt } from '@mui/icons-material'
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Typography } from '@mui/material'
import { EyeIcon, Phone, User } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState, useEffect, FC } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { EmptyContent } from 'src/@core/components/empty-content'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useGet } from 'src/hooks/useApi'
import { RootState, useAppDispatch } from 'src/store'
import { setAddSource, setOpenLid, setSectionId } from 'src/store/apps/leads'
import CreateAnonimUserForm from 'src/views/apps/lids/anonimUser/CreateAnonimUserForm'
import { LidsDragonModal } from 'src/views/apps/lids/LidsDragonModal'
import { LeadsType } from './model'
import IconifyIcon from 'src/@core/components/icon'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from 'src/@core/utils/api'

type LeadsChld = {
  id: number
  first_name: string
  phone: string
}

type LeadsResult = {
  id: number
  name: string
  leads: LeadsChld[]
}

type Props = {
  defaultId: number | undefined
}

export const LeadsKaban: FC<Props> = ({ defaultId }) => {
  const { isMobile } = useResponsive()
  const { settings } = useSettings()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [studentModalOpen, setStudentModalOpen] = useState<boolean>(false)
  const { openLid } = useSelector((state: RootState) => state.leads)
  const [selectedLead, setSelectedLead] = useState<any | null>(null)
  const [source, setSource] = useState<any>(null)
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { id, search } = router.query

  const { data: leadData, isLoading } = useGet<LeadsType<LeadsResult[]>>('leads/departments/leads/', {
    params: { parent: id || defaultId, search }
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
      queryClient.invalidateQueries({ queryKey: ['leads/departments/leads/'] })
    }
  })

  const handleMenuOpen = (event: any, lead: any) => {
    setStudentModalOpen(true)
    setSelectedLead(lead)
  }

  const handleClose = () => {
    setStudentModalOpen(false)
  }

  const closeCreateLid = () => {
    dispatch(setOpenLid(null))
    dispatch(setAddSource(false))
    dispatch(setSectionId(null))
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination || !localLeadData) return

    const { source, destination } = result

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

  if (isLoading)
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

  const displayData = localLeadData || leadData

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className='kanban'
        style={{
          display: 'flex',
          overflow: 'auto',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'start',
          height: 'calc(100vh - 360px)',
          gap: 20
        }}
      >
        {displayData?.results?.length ? (
          displayData.results.map(section => (
            <Droppable key={section?.id} droppableId={String(section?.id)}>
              {provided => (
                <div
                  {...provided.droppableProps}
                  className='kanban__section'
                  ref={provided.innerRef}
                  style={{
                    width: isMobile ? '100%' : 'auto',
                    minWidth: 350,
                    padding: 20,
                    background: settings.mode == 'dark' ? '#282A42' : 'white',
                    borderRadius: 10
                  }}
                >
                  <Box display='flex' alignItems='center' justifyContent='space-between' gap={4}>
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

                    <IconButton sx={{ cursor: 'pointer' }}>
                      <IconifyIcon icon='fluent:text-bullet-list-square-edit-20-filled' color='orange' />
                    </IconButton>
                  </Box>

                  <div
                    style={{ marginBottom: 10, maxHeight: '50vh', paddingRight: 10, overflow: 'auto' }}
                    className='kanban__section__content'
                  >
                    {section.leads && section.leads.length > 0 ? (
                      section.leads.map((lead: any, index: number) => (
                        <Draggable key={lead?.id} draggableId={String(lead?.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={`shadow-sm p-3 ${settings.mode == 'dark' ? 'bg-#282A42' : 'bg-light'} rounded`}
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
                      ))
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant='body2' color='text.secondary'>
                          Bo'sh
                        </Typography>
                      </Box>
                    )}
                    {provided.placeholder}
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

        <Dialog onClose={closeCreateLid} open={openLid !== null}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='h6' component='span'>
              {t('Yangi Lid')}
            </Typography>
            <IconButton aria-label='close' onClick={closeCreateLid}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ minWidth: '320px' }}>
            <CreateAnonimUserForm source={source} />
          </DialogContent>
        </Dialog>

        <LidsDragonModal handleClose={handleClose} openModal={studentModalOpen} selectedLead={selectedLead} />
      </div>
    </DragDropContext>
  )
}

LeadsKaban.displayName = 'LeadsKaban'
