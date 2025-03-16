"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  TextField,
  FormHelperText,
} from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"

interface TopicEditDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialTopic: string
  setTopic: (topic: string) => void
  changeTopicLoader: boolean
  handleTopicChange: (newTopic: string) => void
}

export const TopicEditDialog = ({
  open,
  setOpen,
  initialTopic,
  setTopic,
  changeTopicLoader,
  handleTopicChange
}: TopicEditDialogProps) => {

  const [, setLocalTopic] = useState(initialTopic)

  useEffect(() => {
    setLocalTopic(initialTopic)
  }, [initialTopic])

  const formik = useFormik({
    initialValues: {
      newTopic: initialTopic || ''
    },
    validationSchema: Yup.object({
      newTopic: Yup.string().required('Dars nomi majburiy.')
    }),
    onSubmit: values => {
      handleTopicChange(values.newTopic)
    },
    enableReinitialize: true
  })

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{
        style: {
          borderRadius: '8px',
          backgroundColor: '#fff'
        }
      }}
    >
      <DialogTitle style={{ color: '#000' }}>
        <Typography style={{ color: '#000', fontWeight: 600 }}>Dars o'zgartirish</Typography>
      </DialogTitle>
      <DialogContent style={{ minWidth: '300px', backgroundColor: '#fff' }}>
        <FormControl fullWidth>
          <TextField
            name='newTopic'
            onChange={formik.handleChange}
            size='small'
            value={formik.values.newTopic}
            fullWidth
            onBlur={formik.handleBlur}
            error={!!formik.errors.newTopic && !!formik.touched.newTopic}
            title='dars nomi'
            style={{ marginTop: '16px' }}
            InputProps={{
              style: { backgroundColor: '#fff', color: '#000' }
            }}
          />
          <FormHelperText
            error={!!formik.errors.newTopic && !!formik.touched.newTopic}
            style={{ color: !!formik.errors.newTopic && !!formik.touched.newTopic ? '#f44336' : 'rgba(0, 0, 0, 0.6)' }}
          >
            {!!formik.errors.newTopic && !!formik.touched.newTopic && formik.errors.newTopic}
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions style={{ backgroundColor: '#fff', padding: '16px' }}>
        <Button
          size='small'
          variant='outlined'
          color='error'
          onClick={() => {
            formik.resetForm()
            setOpen(false)
            setTopic('')
          }}
        >
          Bekor qilish
        </Button>
        <Button size='small' disabled={changeTopicLoader} variant='contained' onClick={() => formik.handleSubmit()}>
          Saqlash
        </Button>
      </DialogActions>
    </Dialog>
  )
}

