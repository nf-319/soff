import ceoConfigs from '@/configs/ceo'
import { setDeleteGroupId } from '@/store/apps/groups'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Typography
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { MoveRight } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { deleteGroup, getStudents, handleEditClickOpen } from 'src/store/apps/groupDetails'

export default function Delete() {
  const [isLoading, setLoading] = useState(false)
  const { openEdit, students } = useAppSelector(state => state.groupDetails)
  const { deleteGroupId } = useAppSelector(state => state.groups)

  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const router = useRouter()
  const { query, push } = useRouter()
  const [resetBalance, setResetBalance] = useState(true)
  const queryClient = useQueryClient()

  const handleCheckboxChange = (event: any) => {
    setResetBalance(event.target.checked)
    console.log('Checkbox value:', event.target.checked)
  }
  const handleDelete = async () => {
    setLoading(true)
    if (query.id || deleteGroupId) {
      const response = await dispatch(
        deleteGroup({ group: Number(query.id) || deleteGroupId, ignore_debts: !resetBalance })
      )
      if (response.meta.requestStatus == 'fulfilled') {
        dispatch(handleEditClickOpen(null))
        if (router.pathname !== '/groups') {
          push('/groups')
        } else {
          queryClient.invalidateQueries({ queryKey: [ceoConfigs.groups, 'groups-list'] })
        }
      } else {
        toast.error(response.payload.msg || "Guruhni o'chirib bo'lmadi")
        if (response.payload.msg == "Guruhda barcha talabalar o'chirilmagan") {
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    if (openEdit == 'delete') {
      dispatch(getStudents({ id: query?.id || deleteGroupId, queryString: 'status=active,new' }))
    }
  }, [openEdit, deleteGroupId])

  return (
    <Dialog
      open={openEdit == 'delete'}
      onClose={() => {
        dispatch(handleEditClickOpen(null))
        dispatch(setDeleteGroupId(null))
      }}
      aria-labelledby='user-view-edit'
      sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 450, p: [1, 3] } }}
      aria-describedby='user-view-edit-description'
    >
      <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
        {t("Guruhni o'chirishga rozimisiz?")}
      </DialogTitle>
      <DialogContentText sx={{ textAlign: 'center' }}>{t("O'chirilgan guruhlar arxivda saqlanadi")}</DialogContentText>
      <DialogContent>
        {students && students.some((s:any) => s?.student.balance < 0) && (
          <>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={resetBalance} onChange={handleCheckboxChange} />}
                label="Qarzdor o'quvchi balansini 0 ga tushirish"
              />
            </FormGroup>

            {students
              .filter((item:any) => item?.student.balance < 0)
              .map((item: any) => (
                <Box
                  key={item?.student.id}
                  sx={{ display: 'flex', paddingY: 2, alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography>{item?.student.first_name}</Typography>
                  <Chip
                    variant='outlined'
                    color={item?.student.balance >= 0 ? 'success' : 'error'}
                    label={
                      <span className='flex items-center gap-1'>
                        {item?.student.balance} so'm{' '}
                        {resetBalance && item.student.balance < 0 && (
                          <span className='flex items-center gap-1'>
                            <MoveRight size={12} /> 0 so'm
                          </span>
                        )}
                      </span>
                    }
                  />
                </Box>
              ))}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton loading={isLoading} color='error' onClick={handleDelete} variant='outlined' sx={{ mr: 1 }}>
          {t("O'chirish")}
        </LoadingButton>
        <Button variant='outlined' color='secondary' onClick={() => dispatch(handleEditClickOpen(null))}>
          {t('Bekor qilish')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
