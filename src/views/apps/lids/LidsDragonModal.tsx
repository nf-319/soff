import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Select,
  Skeleton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import {
  Bell,
  ChartPie,
  Clock,
  Info,
  MessageSquare,
  Phone,
  PlusIcon,
  ThermometerSnowflake,
  User,
  UserIcon
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { EmptyContent } from '@components/empty-content'
import IconifyIcon from '../../../components/icon'
import api from 'src/@core/utils/api'
import { formatDate } from 'src/@core/utils/format'
import AddNoteAnonimUser from './anonimUser/AddNoteAnonimUser'
import { useTranslation } from 'react-i18next'
import SendSmsAnonimUserForm from './anonimUser/SendSmsAnonimUserForm'
import { useAppDispatch, useAppSelector } from 'src/store'
import { Add, HelpOutline, QuestionAnswerOutlined } from '@mui/icons-material'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useSettings } from 'src/@core/hooks/useSettings'
import AddToGroupForm from './anonimUser/AddToGroupForm'
import { fetchGroupChecklist } from 'src/store/apps/groups'
import { usePatch } from '@/hooks/useApi'
import { useRouter } from 'next/router'
import { AccessDeniedModal } from '@components/AccessDeniedModal'
import MenuItem from '@mui/material/MenuItem'
import { useAuth } from '@hooks/useAuth'
import { states, temperateOptions } from '@/pages/reports/lid-statements/leads-list'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { getFormatPhone } from '@/shared/utils'
import { PhoneLink } from '@components/PhoneLink'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { lidStatusOption } from '@/shared/constans/lid-statements'

interface LidsDragonModalProps {
  openModal: boolean
  handleClose: (status: boolean) => void
  selectedLead: {
    created_at: string
    first_name: string
    id: number
    temperature: string | null
    last_activity?: string
    phone: string
  }
}

