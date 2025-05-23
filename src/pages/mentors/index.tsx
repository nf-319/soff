'use client'

import { Box, Button, Chip, FormControlLabel, Pagination, Switch, Tooltip, Typography } from '@mui/material'
import { ChangeEvent, ReactNode, useContext, useEffect, useState } from 'react'
import IconifyIcon from '../../components/icon'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/store'
import { updateParams, setOpenEdit, setOpenSms, setTeacherData } from 'src/store/apps/mentors'
import { formatCurrency } from 'src/@core/utils/format-currency'
import VideoHeader, { videoUrls } from '../../components/video-header/video-header'
import useResponsive from 'src/@core/hooks/useResponsive'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import useSMS from 'src/hooks/useSMS'
import { ModalTypes, SendSMSModal } from 'src/views/apps/students/view/UserViewLeft'
import { fetchSmsList } from 'src/store/apps/settings'
import RowOptions from 'src/views/apps/mentors/RowOptions'
import TeacherCreateDialog from 'src/views/apps/mentors/TeacherCreateDialog'
import { useGet } from 'src/hooks/useApi'
import ceoConfigs from 'src/configs/ceo'
import { useQueryClient } from '@tanstack/react-query'

import { TeacherAvatar } from 'src/views/apps/mentors/AddMentorsModal'
import TeacherEditDialog from 'src/views/apps/mentors/TeacherEditDialog'
import DataTable from '../../components/table'
import { AccessDeniedModal } from '@/components/AccessDeniedModal'

export type customTableProps = {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: string) => any | undefined
}

export default function GroupsPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { smsTemps, getSMSTemps } = useSMS()
  const { queryParams, openSms } = useAppSelector(state => state.mentors)

  const [accessModal, setAccessModal] = useState<boolean>(false)
  const { companyInfo } = useAppSelector(item => item.user)
  const { data: teachers } = useGet(`${ceoConfigs.employee_checklist}?role=teacher`)

  const studentIds = teachers?.map((student: any) => student.id)

  const handleEditClickOpen = (value: ModalTypes) => {
    dispatch(setOpenSms(value))
  }

  const { data, isLoading } = useGet(ceoConfigs.teachers, { params: queryParams, deps: ['mentors'] })

  const handleEditClose = () => {
    dispatch(setOpenSms(null))
  }

  const handleModalOpen = () => {
    if (!companyInfo.access) {
      void getSMSTemps()
      handleEditClickOpen('sms')
    } else {
      setAccessModal(true)
    }
  }

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: [ceoConfigs.teachers, 'mentors'] })
  }, [user?.active_branch])

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index'
    },
    {
      xs: 0.4,
      title: t('Rasm'),
      dataIndex: 'image',
      render: actions => (
        <TeacherAvatar skin='light' color={'info'} variant='rounded' sx={{ width: 33, height: 33 }}>
          {actions ? (
            <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={actions} alt='user' />
          ) : (
            <IconifyIcon icon={'et:profile-male'} />
          )}
        </TeacherAvatar>
      )
    },
    {
      xs: 1.7,
      title: t('first_name'),
      dataIndex: 'first_name'
    },
    {
      xs: 1.7,
      title: t('phone'),
      dataIndex: 'phone'
    },
    {
      xs: 1.7,
      title: t('Doimiy oylik'),
      dataIndex: 'amount',
      render: amount => (!isNaN(Number(amount)) ? `${formatCurrency(amount)} UZS` : '*****')
    },
    {
      xs: 1.7,
      title: t('Foiz ulush (%)'),
      dataIndex: 'percentage',
      render: per => `${per} %`
    },
    {
      xs: 1.7,
      title: 'Dars haqi',
      dataIndex: 'lesson_amount',
      render: per => `${per} so'm`
    },
    {
      xs: 1.7,
      title: t('birth_date'),
      dataIndex: 'birth_date'
    },
    {
      xs: 1.7,
      title: t('Ishga olingan sana'),
      dataIndex: 'activated_at'
    },
    {
      xs: 0.9,
      dataIndex: 'id',
      title: '',
      render: actions => <RowOptions id={actions} status={queryParams?.status} />
    }
  ]

  const rowClick = (id: any) => {
    void router.push({
      pathname: '/mentors/[id]',
      query: { id },
    })
  }

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('admin') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      router.push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }

    return () => {
      dispatch(setOpenEdit(null))
      dispatch(updateParams({ page: 1 }))
    }
  }, [])

  const handlePagination = async (page: number) => {
    dispatch(updateParams({ page }))
  }

  const handleChangeStatus = async (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch(updateParams({ status: checked ? 'archive' : 'active', page: 1 }))
  }

  useEffect(() => {
    dispatch(fetchSmsList())
  }, [])

  return (
    <div>
      <Box
        className='groups-page-header'
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: isMobile ? 'start' : 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}
        py={2}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '5px' : '10px'
          }}
        >
          <Typography variant={isMobile ? 'h6' : 'h5'}>{t('Mentorlar')}</Typography>
          <Chip label={`${data?.count || 0}`} variant='outlined' color='primary' size='medium' />
          <FormControlLabel
            control={<Switch onChange={handleChangeStatus} />}
            checked={queryParams.status == 'archive'}
            label={
              <Tooltip title={t('Arxivlangan o‘qituvchilar ro‘yxati.')}>
                <span>{t('Arxiv')}</span>
              </Tooltip>
            }
            sx={{ marginLeft: isMobile ? '0' : '10px' }}
          />
        </Box>
        <Box
          sx={{
            width: isMobile ? '100%' : 'auto',
            display: 'flex',
            gap: isMobile ? '10px' : '20px',
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <Button
            onClick={handleModalOpen}
            variant='outlined'
            color='warning'
            fullWidth={isMobile}
            startIcon={<IconifyIcon icon='material-symbols-light:sms-outline' />}
          >
            <Tooltip title={t('Ro‘yxatdagi o‘qituvchilarga SMS yuborish.')}>
              <span>{t('Sms yuborish')}</span>
            </Tooltip>
          </Button>
          <Button
            onClick={() => dispatch(setOpenEdit('create'))}
            variant='contained'
            fullWidth={isMobile}
            startIcon={<IconifyIcon icon='ic:baseline-plus' />}
          >
            <Tooltip title={t('Yangi o‘qituvchi qo‘shish.')}>
              <span>{t("Yangi qo'shish")}</span>
            </Tooltip>
          </Button>
        </Box>
      </Box>
      <DataTable loading={isLoading} columns={columns} data={data?.results} rowClick={rowClick} />
      {Math.ceil(data?.count / 10) > 1 && !isLoading && (
        <Pagination
          defaultPage={Number(queryParams.page)}
          count={Math.ceil(data?.count / 10)}
          variant='outlined'
          shape='rounded'
          onChange={(e: any, page) => handlePagination(page)}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2
          }}
        />
      )}
      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />

      <TeacherCreateDialog />
      <TeacherEditDialog />
      <SendSMSModal
        handleEditClose={handleEditClose}
        openEdit={openSms}
        smsTemps={smsTemps}
        teacherData={teachers}
        setOpenEdit={setOpenSms}
        usersData={studentIds}
      />
    </div>
  )
}
