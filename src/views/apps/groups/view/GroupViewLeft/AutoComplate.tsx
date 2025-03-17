'use client'

import TextField from '@mui/material/TextField'
import Autocomplete, { AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material/Autocomplete'
import { useTranslation } from 'react-i18next'
import { SyntheticEvent, useEffect, useState } from 'react'
import { StudentDetailType } from 'src/types/apps/studentsTypes'
import api from 'src/@core/utils/api'
import { AutocompleteValue } from '@mui/material'
import { FormikProps } from 'formik'
import useDebounce from '../../../../../hooks/useDebounce'
import { useRouter } from 'next/router'
import ceoConfigs from 'src/configs/ceo'

interface AutoCompleteProps {
  formik: FormikProps<{ student: number | null }>
  setSelectedStudents: (id: number | null) => void
  selectedStudent: any
}

const StudentAutoComplete = ({ formik, setSelectedStudents, selectedStudent }: AutoCompleteProps) => {
  const { t } = useTranslation()
  const [searchData, setSearchData] = useState<{ label: string; id: number }[]>([])
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 400)
  const router = useRouter()
  const { id } = router.query

  const searchStudent = async () => {
    setSearchData([])
    const resp = await api.get(ceoConfigs.employee_checklist, {
      params: { type: 'student', search: debounceSearch, group: id }
    })
    setSearchData(resp.data?.map((item: StudentDetailType) => ({ label: item?.first_name, id: item?.id })))
    
  }

  useEffect(() => {
    if (search !== '') {
      void searchStudent()
    } else {
      setSearchData([])
    }
  }, [debounceSearch])

  return (
    <Autocomplete
      size='small'
      open={!(search === '' || selectedStudent)}
      onChange={(
        event: SyntheticEvent,
        value: AutocompleteValue<{ label: string; id: number }, false, false, false>,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<{ label: string; id: number }>
      ) => setSelectedStudents(value ? value.id : null)}
      onInputChange={(event: SyntheticEvent, value: string) => setSearch(value)}
      id='combo-box-demo'
      options={searchData}
      sx={{ border: '1px solid #00000' }}
      noOptionsText={"Ma'lumot yoq"}
      renderInput={params => (
        <TextField
          {...params}
          label={t("O'quvchini qidiring")}
          error={!!formik.errors.student && formik.touched.student}
          helperText={formik.errors.student && formik.touched.student ? formik.errors.student : ''}
        />
      )}
    />
  )
}

StudentAutoComplete.displayName = 'StudentAutoComplete'
export default StudentAutoComplete
