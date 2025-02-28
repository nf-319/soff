import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import api from 'src/@core/utils/api'
import toast from 'react-hot-toast'
import { useAppDispatch } from 'src/store'
import { useRouter } from 'next/router'
import { fetchCompanyDetails } from 'src/store/apps/c-panel/companySlice'

export function AddStudentModal({
  openModal,
  setOpenModal,
  id
}: {
  openModal: boolean
  setOpenModal: (status: boolean) => void
  id: number | string
}) {
  const { t } = useTranslation()
  const [branches, setBranches] = useState([])
  const dispatch = useAppDispatch()
  const { query } = useRouter()
  async function getBranches() {
    api.get(`/owner/tenant/branches/${id}/`).then(res => {
      setBranches(res.data)
    })
  }

  useEffect(() => {
    if (openModal) {
      getBranches()
    }
  }, [openModal])

  const validationSchema = Yup.object().shape({
    branch: Yup.number().required('Filialni tanlang'),
    file: Yup.mixed()
      .required(t('Fayl yuklang') || 'Fayl yuklang')
      .test(
        'fileFormat',
        t('Faqat .xlsx yoki .xls yuklash mumkin') || 'Faqat .xlsx yoki .xls yuklash mumkin',
        (value: any) => {
          if (!value) return false
          return [
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
          ].includes(value.type)
        }
      )
  })

  const handleSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    const formData = new FormData()
    formData.append('branch', values.branch)
    formData.append('file', values.file)

    try {
      await api.post(`/owner/tenant/students-import/${id}`, formData)
      setOpenModal(false)
      toast.success('Fayl muvaffaqiyatli yuklandi')
      dispatch(fetchCompanyDetails(Number(query?.slug)))
    } catch (err: any) {
      console.log(err)

      setErrors(err.response.data)
    }

    setSubmitting(false)
  }

  return (
    <Dialog fullWidth onClose={() => setOpenModal(false)} open={openModal}>
      <DialogTitle>{t("Talaba qo'shish")}</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ branch: null, file: null }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Filial tanlash */}
              <FormControl sx={{ marginTop: 3 }} fullWidth error={touched.branch && !!errors.branch}>
                <InputLabel id='branch-label'>{t('Filial')}</InputLabel>
                <Select
                  label='Filial'
                  multiple={false}
                  labelId='branch-label'
                  name='branch'
                  value={values.branch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {branches.map((branch: any) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.branch && errors.branch && <FormHelperText>{errors.branch}</FormHelperText>}
              </FormControl>

              {/* Fayl yuklash */}
              <FormControl sx={{ marginTop: 3 }} fullWidth error={touched.file && !!errors.file}>
                <input
                  type='file'
                  name='file'
                  accept='.xlsx,.xls,.csv'
                  onChange={(event: any) => setFieldValue('file', event.target.files[0])}
                  onBlur={handleBlur}
                />
                {touched.file && errors.file && <FormHelperText>{errors.file}</FormHelperText>}
              </FormControl>

              <DialogActions sx={{ marginTop: 3 }}>
                <Button variant='outlined' onClick={() => setOpenModal(false)}>
                  {t('Bekor qilish')}
                </Button>
                <Button type='submit' variant='contained' disabled={isSubmitting} color='primary'>
                  {t('Yuborish')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
