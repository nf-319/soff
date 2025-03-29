import { Fragment, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import {
  fetchAmoCrmPipelines,
  fetchDepartmentList,
  setOpenItem,
  updateAmoCrmStudent,
  updateDepartmentStudent
} from 'src/store/apps/leads'
import toast from 'react-hot-toast'
import { useGet } from 'src/hooks/useApi'
import { LeadsResult } from '../../../../entities/lids/LeadsKanban'
import { LeadsType } from 'src/entities/lids'
import { useAuth } from 'src/hooks/useAuth'
import { DepartmentsResultType } from '../../../../pages/lids'
import { useRouter } from 'next/router'

type Props = {
  item: any
  reRender: any
  is_amocrm?: boolean
  open: any
  currentId: string
  setOpen: (val: any) => void
}

export default function MergeToDepartment({ setOpen, open, currentId, is_amocrm, item, reRender }: Props) {
  const { t } = useTranslation()
  const { query } = useRouter()
  const dispatch = useAppDispatch()
  const { loading, pipelines } = useAppSelector(state => state.leads)
  const [department, setDepartment] = useState<any>(null)
  const [loadingAmo, setLoading] = useState(false)
  const { user } = useAuth()
  const { is_active } = query

  const validationSchema = Yup.object({
    department: Yup.number().required("Bo'limni tanlang")
  })

  const {
    data: leadData,
  } = useGet<LeadsType<DepartmentsResultType[]>>('leads/departments/', {
    deps: ['leads'],
    params: { branch: user?.active_branch, is_active: is_active || true, parent: null }
  })

  const { data: parentLeadData } = useGet<LeadsType<LeadsResult[]>>('leads/departments/leads/', {
    params: { branch: user?.active_branch, parent: department},
    deps: ['departments-leads']
  })

  const initialValues: {
    department: number | null
  } = {
    department: null
  }

  const formik: any = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      const action =
        open === 'merge-to'
          ? is_amocrm
            ? updateDepartmentStudent({
                is_amocrm,
                id: item.id,
                data: { department: values.department, lead_id: item.id }
              })
            : updateDepartmentStudent({
                is_amocrm,
                id: item.id,
                data: { ...values }
              })
          : updateAmoCrmStudent({
              is_amocrm,
              id: item.id,
              data: { department: values.department, lead_id: item.id }
            })

      if (action) {
        setLoading(true)
        const resp = await dispatch(action)
        if (resp.meta.requestStatus === 'rejected') {
          formik.setErrors(resp.payload)
        } else {
          toast.success('Muvaffaqiyatli kochirildi')
          setOpen(null)
          await dispatch(fetchAmoCrmPipelines({}))
          await dispatch(fetchDepartmentList())

          formik.resetForm()
        }
        setLoading(false)
      }
      reRender()
    }
  })

  const { values, errors, touched, handleBlur, handleChange } = formik

  useEffect(() => {
    return () => {
      formik.resetForm()
    }
  }, [])

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        minWidth: '280px',
        maxWidth: '350px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginTop: '5px'
      }}
    >
      <FormControl fullWidth>
        <InputLabel>{t("Bo'lim")}</InputLabel>

        <Select label={t("Bo'lim")} defaultValue={''} onChange={e => setDepartment(e.target.value)}>
          {open == 'merge-to'
            ? leadData?.results.map((el: any) => (
                <MenuItem key={el.id} value={el.id}>
                  {el.name}
                </MenuItem>
              ))
            : pipelines.map((el: any) => (
                <MenuItem key={el.id} value={el.id}>
                  {el.name}
                </MenuItem>
              ))}
        </Select>
      </FormControl>

      {department && (
        <FormControl fullWidth>
          <InputLabel error={!!errors.department && touched.department}>{t("Bo'lim")}</InputLabel>
          <Select
            label={t("Bo'lim")}
            name='department'
            error={!!errors.department && touched.department}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.department}
          >
            {open == 'merge-to' ? (
              parentLeadData?.results.length ? (
                parentLeadData.results.map((el: any) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))
              ) : (
                <Fragment>
                  <MenuItem onClick={() =>  { setOpen(null); dispatch(setOpenItem(currentId))}}>+ Yangi bo'lim ochish</MenuItem>
                  <MenuItem sx={{ color: '#d3d3d3' }}>Bo'lim majuda emas!</MenuItem>
                </Fragment>
              )
            ) : (
              pipelines
                .find((item: any) => item.id === department)
                ?.children?.map((el: any) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))
            )}
          </Select>
          {!!errors.department && touched.department && <FormHelperText error>{errors.department}</FormHelperText>}
        </FormControl>
      )}

      <LoadingButton loading={loading || loadingAmo} type='submit' variant='outlined'>
        {t("Ko'chirish")}
      </LoadingButton>
    </form>
  )
}
