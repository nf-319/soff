"use client"

import React, { useEffect } from 'react'

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Tooltip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Tabs,
  Tab,
  Divider,
  useMediaQuery,
} from "@mui/material"
import { LoadingButton } from "@mui/lab"
import Link from "next/link"
import dayjs from "dayjs"
import IconifyIcon from "src/components/icon"
import CustomChip from "src/components/mui/chip"
import type { ThemeColor } from "src/@core/layouts/types"
import Image from "next/image"
import { usePost } from "../../../../../hooks/useApi"
import api from '../../../../../@core/utils/api'

const t = (text: string) => text

interface ColorsType {
  [key: string]: ThemeColor
}

const roleColors: ColorsType = {
  ceo: "error",
  admin: "info",
  teacher: "warning",
  director: "success",
}

interface GroupDetailsProps {
  groupData: any
  isGettingGroupDetails: boolean
  onlineLessonLoading: boolean
  user: any
  handleEdit: (id: any) => void
  handleOpenSendSMSModal: () => void
  handleEditClickOpen: (type: string) => void
  handleGetMeetLink: () => void
}

export default function GroupDetails({
  groupData,
  isGettingGroupDetails,
  onlineLessonLoading,
  user,
  handleEdit,
  handleOpenSendSMSModal,
  handleEditClickOpen,
  handleGetMeetLink
}: GroupDetailsProps) {
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const mediaQuery = useMediaQuery('(max-width: 600px)')
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [isLoadingQrCode, setIsLoadingQrCode] = useState(false)

  const endDate = groupData?.end_date
  const today = dayjs()
  const endDateObj = dayjs(endDate)
  const daysLeft = endDateObj.diff(today, 'day')

  const formattedDate = endDate?.split('-').reverse().join('.')
  const isTeacherOnly = user?.role.length === 1 && user?.role.includes('teacher')

  const addPeriodToThousands = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const getLessonDays = (days: string | undefined | null) => {
    const daysMap: Record<string, string> = {
      '1': 'Dushanba',
      '2': 'Seshanba',
      '3': 'Chorshanba',
      '4': 'Payshanba',
      '5': 'Juma',
      '6': 'Shanba',
      '7': 'Yakshanba'
    }

    if (!days || typeof days !== 'string') {
      return ''
    }

    return days
      .split(',')
      .map(day => daysMap[day] || day)
      .join(', ')
  }

  const fetchQrCodeImage = async () => {
    try {
      setIsLoadingQrCode(true)
      const response = await api.post(`common/get/group-qrcode/${groupData?.id}/`)
      setQrCodeImage(response.data.path)
    } catch (error) {
      console.error('Failed to fetch QR code:', error)
    } finally {
      setIsLoadingQrCode(false)
    }
  }

  const handleDownloadQR = () => {
    if (!qrCodeImage) return

    const link = document.createElement('a')
    link.href = qrCodeImage
    link.target = '_blank'
    link.download = `group-${groupData?.name}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (qrModalOpen) {
      timer = setTimeout(() => {
        setQrModalOpen(false)
      }, 600000)
    }

    return () => clearTimeout(timer)
  }, [qrModalOpen])


  return (
    <>
      <Card
        style={{ position: 'relative', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s ease' }}
      >
        <Box
          style={{
            padding: '16px 16px 8px 16px',
            background: 'linear-gradient(to right, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))'
          }}
        >
          {isGettingGroupDetails ? (
            <Skeleton variant="rounded" height={32} animation="wave" style={{ width: '75%' }} />
          ) : (
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconifyIcon icon="material-symbols:school" style={{ color: '#1976d2' }} />
                {groupData?.name}
                {daysLeft <= 7 && (
                  <Box
                    component="span"
                    style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      backgroundColor: daysLeft <= 2 ? '#f44336' : '#ff9800',
                      color: 'white'
                    }}
                  >
                    {daysLeft <= 0 ? t('Tugagan') : `${daysLeft} ${t('kun qoldi')}`}
                  </Box>
                )}
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent style={{ padding: '16px' }}>
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:account-group" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      {t('O\'quvchilar soni')}:
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      {groupData?.student_count} ta
                    </Typography>
                  </Box>
                )}

                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:book-education" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      {t('Kurs')}:
                    </Typography>
                    {!isTeacherOnly ? (
                      <Link href={`/settings/office/courses/`} style={{ textDecoration: 'none' }}>
                        <CustomChip
                          skin="light"
                          size="small"
                          label={groupData?.course_data?.name}
                          color={roleColors['director']}
                          sx={{
                            height: 24,
                            fontWeight: 600,
                            borderRadius: '5px',
                            fontSize: '0.875rem',
                            textTransform: 'capitalize',
                            '& .MuiChip-label': { mt: -0.25 },
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
                          }}
                        />
                      </Link>
                    ) : (
                      <CustomChip
                        skin="light"
                        size="small"
                        label={groupData?.course_data?.name}
                        color={roleColors['director']}
                        sx={{
                          height: 24,
                          fontWeight: 600,
                          borderRadius: '5px',
                          fontSize: '0.875rem',
                          textTransform: 'capitalize',
                          '& .MuiChip-label': { mt: -0.25 }
                        }}
                      />
                    )}
                  </Box>
                )}

                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:clock-outline" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      {t('Dars vaqti')}:
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      {groupData && `${t(getLessonDays(groupData?.day_of_week || ''))} ${groupData?.start_at}`}
                    </Typography>
                  </Box>
                )}

                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:door" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      {t('Dars xonasi')}:
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      {groupData?.room_data?.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:account" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      {t('O\'qituvchi')}:
                    </Typography>
                    <Link
                      href={`/mentors/view/security/?id=${groupData?.teacher_data?.id}`}
                      style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 500 }}
                    >
                      {groupData?.teacher_data?.first_name}
                    </Link>
                  </Box>
                )}

                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:calendar" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      {t('Kurs davomiyligi')}:
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      {groupData?.start_date?.split('-').reverse().join('.')} -
                      <span
                        style={{ color: daysLeft <= 2 ? '#f44336' : 'inherit', fontWeight: daysLeft <= 2 ? 600 : 500 }}
                      >
                        {formattedDate}
                      </span>
                    </Typography>
                  </Box>
                )}

                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:office-building" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      Filial:
                    </Typography>
                    <CustomChip
                      skin="light"
                      size="small"
                      label={groupData?.branch_data?.name}
                      color={roleColors['director']}
                      sx={{
                        height: 24,
                        fontWeight: 600,
                        borderRadius: '5px',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { mt: -0.25 }
                      }}
                    />
                  </Box>
                )}

                {isGettingGroupDetails ? (
                  <Skeleton variant="rounded" height={24} animation="wave" style={{ width: '100%' }} />
                ) : (
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconifyIcon icon="mdi:currency-usd" style={{ color: '#666' }} />
                    <Typography variant="body2" color="textSecondary">
                      {t('Kurs narxi')}:
                    </Typography>
                    <CustomChip
                      skin="light"
                      size="small"
                      label={`${groupData?.monthly_amount && addPeriodToThousands(+groupData?.monthly_amount)} so'm`}
                      color="secondary"
                      sx={{
                        height: 24,
                        fontWeight: 600,
                        borderRadius: '5px',
                        fontSize: '0.875rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { mt: -0.25 }
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>

        <CardActions
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            padding: '8px 16px 16px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          {isGettingGroupDetails ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  width={40}
                  height={40}
                  animation="wave"
                  style={{ margin: '0 4px' }}
                />
              ))
          ) : (
            <>
              {!isTeacherOnly && (
                <Tooltip title={t('Tahrirlash')} placement="top">
                  <Button
                    variant="outlined"
                    color="warning"
                    style={{
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      backgroundColor: 'white'
                    }}
                    onClick={() => {
                      handleEdit(groupData?.id)
                    }}
                  >
                    <IconifyIcon icon="iconamoon:edit-light" />
                  </Button>
                </Tooltip>
              )}

              {!isTeacherOnly && (
                <Tooltip title={t('O\'chirish')} placement="top">
                  <Button
                    variant="outlined"
                    color="error"
                    style={{
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      backgroundColor: 'white'
                    }}
                    onClick={() => handleEditClickOpen('delete')}
                  >
                    <IconifyIcon icon="mdi-light:delete" />
                  </Button>
                </Tooltip>
              )}

              {!isTeacherOnly && (
                <Tooltip title={t('SMS yuborish')} placement="top">
                  <Button
                    variant="outlined"
                    color="warning"
                    style={{
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      backgroundColor: 'white'
                    }}
                    onClick={handleOpenSendSMSModal}
                  >
                    <IconifyIcon icon="material-symbols-light:sms-outline" />
                  </Button>
                </Tooltip>
              )}

              {!isTeacherOnly && (
                <Tooltip title={t('O\'quvchi qo\'shish')} placement="top">
                  <Button
                    variant="outlined"
                    style={{
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      padding: 0,
                      backgroundColor: 'white'
                    }}
                    onClick={() => handleEditClickOpen('add-student')}
                  >
                    <IconifyIcon icon="mdi:user-add-outline" />
                  </Button>
                </Tooltip>
              )}

              <Tooltip title={t('Online dars')} placement="top">
                <LoadingButton
                  loading={onlineLessonLoading}
                  color="success"
                  variant="outlined"
                  style={{
                    minWidth: '40px',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    backgroundColor: 'white'
                  }}
                  onClick={handleGetMeetLink}
                >
                  <IconifyIcon icon="mdi:laptop" />
                </LoadingButton>
              </Tooltip>

              <Tooltip title={t('QR kod')} placement="top">
                <Button
                  disabled={daysLeft < 0}
                  variant="outlined"
                  color="primary"
                  style={{
                    minWidth: '40px',
                    width: '40px',
                    height: '40px',
                    padding: 0,
                    backgroundColor: 'white'
                  }}
                  onClick={() => {
                    setQrModalOpen(true)
                    void fetchQrCodeImage()
                  }}
                >
                  <IconifyIcon icon="mdi:qrcode" />
                </Button>
              </Tooltip>
            </>
          )}
        </CardActions>
      </Card>

      <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', textAlign: "center" }}>{t('Guruh QR kodi')}</DialogTitle>
        <DialogContent style={{ padding: '16px' }}>
          <DialogContentText style={{ marginBottom: '16px', textAlign: "center" }}>
            {t('QR kodni o‘quvchilarga ko‘rsating, ular o‘z profillariga kirib skaner qilganda, davomati avtomatik yozib olinadi.\n')}
          </DialogContentText>
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0' }}>
              <Box
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  backgroundColor: 'white',
                  overflow: "hidden"
                }}
              >
                {isLoadingQrCode ? (
                  <Skeleton variant="rectangular" width={mediaQuery ? 200 : 400} height={mediaQuery ? 200 : 400} />
                ) : (
                  <Image
                    src={qrCodeImage || 'https://me-qr.com/static/pages/all-pricing-img/top-img.webp'}
                    alt="Group QR Code"
                    style={{ objectFit: "contain" }}
                    width={mediaQuery ? 200 : 400}
                    height={mediaQuery ? 200 : 400}
                  />
                )}
              </Box>
              <Button
                variant="outlined"
                style={{ marginTop: '16px' }}
                onClick={handleDownloadQR}
                startIcon={<IconifyIcon icon="mdi:download" />}
              >
                {t('Yuklab olish')}
              </Button>
            </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

