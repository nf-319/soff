"use client"

import { useState } from "react"
import { ScanLine } from "lucide-react"
import { IconButton, Modal, Box, Typography, Button } from "@mui/material"
import { QrReader } from "react-qr-reader"
import { toast } from 'react-hot-toast'
import api from '../../../utils/api'

interface QrcodeScannerProps {
  onScan?: (result: string) => void
}

export const QrcodeScanner = ({ onScan }: QrcodeScannerProps) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleScan = async (result: string | null) => {
    if (result) {
      try {
        await api.post("common/attendance/group-qrcode/", {
          token: result,
        })
        toast.success("Siz davomatdan o'tdingiz")
        handleClose()

        if (onScan) {
          onScan(result)
        }
      } catch (error: any) {
        if (error?.response?.data?.msg) {
          toast.error(error.response.data.msg)
          handleClose()
        } else {
          toast.error("Siz davomatdan o'tmadingiz, nimadir xato")
        }
      }
    }
  }

  return (
    <div>
      <IconButton onClick={handleOpen} style={{ borderRadius: "8px", padding: "8px" }}>
        <ScanLine color="#4C4E64DE" />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="qr-scanner-modal"
        aria-describedby="modal-to-scan-qr-codes"
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            maxWidth: "90%",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <Typography
            id="qr-scanner-modal"
            variant="h6"
            component="h2"
            style={{
              marginBottom: "16px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            QR kodni skanerlash
          </Typography>

          <div
            style={{
              width: "100%",
              height: "300px",
              overflow: "hidden",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result) => {
                if (result) {
                  void handleScan(result.getText())
                }
              }}
              scanDelay={500}
              containerStyle={{ width: "100%", height: "100%" }}
              videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <Button
            onClick={handleClose}
            fullWidth
            variant="outlined"
            style={{
              marginTop: "8px",
              borderRadius: "8px",
              padding: "10px 0",
              textTransform: "none",
            }}
          >
            Yopish
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

