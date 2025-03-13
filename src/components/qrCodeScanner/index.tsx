'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const englishCharsRegex = /^[a-zA-Z0-9-]*$/

  const handleSendQrCode = useCallback(async (code: string): Promise<void> => {
    if (!uuidRegex.test(code)) {
      toast.error("Noto'g'ri format")
      return
    }

    if (!englishCharsRegex.test(code)) {
      toast.error("Faqat ingliz tili belgilari ruxsat etilgan")
      return
    }

    try {
      setIsProcessing(true)
      const res = await api.post(`common/attendance/by-qr-code/${code}/`)
      if (res.status === 200) {
        toast.success('Muvaffaqiyatli', {
          style: { zIndex: 999999999 }
        })
      }
    } catch (err: any) {
      console.error(err)
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
        if (scannedCode && uuidRegex.test(scannedCode)) {
          if (!englishCharsRegex.test(scannedCode)) {
            toast.error("Faqat ingliz tili belgilari ruxsat etilgan")
            setScannedCode('')
            return
          }
          void handleSendQrCode(scannedCode)
        } else {
          setScannedCode('')
        }
        return
      }

      if (!englishCharsRegex.test(key)) {
        toast.error("Faqat ingliz tili belgilari ruxsat etilgan")
        return
      }

      const newCode = scannedCode + key
      setScannedCode(newCode)

      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        if (uuidRegex.test(newCode)) {
          if (!englishCharsRegex.test(newCode)) {
            toast.error("Faqat ingliz tili belgilari ruxsat etilgan")
            setScannedCode('')
            return
          }
          void handleSendQrCode(newCode)
        } else if (newCode.length >= 36) {
          setScannedCode('')
        }
      }, 500)
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      if (timer) clearTimeout(timer)
    }
  }, [scannedCode, isProcessing, handleSendQrCode])

  return <div />
}
