import React, { FC, useEffect, useRef, useState } from 'react'
import { usePost } from 'src/hooks/useApi'
import useDebounce from 'src/hooks/useDebounce'
import { Box, TextField } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import IconifyIcon from 'src/components/icon'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import toast from 'react-hot-toast'

type Props = {
  currentDate: any
  defaultValue: any
  groupId?: any
  userId?: any
  date?: any
  opened_id: any
  setOpenedId: any
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, any>>
}

export const ListItem: FC<Props> = ({ defaultValue, userId, date, setOpenedId, refetch }) => {
  const [value, setValue] = useState<any>(defaultValue)
  const isInitialMount = useRef(true)

  const { mutate, isError } = usePost()
  const gradeDebounce = useDebounce(String(value), 600)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!userId || !date) return

    if (gradeDebounce === '-') {
      mutate(`common/group-student/rating/create/`, {
        group_student: userId,
        date: date,
        is_delete: true,
        score: 0
      })
      void refetch()
    } else if (gradeDebounce && Number(gradeDebounce) !== defaultValue) {
      mutate(
        `common/group-student/rating/create/`,
        {
          group_student: userId,
          date: date,
          score: Number(gradeDebounce)
        },
        {
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.msg || error?.message || 'Xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.'

            toast.error(errorMessage)
          }
        }
      )
      void refetch()
    }
  }, [gradeDebounce, userId, date])

  const handleGradeChange = (e: any) => {
    const inputValue = e.target.value

    if (inputValue === '') {
      setValue('-')
      return
    }

    if (inputValue === '-') {
      setValue('-')
      return
    }

    const numericValue = inputValue.replace(/\D/g, '')

    let newGrade = Number(numericValue)

    if (numericValue === '') {
      newGrade = 0
    } else if (newGrade > 100) {
      newGrade = 100
      e.target.value = '100'
    }

    setValue(newGrade)
    setOpenedId(null)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {value != null ? (
        <Box sx={{ position: 'relative' }}>
          <TextField
            variant='outlined'
            value={value}
            onChange={(e: any) => handleGradeChange(e)}
            size='small'
            type='text'
            inputProps={{
              inputMode: 'numeric',
              maxLength: 3,
              max: 100
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
              if (e.key === '-') {
                e.preventDefault()
                setValue('-')
                return
              }

              if (e.key === 'Backspace' || e.key === 'Delete') {
                if (value.toString().length === 1) {
                  setValue('-')
                  return
                }
              }

              if (
                !/^\d$/.test(e.key) &&
                e.key !== 'Backspace' &&
                e.key !== 'Delete' &&
                e.key !== 'ArrowLeft' &&
                e.key !== 'ArrowRight' &&
                e.key !== 'Tab'
              ) {
                e.preventDefault()
              }

              if (/^\d$/.test(e.key)) {
                const newValue = value + e.key
                if (Number(newValue) > 100) {
                  e.preventDefault()
                }
              }
            }}
            sx={{
              width: '50px',
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#fff',
                borderColor: '#ccc'
              },
              '& input': {
                textAlign: 'center'
              }
            }}
          />
        </Box>
      ) : (
        <Tooltip title="Yopiq baho (o'zgartirib bo'lmaydi)" arrow>
          <span>
            <IconifyIcon icon={'material-symbols:lock-outline'} fontSize={18} color='#9e9e9e' />
          </span>
        </Tooltip>
      )}
    </Box>
  )
}
