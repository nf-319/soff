import LoadingButton from '@mui/lab/LoadingButton'
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  TextField,
} from '@mui/material'
import { FC, Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import IconifyIcon from '../../../components/icon'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@/store'
import { setFields, setOpen } from '@store/apps/form'
import { FieldType } from '@/types'

export const ActionsModals: FC = () => {
  const { t } = useTranslation()
  const { open, fields } = useAppSelector((state) => state.form);
  const [variants, setVariants] = useState<any>([])
  const [name, setName] = useState<any>(null)
  const dispatch = useAppDispatch()
  const [selectType, setSelectType] = useState<'single' | 'multiple'>('single')

  const handleClose = () => {
    dispatch(setOpen(null))
    setVariants([])
    setName('')
  }

  const handleAddField = (input_type: FieldType['input_type']) => {
    const newField: FieldType = {
      input_type,
      label: name,
      title: name,
      is_required: false,
      ...(input_type === 'question'
        ? {
            question_type: selectType,
            question: name,
            question_variants: variants
          }
        : { value: '' })
    }

    dispatch(setFields([...fields, newField]))
    dispatch(setOpen(null))
    setName("")
    setVariants([])
  }

  return (
    <Fragment>
      <Dialog open={open === 'input'} onClose={handleClose}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <FormControl>
            <TextField
              label={t('Input nomi (Nima yozish uchun?)')}
              size='small'
              onChange={e => setName(e.target.value)}
            />
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
            <LoadingButton onClick={handleClose} variant='outlined'>
              {t('Bekor qilish')}
            </LoadingButton>

            <LoadingButton
              disabled={name ? name.length === 0 : !name}
              variant='contained'
              onClick={() => handleAddField('input')}
            >
              {t('Saqlash')}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={open === 'description'} onClose={handleClose}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <FormControl>
            <TextField label="Ko'proq matn yozish uchun" size='small' onChange={e => setName(e.target.value)} />
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
            <LoadingButton onClick={handleClose} variant='outlined'>
              Bekor qilish
            </LoadingButton>

            <LoadingButton
              disabled={name ? name.length === 0 : !name}
              variant='contained'
              onClick={() => handleAddField('text')}
            >
              Saqlash
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={open === 'single'} onClose={handleClose}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '350px' }}>
          <ButtonGroup size='small' fullWidth>
            <Button
              onClick={() => setSelectType('single')}
              variant={selectType === 'single' ? 'contained' : 'outlined'}
              size='small'
            >
              {t('Bitta javob')}
            </Button>

            <Button
              onClick={() => setSelectType('multiple')}
              variant={selectType === 'multiple' ? 'contained' : 'outlined'}
              size='small'
            >
              Bir nechta javob
            </Button>
          </ButtonGroup>

          <FormControl>
            <TextField label='Savol matni' multiline rows={2} size='small' onChange={e => setName(e.target.value)} />
          </FormControl>

          {variants.map((el: any, index: number) => (
            <TextField
              key={el.id}
              label={`Variant ${index + 1}`}
              size='small'
              variant='standard'
              value={el.value}
              onChange={e =>
                setVariants((prev: any) =>
                  prev.map((item: any) => (item.id === el.id ? { ...item, value: e.target.value } : item))
                )
              }
            />
          ))}

          <Button
            startIcon={<IconifyIcon icon='ic:baseline-add' />}
            onClick={() =>
              setVariants((c: any) => [...c, { id: uuidv4(), value: c.value, order: variants.length + 1 }])
            }
            size='small'
          >
            Javob varianti qo'shish
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 6 }}>
            <LoadingButton onClick={handleClose} variant='outlined'>
              Bekor qilish
            </LoadingButton>

            <LoadingButton
              variant='contained'
              disabled={name ? name.length === 0 : !name}
              onClick={() => handleAddField('question')}
            >
              {t('Saqlash')}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

ActionsModals.displayName = 'ActionsModals'
