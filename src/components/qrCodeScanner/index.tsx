'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from 'src/@core/utils/api'
import { getEnglish } from '../../@core/utils/getEnglish'
import { uuidAllRegex, uuidRegex } from '../qrCode-Modal'

export default function QRCodeScanner() {
  const [scannedCode, setScannedCode] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const handleSendQrCode = useCallback(async (code: string): Promise<void> => {
    if (!getEnglish(code)) {
      toast.error("Qurilmangiz tili Ingliz tilida ekanligini tekshiring!")
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

    const ignoredKeys = [
      'CapsLock', 'Tab', 'Escape', 'Backspace', 'Alt', 'Control', 'Shift',
      'Meta', 'Dead', 'ContextMenu', 'Insert', 'Delete', 'PageUp', 'PageDown',
      'Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'NumLock', 'ScrollLock', 'Pause', 'PrintScreen'
    ]

    const handleKeyPress = (event: KeyboardEvent): void => {
      if (isProcessing) return

      const key = event.key
      const code = event.code

      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        ignoredKeys.includes(code)
      ) {
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

      setScannedCode((prev) => prev + key)

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

  return <div />
}
