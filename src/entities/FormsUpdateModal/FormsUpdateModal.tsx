'use client'

import {
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  FormHelperText,
  DialogTitle,
  TextField,
  Box,
  Typography,
  IconButton
} from '@mui/material'
import { FC, useState, useEffect } from 'react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import api from 'src/@core/utils/api'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '@/components/icon'
import showResponseError from 'src/@core/utils/show-response-error'
import LoadingButton from '@mui/lab/LoadingButton'

type Props = {
  open: boolean
  onClose: VoidFunction
  formData?: any
  onSuccess?: VoidFunction
}


type FormValues = {
  title: string
  department: string
  source: string
  success_text?: string
}

const schema = yup.object().shape({
  title: yup.string().required('Forma nomi kiritilishi shart'),
  department: yup.string().required("Bo'lim tanlanishi kerak"),
  source: yup.string().required("Manba tanlanishi kerak"),
  success_text: yup.string()
})

export const FormUpdateModal: FC<Props> = ({ open, onClose, formData, onSuccess }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [sources, setSources] = useState<any[]>([])
  const [error, setError] = useState<any>({})
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      department: '',
      source: '',
      success_text: ''
    },
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (open) {
      void fetchDepartments()
      void fetchSources()
    }
  }, [open])

  useEffect(() => {
    if (formData && open) {
      setValue('title', formData.title || '')
      setValue('department', formData.department_id || '')
      setValue('source', formData.source_id || '')
      setValue('success_text', formData.success_text || '')
      setSelectedDepartment(formData.department_parent_id || null)
    }
  }, [formData, open, setValue])

  const fetchDepartments = async () => {
    try {
      const response = await api.get('leads/departments/')
      setDepartments(response.data.results || [])
    } catch (error) {
      console.error('Failed to fetch departments:', error)
      toast.error('Bo\'limlarni yuklashda xatolik yuz berdi')
    }
  }

  const fetchSources = async () => {
    try {
      const response = await api.get('leads/source/')
      setSources(response?.data?.results || [])
    } catch (error) {
      console.error('Failed to fetch sources:', error)
      toast.error('Manbalarni yuklashda xatolik yuz berdi')
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      const formId = formData?.id
      if (!formId) {
        toast.error('Forma ID topilmadi')
        setIsLoading(false)
        return
      }

      await api.patch(`leads/application-form/update/${formId}/`, data)
      toast.success('Forma muvaffaqiyatli yangilandi')

      if (onSuccess) {
        onSuccess()
      }

      onClose()
      reset()
    } catch (err: any) {
      showResponseError(err?.response?.data, setError)
      toast.error('Formani yangilashda xatolik yuz berdi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontSize="18px">{t('Formani o\'zgartirish')}</Typography>
        <IconButton onClick={onClose}>
          <IconifyIcon icon={'ic:baseline-close'} />
        </IconButton>
      </DialogTitle>

      <Box padding={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal" error={!!errors.title}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('Forma nomi')}
                  size="small"
                  error={!!errors.title || error?.title?.error}
                  helperText={errors.title?.message || error?.title?.message}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal" error={!!errors.department}>
            <InputLabel id="department-parent-label" size="small">{t("Bo'lim")}</InputLabel>

            <Select
              labelId="department-parent-label"
              label={t("Bo'lim")}
              size="small"
              value={selectedDepartment || ''}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              error={!!errors.department || error?.departmentParent?.error}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>

            <FormHelperText error={!!errors.department || error?.departmentParent?.error}>
              {error?.departmentParent?.message}
            </FormHelperText>
          </FormControl>

          {selectedDepartment && (
            <FormControl fullWidth margin="normal" error={!!errors.department}>
              <InputLabel id="department-label" size="small">{t("Quyi bo'lim")}</InputLabel>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="department-label"
                    label={t("Quyi bo'lim")}
                    size="small"
                    error={!!errors.department || error?.department?.error}
                  >
                    {departments
                      .find(dept => dept.id === selectedDepartment)?.children?.map((child: any) => (
                        <MenuItem key={child.id} value={child.id}>
                          {child.name}
                        </MenuItem>
                      )) || []}
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.department?.message || error?.department?.message}
              </FormHelperText>
            </FormControl>
          )}

          <FormControl fullWidth margin="normal" error={!!errors.source}>
            <InputLabel id="source-label" size="small">{t('Manba')}</InputLabel>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="source-label"
                  label={t('Manba')}
                  size="small"
                  error={!!errors.source || error?.source?.error}
                >
                  {sources.map((source) => (
                    <MenuItem key={source.id} value={source.id}>
                      {source.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>
              {errors.source?.message || error?.source?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <Controller
              name="success_text"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('Yakuniy text')}
                  size="small"
                  rows={2}
                  error={!!errors.success_text || error?.success_text?.error}
                  helperText={errors.success_text?.message || error?.success_text?.message}
                />
              )}
            />
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('Bekor qilish')}
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              {t('Saqlash')}
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Dialog>
  )
}

FormUpdateModal.displayName = 'FormUpdateModal'
