"use client"

import { useState, useRef, useEffect } from "react"
import { ScanLine, ZoomIn, ZoomOut, X, RotateCw } from "lucide-react"
import {
  IconButton,
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress
} from "@mui/material"
import { QrReader } from "react-qr-reader"
import { toast } from 'react-hot-toast'
import api from '../../../utils/api'

interface QrcodeScannerProps {
  onScan?: (result: string) => void
}

export const QrcodeScanner = ({ onScan }: QrcodeScannerProps) => {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [torch, setTorch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  const scannerRef = useRef<HTMLDivElement>(null)
  const [scanned, setScanned] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  const handleOpen = () => {
    setOpen(true)
    setScanned(false)
    setScanResult(null)
  }

  const handleClose = () => {
    setOpen(false)
    setZoom(1)
    setTorch(false)
  }

  const handleZoomIn = () => {
    if (zoom < 3) setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    if (zoom > 1) setZoom(prev => Math.max(prev - 0.2, 1))
  }

  const switchCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment")
    if (torch) setTorch(false)
  }

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  const handleScan = async (result: string | null) => {
    if (result && !loading && !scanned) {
      setScanned(true)
      setScanResult(result)

      if (navigator.vibrate) {
        navigator.vibrate(100)
      }

      setLoading(true)
      try {
        await api.post("common/attendance/group-qrcode/", {
          token: result,
        })
        toast.success("Siz davomatdan o'tdingiz")

        setTimeout(() => {
          handleClose()
          if (onScan) {
            onScan(result)
          }
        }, 1000)
      } catch (error: any) {
        if (error?.response?.data?.msg) {
          toast.error(error.response.data.msg)
          setTimeout(() => setScanned(false), 2000)
        } else {
          toast.error("Siz davomatdan o'tmadingiz, nimadir xato")
          setTimeout(() => setScanned(false), 2000)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleTorch = async () => {
    try {
      const track = videoRef.current?.srcObject instanceof MediaStream
        ? (videoRef.current.srcObject as MediaStream).getVideoTracks()[0]
        : null;

      if (track) {
        const capabilities = track.getCapabilities();
        // @ts-ignore
        if (capabilities.torch) {
          await track.applyConstraints({
            // @ts-ignore
            advanced: [{ torch: !torch }]
          });
          setTorch(!torch);
        } else {
          toast.error("Sizning qurilmangizda chiroq mavjud emas");
        }
      }
    } catch (error) {
      toast.error("Chiroqni yoqishda xatolik yuz berdi");
    }
  }

  const captureVideo = (videoElement: HTMLVideoElement | null) => {
    if (videoElement) {
      videoRef.current = videoElement;
    }
  }

  useEffect(() => {
    if (open) {
      setScanned(false)
      setScanResult(null)
    }
  }, [open])

  return (
    <div>
      <IconButton
        onClick={handleOpen}
      >
        <ScanLine color="#4C4E64DE" size={24} />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="qr-scanner-modal"
        aria-describedby="modal-to-scan-qr-codes"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          onClick={handleBackdropClick}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)"
          }}
        >
          <Paper
            elevation={10}
            sx={{
              width: { xs: "95%", sm: "450px" },
              maxWidth: "95%",
              maxHeight: "90vh",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
              bgcolor: "#FFFFFF",
              color: "#333"
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                position: "relative",
                zIndex: 30,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  color: "#333"
                }}
              >
                QR kodni skanerlash
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: "#333",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.05)"
                  }
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Scanner container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "380px", sm: "450px" },
                bgcolor: "#000"
              }}
              ref={scannerRef}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                  pointerEvents: "none",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Box
                  sx={{
                    width: "220px",
                    height: "220px",
                    border: "2px solid rgba(255, 255, 255, 0.8)",
                    borderRadius: "16px",
                    boxShadow: "0 0 0 2000px rgba(0, 0, 0, 0.5)",
                    position: "relative"
                  }}
                >
                  <Box sx={{ position: "absolute", top: -3, left: -3, width: "24px", height: "24px", borderTop: "4px solid #00E676", borderLeft: "4px solid #00E676", borderTopLeftRadius: "10px" }} />
                  <Box sx={{ position: "absolute", top: -3, right: -3, width: "24px", height: "24px", borderTop: "4px solid #00E676", borderRight: "4px solid #00E676", borderTopRightRadius: "10px" }} />
                  <Box sx={{ position: "absolute", bottom: -3, left: -3, width: "24px", height: "24px", borderBottom: "4px solid #00E676", borderLeft: "4px solid #00E676", borderBottomLeftRadius: "10px" }} />
                  <Box sx={{ position: "absolute", bottom: -3, right: -3, width: "24px", height: "24px", borderBottom: "4px solid #00E676", borderRight: "4px solid #00E676", borderBottomRightRadius: "10px" }} />

                  <Box
                    sx={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      right: "0",
                      height: "3px",
                      bgcolor: "#00E676",
                      boxShadow: "0 0 8px #00E676",
                      animation: "scan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                    }}
                  />
                </Box>
              </Box>

              {scanned && !loading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    zIndex: 100,
                    padding: "20px",
                  }}
                >
                  <Box
                    sx={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      bgcolor: "#00C853",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px"
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="white"/>
                    </svg>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      marginBottom: "5px",
                      fontWeight: 600
                    }}
                  >
                    QR kod aniqlandi!
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      maxWidth: "280px",
                      textAlign: "center"
                    }}
                  >
                    {scanResult && scanResult.substring(0, 20) + (scanResult.length > 20 ? '...' : '')}
                  </Typography>
                </Box>
              )}

              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    zIndex: 100,
                    padding: "20px",
                  }}
                >
                  <CircularProgress size={56} sx={{ color: "#00E676", marginBottom: "20px" }} />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "white",
                      fontWeight: 500
                    }}
                  >
                    Tekshirilmoqda...
                  </Typography>
                </Box>
              )}
              {/* @ts-ignore */}
              <style jsx global>{`
                @keyframes scan {
                  0% { transform: translateY(0); opacity: 0.8; }
                  50% { transform: translateY(220px); opacity: 1; }
                  100% { transform: translateY(0); opacity: 0.8; }
                }
              `}</style>

              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                {/* Camera modules */}
                <Box
                  sx={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.2s ease-out"
                  }}
                >
                  <QrReader
                    constraints={{ facingMode: facingMode }}
                    onResult={(result) => {
                      if (result) {
                        void handleScan(result.getText())
                      }
                    }}
                    scanDelay={500}
                    containerStyle={{ width: "100%", height: "100%" }}
                    videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
                    videoContainerStyle={{ width: "100%", height: "100%" }}
                    ViewFinder={() => null}
                    // @ts-ignore
                    videoRef={captureVideo}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  padding: "16px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                  zIndex: 20
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "20px",
                      padding: "4px 10px",
                      marginBottom: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontSize: "12px"
                      }}
                    >
                      {Math.round(zoom * 10) / 10}x
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "20px",
                      padding: "3px",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                  >
                    <IconButton
                      onClick={handleZoomOut}
                      size="small"
                      disabled={zoom <= 1}
                      sx={{
                        color: zoom <= 1 ? "rgba(255, 255, 255, 0.4)" : "white",
                        padding: "4px"
                      }}
                    >
                      <ZoomOut size={18} />
                    </IconButton>
                    <IconButton
                      onClick={handleZoomIn}
                      size="small"
                      disabled={zoom >= 3}
                      sx={{
                        color: zoom >= 3 ? "rgba(255, 255, 255, 0.4)" : "white",
                        padding: "4px"
                      }}
                    >
                      <ZoomIn size={18} />
                    </IconButton>
                  </Box>
                </Box>

                <IconButton
                  onClick={toggleTorch}
                  sx={{
                    bgcolor: torch ? "rgba(255, 193, 7, 0.2)" : "rgba(0, 0, 0, 0.6)",
                    border: torch ? "1px solid rgba(255, 193, 7, 0.6)" : "1px solid rgba(255, 255, 255, 0.2)",
                    width: "46px",
                    height: "46px",
                    "&:hover": {
                      bgcolor: torch ? "rgba(255, 193, 7, 0.3)" : "rgba(255, 255, 255, 0.1)"
                    }
                  }}
                >
                  <span style={{
                    fontSize: "24px",
                    filter: torch ? "none" : "grayscale(80%)",
                    opacity: torch ? 1 : 0.8
                  }}>💡</span>
                </IconButton>

                <IconButton
                  onClick={switchCamera}
                  sx={{
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: "46px",
                    height: "46px",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)"
                    }
                  }}
                >
                  <RotateCw size={20} color="white" />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                padding: "16px",
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                zIndex: 30,
                backgroundColor: "#FFFFFF",
              }}
            >
              <Button
                onClick={handleClose}
                fullWidth
                variant="outlined"
              >
                Yopish
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </div>
  )
}
