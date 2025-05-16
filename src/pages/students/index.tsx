import {
  Box,
  Button,
  Chip,
  MenuItem,
  Pagination,
  Select,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material'
import { ReactNode, useContext, useEffect, useState } from 'react'
import DataTable from '../../components/table'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import StudentsFilter from 'src/views/apps/students/StudentsFilter'
import CreateStudentModal from 'src/views/apps/students/CreateStudentModal'
import EditStudentModal from 'src/views/apps/students/EditStudentModal'
import StudentRowOptions from 'src/views/apps/students/StudentRowOptions'
import { useAppDispatch, useAppSelector } from 'src/store'
import { setStudentId, updateStudentParams } from 'src/store/apps/students'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { setOpenEdit } from 'src/store/apps/students'
import { AuthContext } from 'src/context/AuthContext'
import { toast } from 'react-hot-toast'
import useResponsive from 'src/@core/hooks/useResponsive'
import IconifyIcon from '../../components/icon'
import ExcelStudents from '../../components/excelButton/ExcelStudents'
import { TeacherAvatar } from 'src/views/apps/mentors/AddMentorsModal'
import { useGet } from 'src/hooks/useApi'
import { useQueryClient } from '@tanstack/react-query'
import { AccessDeniedModal } from '@components/AccessDeniedModal'
import { fetchSmsList } from '@store/apps/settings'
import { ModalTypes, SendSMSModal } from '@/views/apps/students/view/UserViewLeft'
import { Archive, ArchiveRestore, MessageSquareText } from 'lucide-react'
import useSMS from '@hooks/useSMS'
import Divider from '@mui/material/Divider'

export type customTableProps = {
  xs: number
  title: string
  dataIndex?: string | ReactNode
  render?: (source: any) => any | undefined
}

export default function StudentsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile } = useResponsive()
  const { user } = useContext(AuthContext)
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const { queryParams, openEdit } = useAppSelector(state => state.students)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const querySearch = new URLSearchParams(window.location.search).get('q')
  const { search, ...filteredParams } = queryParams
  const [openModalEdit, setOpenModalEdit] = useState<ModalTypes | null>(null)
  const { smsTemps, getSMSTemps } = useSMS()
  const [accessModal, setAccessModal] = useState<boolean>(false)
  const { companyInfo } = useAppSelector(item => item.user)

  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries({ ...filteredParams, ...(querySearch ? { search: querySearch } : { search: '' }) })
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    )
  ).toString()

  const { data, isLoading } = useGet('student/new-list/', {
    deps: ['students-list'],
    params: { ...filteredParams, ...(querySearch ? { search: querySearch } : {}) } as Record<string, unknown>
  })

  const columns: customTableProps[] = [
    {
      xs: 0.2,
      title: t('ID'),
      dataIndex: 'index',
      render: index => `${Number(queryParams?.offset || 0) + Number(index)}`
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
      xs: 1.4,
      title: t('first_name'),
      dataIndex: 'first_name'
    },
    {
      xs: 1.1,
      title: t('Baho'),
      dataIndex: 'gpa',
      render: gpa => {
        return gpa ? (
          <Chip
            sx={{
              color: Number(gpa) >= 4 ? 'green' : Number(gpa) >= 3 ? 'orange' : 'red',
              borderColor: Number(gpa) >= 4 ? 'green' : Number(gpa) >= 3 ? 'orange' : 'red'
            }}
            variant='outlined'
            color='info'
            label={gpa}
          />
        ) : (
          "Bahosi yo'q"
        )
      }
    },
    {
      xs: 1.1,
      title: t('phone'),
      dataIndex: 'phone'
    },
    {
      xs: 1.5,
      title: t('Guruhlar'),
      dataIndex: 'student_status',
      render: (
        group: {
          id: number
          group: number
          status: string
          group_name: string
          lesson_time: string
          teacher_name: string
        }[]
      ) =>
        group.length > 0 ? (
          group.map((item, i) => (
            <Box fontSize={12} key={i} sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              {`${item.lesson_time} - ${item.group_name} - ${item.teacher_name}`}
              <Chip
                label={t(item.status)}
                size='small'
                variant='outlined'
                color={
                  item.status === 'active'
                    ? 'success'
                    : item.status === 'archive'
                      ? 'error'
                      : item.status === 'frozen'
                        ? 'secondary'
                        : 'warning'
                }
              />
            </Box>
          ))
        ) : (
          <Chip label='Guruhsiz' color='warning' variant='outlined' size='small' sx={{ fontWeight: 700 }} />
        )
    },
    {
      xs: 0.7,
      title: t('Balans'),
      dataIndex: 'balance',
      render: (balance: string) =>
        Number(balance) < 0 ? (
          <Chip
            label={`${formatCurrency(+balance)} so'm`}
            color='error'
            variant='outlined'
            size='small'
            sx={{ fontWeight: 700 }}
          />
        ) : (
          <Chip
            label={`${formatCurrency(+balance)} so'm`}
            color='success'
            variant='outlined'
            size='small'
            sx={{ fontWeight: 700 }}
          />
        )
    },
    {
      xs: 0.8,
      dataIndex: 'id',
      title: t('Harakatlar'),
      render: actions => <StudentRowOptions id={actions} />
    }
  ]

  const handleRowsPerPageChange = async (value: number) => {
    setRowsPerPage(value)

    dispatch(updateStudentParams({ limit: value, offset: 0 }))
  }

  const handlePagination = async (page: string | number) => {
    const adjustedPage: any = (Number(page) - 1) * rowsPerPage
    dispatch(updateStudentParams({ offset: adjustedPage }))
  }

  const rowClick = (id: any) => {
    dispatch(setStudentId(id))
    void router.push(`/students/view/security?student=${id}`)
  }

  useEffect(() => {
    const initialize = async () => {
      if (!user?.role.includes('ceo') && !user?.role.includes('admin') && !user?.role.includes('watcher')) {
        void router.push('/')
        toast.error("Sizda bu sahifaga kirish huquqi yo'q!")
        return
      }
    }

    void initialize()

    return () => {
      dispatch(setOpenEdit(null))
      dispatch(updateStudentParams({ limit: '10', offset: '0', course: '', teacher: '', group: '' }))
    }
  }, [])

  const handleEditClickOpen = (value: ModalTypes) => {
    setOpenModalEdit(value)
    setOpenEdit(value)
  }

  const handleEditClose = () => {
    setOpenModalEdit(null)
    setOpenEdit(null)
  }

  const handleModalOpen = () => {
    if (companyInfo.access) {
      void getSMSTemps()
      handleEditClickOpen('sms')
    } else {
      setAccessModal(true)
    }
  }

  const handleSwitch = (value: 'archive' | 'active') => {
    dispatch(updateStudentParams({ group_status: '', status: value, offset: 0 }))
  }

  useEffect(() => {
    if (openEdit === 'create') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [openEdit])

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: ['student/new-list/', 'students-list'] })
  }, [user?.active_branch])

  return (
    <Box display='flex' flexDirection='column' gap={3}>
      <Box
        className='students-page-header'
        sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            alignItems: 'center',
            justifyContent: { xs: 'space-between', md: 'start' },
            gap: { xs: 2, md: 3 }
          }}
        >
          <Typography variant='h5'>{t("O'quvchilar")}</Typography>

          {isMobile && (
            <Button
              onClick={() => dispatch(setOpenEdit('create'))}
              variant='contained'
              startIcon={<IconifyIcon icon='ic:baseline-plus' />}
            >
              <Tooltip title={t('Yangi o‘quvchi qo‘shish.')}>
                <span>{t("Yangi qo'shish")}</span>
              </Tooltip>
            </Button>
          )}

          <Box
            display='flex'
            alignItems='center'
            gap={3}
            justifyContent={{ xs: 'space-between', md: 'start' }}
            width='100%'
          >
            <Chip label={`O'quvchilar soni: ${data?.count || 0} ta`} variant='outlined' color='primary' />
            <Chip
              label={
                `${queryParams.is_overpaid ? "Ortiqcha to'lov : +" : 'Qazdorlik :'} ${
                  formatCurrency(data?.total_debts) || 0
                }` + " so'm"
              }
              variant='outlined'
              color={queryParams.is_overpaid ? 'success' : 'error'}
            />
          </Box>
        </Box>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box>
              <ExcelStudents
                size='medium'
                tooltip={t('Ko‘rinib turgan jadvalni Excel faylga yuklab olish.')}
                url='student/offset-list/'
                queryString={queryString}
              />
            </Box>
            <Button
              onClick={handleModalOpen}
              variant='outlined'
              color='warning'
              startIcon={<MessageSquareText size={18} />}
            >
              <Tooltip title={t('Ro‘yxatdagi o‘quvchilarga SMS yuborish.')}>
                <span>{t('Sms yuborish')}</span>
              </Tooltip>
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip
                title={
                  queryParams.status === 'archive' ? t('Faol leadlarni ko‘rish.') : t('Arxivdagi leadlarni ko‘rish.')
                }
                arrow
              >
                <Button
                  variant={queryParams.status === 'archive' ? 'contained' : 'outlined'}
                  startIcon={queryParams.status === 'archive' ? <Archive size={16} /> : <ArchiveRestore size={16} />}
                  onClick={() => handleSwitch(queryParams.status === 'archive' ? 'active' : 'archive')}
                  size='medium'
                  sx={{
                    textTransform: 'none',
                    minWidth: 100,
                    justifyContent: 'flex-start'
                  }}
                >
                  {queryParams.status === 'archive' ? t('Arxiv') : t('Faol')}
                </Button>
              </Tooltip>
            </Box>
            <Button
              onClick={() => dispatch(setOpenEdit('create'))}
              variant='contained'
              startIcon={<IconifyIcon icon='ic:baseline-plus' />}
            >
              <Tooltip title={t('Yangi o‘quvchi qo‘shish.')}>
                <span>{t("Yangi qo'shish")}</span>
              </Tooltip>
            </Button>
          </Box>
        )}
      </Box>

      {isMobile && (
        <>
          <Box display='flex' gap={3}>
            <Button sx={{ width: '100%' }} variant='outlined' onClick={() => setOpen(true)}>
              {t('Filterlash')}
            </Button>

            <ExcelStudents size='small' url='student/offset-list/' queryString={queryString} />
          </Box>
          <Box hidden={!isMobile} display='flex' alignItems='center' justifyContent='end' gap={3}>
            <Box width={'100%'}>
              <Tooltip
                title={
                  queryParams.status === 'archive' ? t('Faol leadlarni ko‘rish.') : t('Arxivdagi leadlarni ko‘rish.')
                }
                arrow
              >
                <Button
                  fullWidth
                  variant={queryParams.status === 'archive' ? 'contained' : 'outlined'}
                  startIcon={queryParams.status === 'archive' ? <Archive size={16} /> : <ArchiveRestore size={16} />}
                  onClick={() => handleSwitch(queryParams.status === 'archive' ? 'active' : 'archive')}
                  size='medium'
                  sx={{
                    textTransform: 'none'
                  }}
                >
                  {queryParams.status === 'archive' ? t('Arxiv') : t('Faol')}
                </Button>
              </Tooltip>
            </Box>

            <Button
              fullWidth
              onClick={handleModalOpen}
              variant='outlined'
              color='warning'
              startIcon={<MessageSquareText size={18} />}
            >
              <Tooltip title={t('Ro‘yxatdagi o‘quvchilarga SMS yuborish.')}>
                <span>{t('Sms yuborish')}</span>
              </Tooltip>
            </Button>
          </Box>
        </>
      )}

      <Divider />

      {!isMobile && <StudentsFilter />}

      <DataTable
        color
        loading={isLoading}
        columns={columns}
        data={
          Array.isArray(data?.results)
            ? data.results.map((el: any) => ({
              ...el,
              color:
                Number(el.balance) < 0
                  ? 'rgba(227, 18, 18, 0.1)'
                  : el.payment_status <= 5 && el.payment_status
                    ? 'rgba(237, 156, 64, 0.22)'
                    : ''
            }))
            : []
        }
        rowClick={rowClick}
      />

      {data?.count > 10 && !isLoading && (
        <div className='d-flex'>
          <Pagination
            page={Number(queryParams.offset) ? Number(queryParams.offset) / rowsPerPage + 1 : 1}
            count={Math.ceil(data?.count / rowsPerPage)}
            variant='outlined'
            shape='rounded'
            onChange={(e: any, page) => handlePagination(page)}
          />
          <Select
            size='small'
            onChange={e => handleRowsPerPageChange(Number(e.target.value))}
            value={rowsPerPage}
            className='page-resize'
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </div>
      )}

      <CreateStudentModal />
      <EditStudentModal />

      <Dialog fullScreen onClose={() => setOpen(false)} aria-labelledby='full-screen-dialog-title' open={open}>
        <DialogTitle id='full-screen-dialog-title'>
          <Typography variant='h6' component='span'>
            {t('Modal title')}
          </Typography>
          <IconButton
            aria-label='close'
            onClick={() => setOpen(false)}
            sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
          >
            <IconifyIcon icon='mdi:close' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <StudentsFilter />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={() => setOpen(false)}>{t('Davom etish')}</Button>
        </DialogActions>
      </Dialog>

      <AccessDeniedModal open={accessModal} onClose={() => setAccessModal(false)} />

      <Box sx={{ display: { xs: 'none', sm: 'block' } }} onClick={() => dispatch(fetchSmsList())}>
        <SendSMSModal
          handleEditClose={handleEditClose}
          openEdit={openModalEdit}
          smsTemps={smsTemps}
          setOpenEdit={setOpenModalEdit}
          usersData={data?.results?.map((item: any) => item.id)}
        />
      </Box>
    </Box>
  )
}
