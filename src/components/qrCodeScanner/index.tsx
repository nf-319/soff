'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const isEnglish = (text: string) => /^[A-Za-z0-9-]*$/.test(text)
  const uuidRegex = /^.{8}-.{4}-.{4}-.{4}-.{12}$/

  const handleSendQrCode = useCallback(async (code: string): Promise<void> => {
    if (!uuidRegex.test(code)) {
      return
    }

    if (!isEnglish(code)) {
      toast.error("Komputer tilini English tiliga o'tqazing!")
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
        if (scannedCode) {
          if (uuidRegex.test(scannedCode)) {
            if (!isEnglish(scannedCode)) {
              toast.error("Komputer tilini English tiliga o'tqazing!")
              setScannedCode('')
              return
            } else {
              void handleSendQrCode(scannedCode)
            }
          }
        }
        return
      }

      const newCode = scannedCode + key
      setScannedCode(newCode)

      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        if (uuidRegex.test(newCode)) {
          if (!isEnglish(newCode)) {
            toast.error("Komputer tilini English tiliga o'tqazing!")
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

