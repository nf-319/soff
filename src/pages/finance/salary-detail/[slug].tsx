import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, Dialog, DialogContent, IconButton, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext, InferGetStaticPropsType } from 'next/types'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { formatAmount, revereAmount } from '../../../components/amount-input'
import IconifyIcon from '../../../components/icon'
import DataTable, { customTableDataProps } from '../../../components/table'
import api from 'src/@core/utils/api'
import { formatCurrency } from 'src/@core/utils/format-currency'
import { AuthContext } from 'src/context/AuthContext'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchCalculatedSalary,
  fetchModerationSalaries,
  updateSalaryBonus,
  updateSalaryFine
} from 'src/store/apps/finance'
import TeacherGroupsModal from 'src/views/apps/finance/TeacherGroupsModal'
import { VscodeIconsFileTypeExcel2 } from '@components/excelButton/ExcelIcon'
import { useQuery } from '@tanstack/react-query'
import { Ellipsis, UserCheck } from 'lucide-react'

const UserView = ({ slug }: InferGetStaticPropsType<typeof getServerSideProps>) => {
  const { moderation_salaries, isGettingCalculatedSalary, isPending, is_update } = useAppSelector(
    state => state.finance
  )
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [loading, setLoading] = useState<'frozen' | 'approved' | null>(null)
  const { back, push } = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [id, setId] = useState<number | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null)
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const handleGetSalary = async (teacherId: number) => {
    setId(teacherId)
    await dispatch(fetchCalculatedSalary({ id: teacherId, queryParams: `date=${slug}` }))
  }

  const handleOpenConfirmModal = (employee: any) => {
    setSelectedEmployee(employee)
    setConfirmModalOpen(true)
  }

  const withdrawCol: customTableDataProps[] = [
    {
      xs: 0.03,
      title: '#',
      dataIndex: 'index'
    },
    {
      xs: 0.16,
      title: t('first_name'),
      dataIndex: 'employee_data',
      render: (employee_data: any) => employee_data.name
    },
    {
      xs: 0.16,
      title: t("O'zgarmas oylik"),
      dataIndex: 'fixed_salary',
      render: (fixed_salary: string) => `${formatCurrency(+fixed_salary)} so'm`
    },
    {
      xs: 0.08,
      title: t('Foiz ulush (%)'),
      dataIndex: 'kpi',
      render: kpi => `${+kpi} %`
    },
    {
      xs: 0.14,
      title: t("Foiz ulush (so'm)"),
      dataIndex: 'kpi_salary',
      render: kpi_salary => `${formatCurrency(kpi_salary)} so'm`
    },
    {
      xs: 0.14,
      title: t('Ish haqqi'),
      dataIndex: 'salary',
      render: salary => `${formatCurrency(salary)} so'm`
    },
    {
      xs: 0.14,
      title: t('Avanslar'),
      dataIndex: 'prepayment',
      render: prepayment => `${formatCurrency(prepayment)} so'm`
    },
    {
      xs: 0.13,
      title: `${t('Jarimalar soni')}`,
      dataIndex: 'fines_count',
      render: fines_count => `${fines_count || 0} ta`
    },
    {
      xs: 0.13,
      title: `${t('Bonuslar')} (so'm)`,
      dataIndex: 'bonus_amount',
      renderId: (id, bonus_amount) => (
        <input
          className='salary-table__input'
          disabled={!is_update}
          style={{ width: '80px', zIndex: 999 }}
          type='string'
          value={formatAmount(String(bonus_amount))}
          onChange={e => (
            e.stopPropagation(),
              dispatch(
                updateSalaryBonus({
                  id,
                  bonus_amount: revereAmount(e.target.value) || 0
                })
              )
          )}
        />
      )
    },
    {
      xs: 0.13,
      title: `${t('Jarimalar')} (so'm)`,
      dataIndex: 'fine_amount',
      renderId: (id, fine_amount) => (
        <input
          className='salary-table__input'
          disabled={!is_update}
          style={{ width: '80px' }}
          type='string'
          value={formatAmount(String(fine_amount))}
          onChange={e => (
            e.stopPropagation(),
              dispatch(
                updateSalaryFine({
                  id,
                  fine_amount: revereAmount(e.target.value) || 0
                })
              )
          )}
        />
      )
    },
    {
      xs: 0.18,
      title: t('Yakuniy ish haqqi'),
      dataIndex: 'final_salary',
      render: final_salary => `${formatCurrency(final_salary)} so'm`
    },
    {
      xs: 0.15,
      title: 'Harakatlar',
      dataIndex: 'employee_data',
      render: (source: any) => {
        const teacherID = source.id
        const record = moderation_salaries.find(item => item.employee_data.id === teacherID)
        return (
          <Box display='flex' gap={3}>
            <IconButton
              size='small'
              onClick={() => handleGetSalary(teacherID)}
            >
              <Ellipsis size={20} />
            </IconButton>

            {is_update && (
              <IconButton
                size='small'
                onClick={() => handleOpenConfirmModal(record)}
              >
                <UserCheck size={20} />
              </IconButton>
            )}
          </Box>
        )
      }
    }
  ]

  useEffect(() => {
    if (
      !user?.role.includes('ceo') &&
      !user?.role.includes('casher') &&
      !user?.role.includes('watcher') &&
      !user?.role.includes('marketolog')
    ) {
      router.push('/')
      toast.error('Sahifaga kirish huquqingiz yoq!')
    }
    dispatch(fetchModerationSalaries(`date=${slug}`))
  }, [])

  const confirmSalary = async (status: 'frozen' | 'approved') => {
    setLoading(status)
    const update_data = moderation_salaries.map(el => ({ ...el, status }))
    try {
      await api.patch(`finance/employee-salaries/update/`, { update_data })
      toast.success("Ma'lumotlar saqlandi")
      void push('/finance')
    } catch (err) {
      console.log(err)
    }
    setLoading(null)
  }

  const confirmSingleSalary = async () => {
    if (!selectedEmployee) return
    setLoading('approved')
    try {
      await api.patch(`finance/employee-salaries/update/`, {
        update_data: [{ ...selectedEmployee, status: 'approved' }]
      })
      toast.success("O'qituvchi ma'lumotlari tasdiqlandi")
      dispatch(fetchModerationSalaries(`date=${slug}`))
      setConfirmModalOpen(false)
      setSelectedEmployee(null)
    } catch (err) {
      console.log(err)
      toast.error("Xatolik yuz berdi")
    }
    setLoading(null)
  }

  const fetchMonthlyReport = async () => {
    const { data } = await api.get<{ file_url: string }>(`finance/employee-salaries/?date=${slug}&is_export=true`)
    return data.file_url
  }

  const { refetch } = useQuery({
    queryKey: ['monthlyReport'],
    queryFn: fetchMonthlyReport,
    enabled: false
  })

  const handleDownload = async () => {
    const { data } = await refetch()
    if (data) {
      const link = document.createElement('a')
      link.href = data
      link.target = '_blank'
      link.download = 'monthly-report.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexGrow: 1, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: '10px', flexGrow: 1, alignItems: 'center' }}>
          <IconButton color='primary'>
            <IconifyIcon icon={'ep:back'} style={{ cursor: 'pointer' }} onClick={back} />
          </IconButton>
          {is_update ? (
            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t('Oylik ishlash')}</Typography>
          ) : (
            <Typography sx={{ fontSize: '20px', flexGrow: 1 }}>{t("To'langan oyliklar hisoboti")}</Typography>
          )}
        </Box>

        <Button
          startIcon={<VscodeIconsFileTypeExcel2 />}
          variant='outlined'
          color='success'
          onClick={handleDownload}
          size={'medium'}
        >
          Excel
        </Button>
      </Box>

      <DataTable
        loading={isPending}
        maxWidth='100%'
        minWidth='800px'
        columns={withdrawCol}
        data={moderation_salaries}
      />
      {is_update && !isPending && (
        <LoadingButton
          loading={loading === 'frozen'}
          sx={{ marginTop: '15px', marginRight: '20px' }}
          size='small'
          variant='contained'
          color='secondary'
          onClick={() => confirmSalary('frozen')}
        >
          {t('Vaqtincha saqlash')}
        </LoadingButton>
      )}
      {is_update && !isPending && (
        <LoadingButton
          loading={loading === 'approved'}
          sx={{ marginTop: '15px' }}
          size='small'
          variant='contained'
          onClick={() => setOpen(true)}
        >
          {t('Saqlash')}
        </LoadingButton>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '350px' }}>
          <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
            {t("O'zgarishlarni butunlay saqlamoqchimisiz?")}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              marginBottom: '20px',
              color: 'orange'
            }}
          >
            {t("Bu amaliyotni ortga qaytarib bo'lmaydi")}
          </Typography>

          <LoadingButton loading={loading === 'approved'} onClick={() => confirmSalary('approved')} variant='contained'>
            {t('Saqlash')}
          </LoadingButton>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '400px' }}>
          <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>
            {t('O`qituvchi ma`lumotlarini tasdiqlash')}
          </Typography>
          {selectedEmployee && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Typography><strong>{t('Ism')}:</strong> {selectedEmployee.employee_data.name}</Typography>
              <Typography><strong>{t("O'zgarmas oylik")}:</strong> {formatCurrency(+selectedEmployee.fixed_salary)} so'm</Typography>
              <Typography><strong>{t('Foiz ulush')}:</strong> {+selectedEmployee.kpi} %</Typography>
              <Typography><strong>{t("Foiz ulush (so'm)")}:</strong> {formatCurrency(selectedEmployee.kpi_salary)} so'm</Typography>
              <Typography><strong>{t('Ish haqqi')}:</strong> {formatCurrency(selectedEmployee.salary)} so'm</Typography>
              <Typography><strong>{t('Avanslar')}:</strong> {formatCurrency(selectedEmployee.prepayment)} so'm</Typography>
              <Typography><strong>{t('Jarimalar soni')}:</strong> {selectedEmployee.fines_count || 0} ta</Typography>
              <Typography><strong>{t('Bonuslar')}:</strong> {formatCurrency(selectedEmployee.bonus_amount)} so'm</Typography>
              <Typography><strong>{t('Jarimalar')}:</strong> {formatCurrency(selectedEmployee.fine_amount)} so'm</Typography>
              <Typography><strong>{t('Yakuniy ish haqqi')}:</strong> {formatCurrency(selectedEmployee.final_salary)} so'm</Typography>
            </Box>
          )}
          <Typography
            sx={{
              textAlign: 'center',
              margin: '20px 0',
              color: 'orange'
            }}
          >
            {t("Bu amaliyotni ortga qaytarib bo'lmaydi")}
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setConfirmModalOpen(false)
                setSelectedEmployee(null)
              }}
            >
              {t('Bekor qilish')}
            </Button>
            <LoadingButton
              loading={loading === 'approved'}
              variant='contained'
              color='primary'
              onClick={confirmSingleSalary}
            >
              {t(' Tasdiqlash')}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

      <TeacherGroupsModal />
    </Box>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context

  return {
    props: {
      slug: params?.slug
    }
  }
}

export default UserView
