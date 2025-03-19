"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import { CalendarCheck } from "lucide-react"
import api from "src/@core/utils/api"
import { toast } from "react-hot-toast"

interface TopicAddDialogProps {
  open: boolean
  onClose: () => void
  date: string
  groupId: string | string[]
  onSuccess: () => void
  t: (key: string) => string
}

export const TopicAddDialog = ({ open, onClose, date, groupId, onSuccess, t }: TopicAddDialogProps) => {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)

  const formatDate = (dateString: string) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ]

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `${month} ${day}, ${year}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!topic || topic.trim() === "") {
      toast.error("Mavzu kiritilmadi", { duration: 2000 })
      return
    }

    setLoading(true)
    toast.loading("Mavzu saqlanmoqda...")

    try {
      await api.post("common/topic/create/", {
        topic,
        group: groupId,
        date: date,
      })

      toast.dismiss()
      toast.success("Mavzu muvaffaqiyatli saqlandi", { duration: 2000 })

      setTopic("")
      onClose()

      onSuccess()
    } catch (err: any) {
      toast.dismiss()
      console.error("Mavzu saqlashda xatolik:", err)
      console.error("Response data:", err.response?.data)
      toast.error(err.response?.data?.message || "Mavzuni saqlashda xatolik yuz berdi", { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarCheck size={20} />
          <Typography variant="h6">Mavzu qo'shish</Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Sana:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {formatDate(date)}
            </Typography>
          </Box>

          <TextField
            autoFocus
            label="Mavzu"
            fullWidth
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            variant="outlined"
            required
            autoComplete="off"
            placeholder="Mavzu nomini kiriting..."
            disabled={loading}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t("Bekor qilish")}
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || !topic.trim()}>
            {loading ? <CircularProgress size={24} /> : t("Saqlash")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

