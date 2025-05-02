import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import { Bell, Clock, Info, MessageSquare, Phone, PlusIcon, User, UserIcon } from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { EmptyContent } from '@components/empty-content'
import IconifyIcon from '../../../components/icon'
import api from 'src/@core/utils/api'
import { formatDate } from 'src/@core/utils/format'
import AddNoteAnonimUser from './anonimUser/AddNoteAnonimUser'
import { useTranslation } from 'react-i18next'
import { setOpen } from 'src/store/apps/leads'
import SendSmsAnonimUserForm from './anonimUser/SendSmsAnonimUserForm'
import { useAppDispatch, useAppSelector } from 'src/store'
import { Add, HelpOutline, QuestionAnswer, QuestionAnswerOutlined } from '@mui/icons-material'
import useResponsive from 'src/@core/hooks/useResponsive'
import { useSettings } from 'src/@core/hooks/useSettings'
import AddToGroupForm from './anonimUser/AddToGroupForm'
import { fetchGroupChecklist } from 'src/store/apps/groups'
import Link from 'next/link'
import { useGet } from '@/hooks/useApi'

interface LidsDragonModalProps {
  openModal: boolean
  handleClose: (status: boolean) => void
  selectedLead: {
    created_at: string
    first_name: string
    id: number
    last_activity?: string
    phone: string
  }
}

type InfoItemProps = {
  icon: React.ReactNode
  label: string
  value: string
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => {
  const { settings } = useSettings()
  return label === 'Telefon raqami' ? (
    <Link href={`tel:${value}`} style={{ textDecoration:'none' }}>
      <div
        style={{ cursor: 'pointer' }}
        className={`d-flex align-items-center p-3 ${
          settings.mode == 'dark' ? 'bg-#282A42' : 'bg-light'
        } rounded-3 shadow-sm hover:bg-secondary transition-all duration-200`}
      >
        <div className='text-primary me-3'>{icon}</div>
        <div>
          <p className={`mb-1 ${settings.mode == 'dark' ? 'text-ligt' : 'text-muted'}`}>{label}</p>
          <p className={`mb-0 font-weight-bold ${settings.mode == 'dark' ? 'text-ligt' : 'text-dark'}`}>{value}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div
      style={{ cursor: 'pointer' }}
      className={`d-flex align-items-center p-3 ${
        settings.mode == 'dark' ? 'bg-#282A42' : 'bg-light'
      } rounded-3 shadow-sm hover:bg-secondary transition-all duration-200`}
    >
      <div className='text-primary me-3'>{icon}</div>
      <div>
        <p className={`mb-1 ${settings.mode == 'dark' ? 'text-ligt' : 'text-muted'}`}>{label}</p>
        <p className={`mb-0 font-weight-bold ${settings.mode == 'dark' ? 'text-ligt' : 'text-dark'}`}>{value}</p>
      </div>
    </div>
  )
}

export default InfoItem

export function LidsDragonModal({ selectedLead, openModal, handleClose }: LidsDragonModalProps) {
  const [value, setValue] = useState<'lead-user-description' | 'anonim-user' | 'sms-history' | 'history'>('anonim-user')
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
  const handleGetUserDetails = async (value: string, id: number) => {
    setDetailLoading(true)
    try {
      await api
        .get(`leads/${value}/${selectedLead?.id}/`)
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

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: 'lead-user-description' | 'anonim-user' | 'sms-history'
  ) => {
    handleGetUserDetails(newValue, selectedLead?.id)
    setValue(newValue)
  }

  const handleModalsOpen = () => {
    if(companyInfo.access) {
      setSmsModalOpen(true)
    } else {
      setAccessModal(true)
    }
  }

  useEffect(() => {
    if (openModal) {
      dispatch(fetchGroupChecklist(''))
      handleGetUserDetails(value, selectedLead?.id)
    }
  }, [selectedLead?.id])

  return (
    <Dialog
      fullWidth
      open={openModal}
      onClose={() => {
        handleClose(false);
        setValue('anonim-user')
      }}
    >
      <DialogTitle>
        <Typography variant='h5'>O'quvchi ma'lumotlari</Typography>
      </DialogTitle>

      <DialogContent>
        <Box width='100%' display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <div
            className='d-flex  justify-content-center align-items-center rounded-circle bg-gradient text-white'
            style={{
              width: '6rem',
              height: '6rem',
              background: '#007bff',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {selectedLead?.first_name[0].toLocaleUpperCase()}
          </div>
        </Box>
        <div className='row g-4 mt-2'>
          <div className='col-6 '>
            <InfoItem icon={<User />} label='Ism' value={`${selectedLead?.first_name}`} />
          </div>

          <div className='col-6'>
            <InfoItem icon={<Clock />} label='Yaratilgan sanasi' value={formatDate(selectedLead?.created_at)} />
          </div>

          <div className='col-12'>
            <InfoItem icon={<Phone />} label='Telefon raqami' value={selectedLead?.phone} />
          </div>
          <div className='col-12'>
            <Button onClick={() => setAddGroupModal(true)} variant='contained' fullWidth startIcon={<Add />}>
              Guruhga qo'shish
            </Button>
          </div>
        </div>
        <Box sx={{ width: '100%', marginTop: 2 }}>
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
                          <Box display='flex' alignItems='center'>
                            <div className='text-primary me-3'>{<User />}</div>
                            <Typography>{item?.admin}</Typography>
                          </Box>
                          <Box display='flex' alignItems='center'>
                            <div className='text-primary me-3'>{<Clock />}</div>
                            <Typography>{item?.created_at}</Typography>
                          </Box>
                        </Box>
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
                              <Chip label="Sotuv" color='success' />
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
