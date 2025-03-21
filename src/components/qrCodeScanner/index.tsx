'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'
import { getEnglish } from '../../@core/utils/getEnglish'
import { uuidRegex } from '../qrCode-Modal'

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handleSendQrCode = useCallback(async (code: string): Promise<void> => {
    console.log('QR Code:', code)

    if (!getEnglish(code)) {
      console.log('English validation failed:', code)
      toast.error("Qurilmangiz tili Ingliz tilida ekanligini tekshiring!")
      return
    }

    if (!uuidRegex.test(code)) {
      console.log('QR Code format incorrect:', code)
      toast.error("QR kod noto'g'ri formatda")
      return
    }

    try {
      setIsProcessing(true)
      const res = await api.post(`common/attendance/by-qr-code/${code}/`)
      if (res.status === 200) {
        toast.success('Muvaffaqiyatli', {
          style: { zIndex: 999999999 },
        })
      }
    } catch (err: any) {
      console.error('API error:', err)
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

    const handleKeyPress = (event: KeyboardEvent): void => {
      if (isProcessing) return

      const key = event.key

      if (key === 'Enter') {
        if (scannedCode) {
          void handleSendQrCode(scannedCode)
        }
        return
      }

      setScannedCode((prev) => prev + key)

      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        if (uuidRegex.test(scannedCode)) {
          void handleSendQrCode(scannedCode)
        } else if (scannedCode.length >= 36) {
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

  return <div />
}
