import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import { LeadsResult, MenuOpenType } from '../LeadsKaban'
import { useTranslation } from 'react-i18next'
import Form from 'src/@core/components/form'
import { LoadingButton } from '@mui/lab'
import { useGet } from 'src/hooks/useApi'
import showResponseError from 'src/@core/utils/show-response-error'
import ceoConfigs from 'src/configs/ceo'
import api from 'src/@core/utils/api'
import { useRouter } from 'next/router'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { LeadsType } from '../model'

type Props = {
  open: string | null
  setOpen: Dispatch<SetStateAction<MenuOpenType>>
  leadId: string | null
  leadFirstName: string
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<LeadsType<LeadsResult[]>, any>>
  phone: string
}

export const BranchModal: FC<Props> = ({ open, setOpen, refetch, leadId, leadFirstName, phone }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [departmentData, setDepartmentData] = useState<any[] | null>()
  const [branchData, setBranchData] = useState<any[] | null>()
  const [error, setError] = useState<any>({})
  const router = useRouter()

  const { data: branches, isLoading } = useGet(ceoConfigs.barnchs)

  const { search, is_active } = router.query

  const handleGetLeads = async (isLoad: boolean) => {
    setLoading(true)

    try {
      await api.get(false ? `/amocrm/leads/${leadId}}/` : `leads/department-user-list/${leadId}/`, {
        params: { search, is_active }
      })
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const handleEditLead = async (id: any, values: any) => {
    const newValues = { ...values }
    if (values.phone) {
      const newPhone: string = values.phone.split(' ').join('')
      if (newPhone.length === 9) {
        Object.assign(newValues, { phone: `+998${newPhone}` })
      } else {
        Object.assign(newValues, { phone: `${newPhone}` })
      }
    }
    try {
      const resp = await api.patch(`leads/anonim-user/update/${id}/`, newValues)
      await handleGetLeads(false)
      return Promise.resolve(resp)
    } catch (err: any) {
      if (err.response) {
        showResponseError(err.response.data, setError)
      }
      return Promise.reject(err)
    }
  }

  const changeBranch = async (values: any) => {
    setLoading(true)
    try {
      await handleEditLead(leadId, { first_name: leadFirstName, phone, ...values })
      setLoading(false)
      await refetch()
      setOpen(null)
    } catch (err: any) {
      setLoading(false)
      showResponseError(err.response.data, setError)
    }
  }

  const handleBranch = async (branch: string) => {
    const data = await api.get(`leads/department/parent/?branch=${branch}`)

    setBranchData(data.data.results)
  }

  const handleClose = () => {
    setOpen(null)
    setDepartmentData(null)
    setBranchData(null)
  }

  const handleDepartmentChild = async (department: string) => {
    const data = await api.get(`leads/department/child/?parent=${department}`)

    setDepartmentData(data.data.results)
  }

  return (
    <Dialog open={open === 'branch'} onClose={() => setOpen(null)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography>{t('Boshqa Filialga')}</Typography>

        <IconButton>
          <IconifyIcon icon={'material-symbols:close'} onClick={() => setOpen(null)} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Form
          id='ddsdwqdasdasdasddwqd'
          sx={{
            minWidth: '280px',
            maxWidth: '350px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginTop: '5px'
          }}
          setError={setError}
          onSubmit={changeBranch}
          valueTypes='json'
        >
          <FormControl fullWidth>
            <InputLabel>{t('branch')}</InputLabel>

            <Select
              label={t('branch')}
              error={error?.branch?.error}
              name='branch'
              defaultValue={''}
              onChange={e => handleBranch(e.target.value)}
            >
              {isLoading ? (
                <MenuItem>Yuklanmoqda...</MenuItem>
              ) : branches?.results.length ? (
                branches?.results.map((el: any) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>Malumot yo'q</MenuItem>
              )}
            </Select>
            <FormHelperText error={error?.branch?.error}>{error?.branch?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t("Bo'lim")}</InputLabel>
            <Select
              label={t("Bo'lim")}
              error={error?.department_parent?.error}
              name='department_parent'
              defaultValue={''}
              onChange={e => handleDepartmentChild(e.target.value)}
            >
              {loading ? (
                <MenuItem>Yuklanmoqda...</MenuItem>
              ) : branchData?.length ? (
                branchData?.map((el: any) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))
              ) : branches?.results.length ? (
                <MenuItem>Fillialni tanlang!</MenuItem>
              ) : (
                <MenuItem>Malumot Yo'q</MenuItem>
              )}
            </Select>

            <FormHelperText error={error?.department_parent?.error}>{error?.department_parent?.message}</FormHelperText>
          </FormControl>

          {departmentData && (
            <FormControl fullWidth>
              <InputLabel>{t("Bo'lim")}</InputLabel>
              <Select label={t("Bo'lim")} error={error?.department?.error} name='department' defaultValue={''}>
                {loading ? (
                  <MenuItem>Yuklanmoqda...</MenuItem>
                ) : departmentData.length ? (
                  departmentData.map((el: any) => (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  ))
                ) : (
                  "Malumot yo'q"
                )}
              </Select>
              <FormHelperText error={error?.department?.error}>{error?.department?.message}</FormHelperText>
            </FormControl>
          )}

          <LoadingButton variant='contained' type={'submit'} loading={loading}>
            {t("Ko'chirish")}
          </LoadingButton>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
