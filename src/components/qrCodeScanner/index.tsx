'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'
import { getEnglish } from 'src/@core/utils/getEnglish'
import { uuidRegex } from '../qrCode-Modal'
import { setAttendance } from '../../store/apps/groupDetails'
import { useDispatch } from 'react-redux'
import { getMontNumber } from '../../@core/utils/gwt-month-name'
import { useRouter } from 'next/router'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { X } from 'lucide-react'

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [responseData, setResponseData] = useState<any>(null)
  const pathname = window.location.pathname
  const router = useRouter()
  const dispatch = useDispatch()

  const handleSendQrCode = useCallback(async (code: string): Promise<void> => {
    if (!getEnglish(code)) {
      toast.error('Qurilmangiz tili Ingliz tilida ekanligini tekshiring!')
      setScannedCode('')
      return
    }

    if (!uuidRegex.test(code)) {
      toast.error("QR kod noto'g'ri formatda")
      setScannedCode('')
      return
    }

    try {
      setIsProcessing(true)
      const res = await api.post(`common/attendance/by-qr-code/${code}/`)
      if (res.status === 200) {
        if (res.data.type == 'employee') {
          if (res.data.is_enter == true) {
            
            toast.success(`${res.data.first_name} ish joyiga yetib keldi`, { position: 'top-right' })
          } else {
            toast.error(`${res.data.first_name} ish joyidan chiqip ketdi`, { position: 'top-right' })

          }

          return
        }
        toast.success('Muvaffaqiyatli', {
          style: { zIndex: 999999999 }
        })
        if (res.data.type == 'student') {
          setOpen(true)
        }

        setResponseData(res.data)
      }

      if (pathname.includes('groups/view/security')) {
        const response = await api.get(
          `common/attendance-list/${router.query?.year || new Date().getFullYear()}-${getMontNumber(
            router.query?.month
          )}-01/group/${router.query?.id}/?`
        )
        dispatch(setAttendance(response.data))
      }
    } catch (err: any) {
      console.log(err)

      if (err?.response?.status === 404) {
        toast.error("Ma'lumot topilmadi")
      } else {
        toast.error(err.response?.data?.msg || 'Xatolik yuz berdi')
      }
    } finally {
      setScannedCode('')
      setIsProcessing(false)
    }
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    const ignoredKeys = [
      'CapsLock',
      'Tab',
      'Escape',
      'Backspace',
      'Alt',
      'Control',
      'Shift',
      'Meta',
      'Dead',
      'ContextMenu',
      'Insert',
      'Delete',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'NumLock',
      'ScrollLock',
      'Pause',
      'PrintScreen'
    ]

    const handleKeyPress = (event: KeyboardEvent): void => {
      if (isProcessing) return

      const key = event.key
      const code = event.code

      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || ignoredKeys.includes(code)) {
        return
      }

      if (key === 'Enter') {
        if (scannedCode && scannedCode.length === 36) {
          void handleSendQrCode(scannedCode)
        } else {
          setScannedCode('')
        }
        return
      }

      setScannedCode(prev => prev + key)

      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        const currentCode = scannedCode + key
        if (uuidRegex.test(currentCode)) {
          void handleSendQrCode(currentCode)
        } else if (currentCode.length >= 36) {
          setScannedCode('')
        }
      }, 100)
    }

    window.focus()
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (timer) clearTimeout(timer)
    }
  }, [scannedCode, isProcessing, handleSendQrCode])
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => {
        setOpen(false)
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [open, setOpen])

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle className='d-flex justify-content-end'>
          <IconButton>
            <X onClick={() => setOpen(false)} className='cursor-pointer' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className='p-4 border rounded shadow-sm bg-light'>
            <p className='mb-2'>
              <h5 className='mb-3 fw-bold'>{"Talaba haqida ma'lumot"}</h5>
              <strong>Ism:</strong> {responseData?.first_name}
            </p>
            <p className='mb-3'>
              <strong>Telefon:</strong> {responseData?.phone}
            </p>

            <div>
              <strong>Guruhlar:</strong>
              <ul className='list-group mt-2'>
                {responseData?.groups &&
                  responseData?.groups?.map((group: any) => (
                    <li className='list-group-item d-flex justify-content-between align-items-center' key={group.id}>
                      {group.group__name}
                      <span className={`badge ${group.is_available ? 'bg-success' : 'bg-danger'}`}>
                        {group.is_available ? 'Darsga kelgan' : 'Darsga kelmagan'}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