type InfoItemProps = {
  icon: React.ReactNode
  label: string
  value: string
  canEdit?: boolean
  onValueChange?: (newValue: string) => void
  option?: any
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, canEdit = false, onValueChange, option }) => {
  const { settings } = useSettings()
  const [currentValue, setCurrentValue] = useState<string>(value)
  const { user } = useAuth()
  const permissions = ['admin', 'ceo']
  const hasEditPermission = permissions?.includes(user?.currentRole as string) || false
  const isEditable = canEdit && hasEditPermission

  const handleStateChange = (newState: string) => {
    setCurrentValue(newState)
    if (onValueChange) {
      onValueChange(newState)
    }
  }

  useEffect(() => {
    setCurrentValue(value)
  }, [value, label, canEdit])

  const filteredOptions = (() => {
    if (label !== 'Holat') return option

    if (value === 'new') {
      return option
    }

    return option?.filter((o: any) => o.value !== 'new')
  })()

  const GETSTATUS = {
    'enrolled': "Sotuv bo'ldi",
    'test_period': 'Sinov darsida'
  }


  return label === 'Telefon raqami' ? (
    <PhoneLink phone={value} style={{ textDecoration: 'none', height: '100%' }}>
      <div
        className={`d-flex align-items-center p-3 ${
          settings.mode == 'dark' ? 'bg-#282A42' : 'bg-light'
        } rounded-3 shadow-sm hover:bg-secondary transition-all duration-200`}
        style={{ cursor: 'pointer', border: '1px solid #e0e0e0', height: '100%' }}
      >
        <div className='text-primary me-3'>{icon}</div>
        <div>
          <p className={`mb-1 ${settings.mode == 'dark' ? 'text-ligt' : 'text-muted'}`}>{label}</p>
          <p className={`mb-0 font-weight-bold ${settings.mode == 'dark' ? 'text-ligt' : 'text-dark'}`}>
            {getFormatPhone(value ?? '')}
          </p>
        </div>
      </div>
    </PhoneLink>
  ) : (
    <div
      className='d-flex align-items-center p-3 bg-light rounded-3 shadow-sm hover:bg-secondary transition-all duration-200'
      style={{ cursor: 'pointer', border: '1px solid #e0e0e0', height: '100%' }}
    >
      <div className='text-primary me-3'>{icon}</div>
      <div style={{ flex: 1 }}>
        <p className='mb-1'>{label}</p>
        <div className='mb-0 font-weight-bold text-dark'>
          {currentValue === "test_period" || currentValue === "enrolled" ? <p>{GETSTATUS[currentValue]}</p> : isEditable ? (
            <FormControl fullWidth>
              <Select
                size='small'
                fullWidth
                value={currentValue}
                displayEmpty
                onChange={e => handleStateChange(e.target.value as string)}
              >
                {filteredOptions?.map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <p>{currentValue}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default InfoItem

export function LidsDragonModal({ selectedLead: initialLead, openModal, handleClose }: LidsDragonModalProps) {
  const { query } = useRouter()
  const [value, setValue] = useState<'lead-user-description' | 'anonim-user' | 'sms-history' | 'history'>(
    query.is_amocrm ? 'lead-user-description' : 'anonim-user'
  )
  const [leadDetail, setLeadDetail] = useState<any>(null)
  const { sms_list } = useAppSelector(state => state.settings)
  const { groupChecklist } = useAppSelector(state => state.groups)
  const { companyInfo } = useAppSelector(state => state.user)
  const [smsModal, setSmsModalOpen] = useState(false)
  const [accessModal, setAccessModal] = useState<boolean>(false)
  const [addGroupModal, setAddGroupModal] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const { settings } = useSettings()
  const { isMobile } = useResponsive()
  const [nodeModal, setNodeModal] = useState(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [selectedLead, setSelectedLead] = useState<any>(initialLead)
  const { mutate } = usePatch()
  const queryClient = useQueryClient()

  useEffect(() => {
    setSelectedLead(initialLead)
  }, [initialLead])

  const handleGetUserDetails = async (value: string, id: number) => {
    setDetailLoading(true)
    try {
      await api
        .get(`leads/${value}/${initialLead?.id}/`)
        .then(res => {
          setLeadDetail(res.data)
        })
        .catch(err => {
          console.error(err)
        })
      setDetailLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetAmoUserDetails = async (value: string, id: number) => {
    setDetailLoading(true)
    try {
      await api
        .get(`amocrm/lead/notes/${initialLead?.id}/`)
        .then(res => {
          setLeadDetail(res.data)
        })
        .catch(err => {
          console.log(err)
        })
      setDetailLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const lidTemperature = async (temperature: string) => {
    try {
      const requestPrams = { temperature }
      const allQueries = queryClient.getQueryCache().findAll()
      const matchedQuery = allQueries.find(q =>
        Array.isArray(q.queryKey) &&
        q.queryKey[0] === 'leads/departments/leads/' &&
        q.queryKey[1] === 'departments-leads' &&
        q.queryKey[2] === true &&
        typeof q.queryKey[3] === 'number'
      )

      if (!matchedQuery) {
        toast.error("Mos keladigan query topilmadi")
        return
      }

      const key = matchedQuery.queryKey as [string, string, boolean, number]

      queryClient.setQueryData(key, (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.results)) return oldData

        return {
          ...oldData,
          results: oldData.results.map((department: any) => {
            if (!Array.isArray(department.leads)) return department

            return {
              ...department,
              leads: department.leads.map((lead: any) =>
                lead.id === selectedLead?.id ? { ...lead, temperature } : lead
              )
            }
          })
        }
      })

      mutate(`leads/anonim-user/update/${selectedLead?.id}/`, requestPrams)
      setSelectedLead((prev: any) => ({
        ...prev,
        temperature: temperature
      }))
      toast.success("Muvofiqiyatli o'zgardi")
    } catch (error: any) {
      console.error(error)
      toast.error(error.msg || "Nimadur xatolik, iltimos CRM bilan bo'glaning")
    }
  }


  const lidStatus = async (status: string) => {
    try {
      const requestPrams = { status }

      const allQueries = queryClient.getQueryCache().findAll()
      const matchedQuery = allQueries.find(q =>
        Array.isArray(q.queryKey) &&
        q.queryKey[0] === 'leads/departments/leads/' &&
        q.queryKey[1] === 'departments-leads' &&
        q.queryKey[2] === true &&
        typeof q.queryKey[3] === 'number'
      )

      if (!matchedQuery) {
        toast.error("Mos keladigan query topilmadi")
        return
      }

      const key = matchedQuery.queryKey as [string, string, boolean, number]

      queryClient.setQueryData(key, (oldData: any) => {
        if (!oldData || !Array.isArray(oldData.results)) return oldData

        return {
          ...oldData,
          results: oldData.results.map((department: any) => {
            if (!Array.isArray(department.leads)) return department

            return {
              ...department,
              leads: department.leads.map((lead: any) =>
                lead.id === selectedLead?.id ? { ...lead, status } : lead
              ),
            }
          }),
        }
      })

      mutate(`leads/anonim-user/update/${selectedLead?.id}/`, requestPrams, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['leads/sales-funnel/', 'leads/sales-funnel'] })
          queryClient.invalidateQueries({ queryKey: [QueryKeys.ReportLeadsList] })

          setSelectedLead((prev: any) => ({ ...prev, status }))
        },
      })

      toast.success("Muvofiqiyatli o'zgardi")
    } catch (error: any) {
      console.error(error)
      toast.error(error.msg || "Nimadur xatolik, iltimos CRM bilan bo'glaning")
    }
  }

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: 'lead-user-description' | 'anonim-user' | 'sms-history'
  ) => {
    if (query.is_amocrm) {
      void handleGetAmoUserDetails(newValue, selectedLead?.id)
    } else {
      void handleGetUserDetails(newValue, selectedLead?.id)
    }
    setValue(newValue)
  }

  const handleModalsOpen = () => {
    if (companyInfo.access) {
      setSmsModalOpen(true)
    } else {
      setAccessModal(true)
    }
  }

  useEffect(() => {
    if (openModal) {
      dispatch(fetchGroupChecklist(''))
      if (query.is_amocrm) {
        void handleGetAmoUserDetails(value, selectedLead?.id)
      } else {
        void handleGetUserDetails(value, selectedLead?.id)
      }
    }
  }, [selectedLead?.id, openModal])

  const newState = { value: null, label: '----' }

  return (
    <Dialog
      fullWidth
      open={openModal}
      onClose={() => {
        handleClose(false)
        setValue(query.is_amocrm ? 'lead-user-description' : 'anonim-user')
      }}
    >
      <DialogTitle>
        <Typography variant='h5'>O'quvchi malumotlari</Typography>
      </DialogTitle>

      <DialogContent>
        <Box width='100%' display='flex' flexDirection='column' alignItems={'center'} justifyContent='center'>
          <div
            className='d-flex  justify-content-center align-items-center rounded-circle bg-gradient text-white'
            style={{
              width: '6rem',
              height: '6rem',
              background: '#666CFF',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {selectedLead?.first_name[0].toLocaleUpperCase()}
          </div>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h6'>{selectedLead?.first_name}</Typography>
          </Box>
        </Box>
        <div className='row g-4 mt-2'>
          <div className='col-6'>
            <InfoItem icon={<Clock />} label='Yaratilgan sanasi' value={formatDate(selectedLead?.created_at)} />
          </div>

          <div className='col-6'>
            <InfoItem icon={<Phone />} label='Telefon raqami' value={selectedLead?.phone} />
          </div>

          <div className='col-6'>
            <InfoItem
              icon={<ThermometerSnowflake />}
              label='Harorat'
              value={selectedLead?.temperature}
              canEdit={true}
              option={[newState, ...temperateOptions.slice(1, 4)]}
              onValueChange={newValue => lidTemperature(newValue)}
            />
          </div>

          <div className='col-6'>
            <InfoItem
              icon={<ChartPie />}
              label='Holat'
              value={selectedLead?.status || 'new'}
              canEdit={true}
              option={lidStatusOption}
              onValueChange={newValue => lidStatus(newValue)}
            />
          </div>

          <div className='col-12'>
            <Button onClick={() => setAddGroupModal(true)} variant='contained' fullWidth startIcon={<Add />}>
              Guruhga qo'shish
            </Button>
          </div>
        </div>
        <Box sx={{ width: '100%', marginTop: 2 }}>
          {query.is_amocrm ? (
            <Tabs
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons={isMobile ? 'auto' : false}
              value={value}
              onChange={handleChange}
              aria-label='user tabs'
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexDirection: isMobile ? 'column' : 'row'
                }
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Bell style={{ marginRight: 5 }} width={16} height={16} />
                    Eslatmalar
                  </Box>
                }
                value='lead-user-description'
              />
            </Tabs>
          ) : (
            <Tabs
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons={isMobile ? 'auto' : false}
              value={value}
              onChange={handleChange}
              aria-label='user tabs'
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexDirection: isMobile ? 'column' : 'row'
                }
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Info style={{ marginRight: 5 }} width={16} height={16} />
                    Ma'lumotlar
                  </Box>
                }
                value='anonim-user'
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Bell style={{ marginRight: 5 }} width={16} height={16} />
                    Eslatmalar
                  </Box>
                }
                value='lead-user-description'
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MessageSquare style={{ marginRight: 5 }} width={16} height={16} />
                    Sms tarixi
                  </Box>
                }
                value='sms-history'
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <User style={{ marginRight: 2 }} size={15} />
                    Lead tarix
                  </Box>
                }
                value='history'
              />
            </Tabs>
          )}

          <Box
            sx={{
              padding: 2,
              backgroundColor: settings.mode == 'dark' ? '#282A42' : '#f8f9fa',
              borderRadius: 1,
              marginTop: 2
            }}
          >
            {value === 'anonim-user' && (
              <div>
                {detailLoading ? (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                  </Box>
                ) : leadDetail?.length == 0 ? (
                  <EmptyContent />
                ) : (
                  leadDetail?.map((item: any) => (
                    <Box
                      className='shadow-sm p-3'
                      display='flex'
                      flexDirection='column'
                      gap={2}
                      sx={{ background: 'white', borderRadius: 1 }}
                      margin={4}
                      padding={3}
                    >
                      <Box display='flex' alignItems='center'>
                        <div className='text-primary me-3'>{<HelpOutline />}</div>
                        <Typography>{item?.application_form}</Typography>
                      </Box>
                      <Box display='flex' alignItems='center'>
                        <div className='text-primary me-3'>{<QuestionAnswerOutlined />}</div>
                        <Typography>{item?.answer}</Typography>
                        <FormGroup>
                          {item?.variants?.map((variant: any) => (
                            <FormControlLabel
                              key={variant.id}
                              control={<Checkbox checked={variant.is_checked} />}
                              label={variant.value}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    </Box>
                  ))
                )}
              </div>
            )}

            {value === 'lead-user-description' && (
              <div>
                {detailLoading ? (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                  </Box>
                ) : !leadDetail?.length ? (
                  <>
                    <EmptyContent />
                    <Box margin={4}>
                      <Button
                        variant='contained'
                        onClick={() => setNodeModal(true)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                        startIcon={<PlusIcon />}
                      >
                        Yangi Eslatma
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box margin={4}>
                      <Button
                        variant='contained'
                        onClick={() => setNodeModal(true)}
                        fullWidth
                        sx={{ marginTop: 2 }}
                        startIcon={<PlusIcon />}
                      >
                        Yangi Eslatma
                      </Button>
                    </Box>
                    {leadDetail?.map((item: any) => (
                      <Box
                        className='shadow-sm p-3'
                        display='flex'
                        flexDirection='column'
                        gap={2}
                        sx={{ background: settings.mode == 'dark' ? '#282A42' : 'white', borderRadius: 1 }}
                        margin={4}
                        padding={3}
                      >
                        <Box display='flex' alignItems='center' justifyContent='space-between'>
                          {item?.admin && (
                            <Box display='flex' alignItems='center'>
                              <div className='text-primary me-3'>{<User />}</div>
                              <Typography>{item?.admin}</Typography>
                            </Box>
                          )}
                          {item?.created_at && (
                            <Box display='flex' alignItems='center'>
                              <div className='text-primary me-3'>{<Clock />}</div>
                              <Typography>{item?.created_at}</Typography>
                            </Box>
                          )}
                        </Box>
                        {item?.text && (
                          <Box display='flex' alignItems='center'>
                            <div className='text-primary me-3'>{<Bell />}</div>
                            <Typography>{item?.text}</Typography>
                          </Box>
                        )}
                        {item?.body && (
                          <Box display='flex' alignItems='center'>
                            <div className='text-primary me-3'>{<Bell />}</div>
                            <Typography>{item?.body}</Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </>
                )}
              </div>
            )}

            {value === 'sms-history' && (
              <div>
                {detailLoading ? (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                  </Box>
                ) : !leadDetail.length ? (
                  <>
                    <EmptyContent />
                    <Box margin={4}>
                      <Button
                        variant='contained'
                        onClick={handleModalsOpen}
                        fullWidth
                        sx={{ marginTop: 2 }}
                        startIcon={<PlusIcon />}
                      >
                        Yangi Sms
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box margin={4}>
                      <Button
                        variant='contained'
                        onClick={handleModalsOpen}
                        fullWidth
                        sx={{ marginTop: 2 }}
                        startIcon={<PlusIcon />}
                      >
                        Yangi Sms
                      </Button>
                    </Box>
                    {leadDetail?.map((item: any) => (
                      <Box
                        className='shadow-sm p-3'
                        display='flex'
                        flexDirection='column'
                        gap={2}
                        sx={{ background: 'white', borderRadius: 1 }}
                        margin={4}
                        padding={3}
                      >
                        <Box display='flex' alignItems='center'>
                          <div className='text-primary me-3'>{<MessageSquare />}</div>
                          <Typography fontSize={15}>{item?.message}</Typography>
                        </Box>
                        <Box display='flex' alignItems='center'>
                          <div className='text-primary me-3'>{<Clock />}</div>
                          <Typography fontSize={15}>{item?.created_at}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </div>
            )}
            {value === 'history' && (
              <div>
                {detailLoading ? (
                  <Box display='flex' flexDirection='column' gap={2}>
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                    <Skeleton variant='rounded' sx={{ margin: 2 }} height={70} />
                  </Box>
                ) : !leadDetail.length ? (
                  <EmptyContent />
                ) : (
                  <>
                    {leadDetail?.map((item: any) => (
                      <Box
                        className='shadow-sm p-3'
                        display='flex'
                        flexDirection='column'
                        gap={2}
                        sx={{ background: 'white', borderRadius: 1 }}
                        margin={4}
                        padding={3}
                      >
                        <Box display='flex' alignItems='center'>
                          <div className='text-primary me-3'>{<UserIcon />}</div>
                          <Typography fontSize={15}>{item?.admin}</Typography>
                        </Box>
                        <Box display='flex' alignItems='center'>
                          <div className='text-primary me-3'>{<MessageSquare />}</div>
                          <Typography fontSize={15}>
                            {item?.new_status == 'new' ? (
                              <Chip label='Yangi' color='default' />
                            ) : item?.new_status == 'connected' ? (
                              <Chip label="Bog'lanildi" color='info' />
                            ) : item?.new_status == 'not_connected' ? (
                              <Chip label="Bog'lana olmadi" color='warning' />
                            ) : item?.new_status == 'test_period' ? (
                              <Chip label='Sinov darsida' color='primary' />
                            ) : item?.new_status == 'enrolled' ? (
                              <Chip label='Sotuv' color='success' />
                            ) : (
                              <Chip label="Yo'qotilgan" color='error' />
                            )}
                          </Typography>
                        </Box>
                        <Box display='flex' alignItems='center'>
                          <div className='text-primary me-3'>{<Clock />}</div>
                          <Typography fontSize={15}>{item?.created_at}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </div>
            )}
          </Box>
        </Box>
      </DialogContent>
      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />
      <Dialog open={nodeModal} onClose={() => setNodeModal(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('Yangi eslatma')}</Typography>
          <IconifyIcon onClick={() => setNodeModal(false)} icon={'material-symbols:close'} />
        </DialogTitle>
        <DialogContent sx={{ minWidth: '300px' }}>
          <AddNoteAnonimUser
            user={selectedLead?.id}
            closeModal={async () => (
              setNodeModal(false), await handleGetUserDetails('lead-user-description', selectedLead?.id)
            )}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={smsModal} onClose={() => setSmsModalOpen(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{t('SMS yuborish')}</Typography>
          <IconifyIcon onClick={() => setSmsModalOpen(false)} icon={'material-symbols:close'} />
        </DialogTitle>

        <DialogContent sx={{ minWidth: '300px' }}>
          <SendSmsAnonimUserForm
            smsTemps={sms_list.result}
            smsLoading={false}
            open={smsModal}
            user={selectedLead?.id}
            closeModal={() => setSmsModalOpen(false)}
            reRender={() => handleGetUserDetails('sms-history', selectedLead?.id)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={addGroupModal} onClose={() => setAddGroupModal(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{t("Guruhga qo'shish")}</Typography>
          <IconifyIcon icon={'material-symbols:close'} onClick={() => setAddGroupModal(false)} />
        </DialogTitle>
        <DialogContent>
          <AddToGroupForm
            setOpenParent={handleClose}
            open={addGroupModal}
            setOpen={setAddGroupModal}
            item={selectedLead}
            groups={groupChecklist || []}
          />
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
