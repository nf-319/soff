'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  Paper,
  Divider,
  Badge,
  Chip,
  Skeleton,
  useTheme,
  Fade,
  Avatar,
  Tooltip,
  alpha
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { EmptyContent } from 'src/components/empty-content'
import {
  ChevronLeft,
  Bell,
  Circle,
  Check,
  Bookmark,
  Calendar,
  Info,
  AlertCircle,
  MessageSquare
} from 'lucide-react'

interface Notification {
  id: number;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
  type: 'info' | 'warning' | 'success' | 'error' | 'message';
}

interface NotificationItem {
  id: number;
  notification: Notification;
}

const NotificationListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'isread'
})<{
  selected?: boolean;
  isread: number;
}>(({ theme, selected, isread }) => ({
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  transition: 'all 0.25s ease-in-out',
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : isread
      ? theme.palette.background.paper
      : alpha(theme.palette.primary.main, 0.04),
  borderLeft: selected
    ? `3px solid ${theme.palette.primary.main}`
    : 'none',
  '&:hover': {
    backgroundColor: selected
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.primary.main, 0.06),
    transform: 'translateX(4px)',
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
  },
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden'
}));

const NotificationDetailPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: `0 3px 15px ${alpha(theme.palette.common.black, 0.05)}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.3s ease',
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  justifyContent: 'space-between',
  width: '100%'
}));

const NotificationContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.default, 0.3),
  borderRadius: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '& img': {
    maxWidth: '100%',
    borderRadius: theme.spacing(1),
    margin: theme.spacing(2, 0),
  },
  '& p': {
    margin: theme.spacing(1.5, 0),
    lineHeight: 1.6,
  },
  '& h3, & h4': {
    margin: theme.spacing(2, 0, 1.5),
    color: theme.palette.text.primary,
  },
  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    margin: theme.spacing(1, 0),
    '& li': {
      margin: theme.spacing(0.5, 0),
    }
  }
}));

const TimeChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  fontSize: '0.7rem',
  height: '22px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(5px)',
}));

const NotificationAvatar = styled(Avatar)(({ theme }) => ({
  width: 30,
  height: 30,
  marginRight: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
}));

const getNotificationIcon = (type: string) => {
  switch(type) {
    case 'info': return <Info size={16} />;
    case 'warning': return <AlertCircle size={16} />;
    case 'success': return <Check size={16} />;
    case 'error': return <AlertCircle size={16} />;
    case 'message': return <MessageSquare size={16} />;
    default: return <Bell size={16} />;
  }
};

const generateFakeNotifications = (): NotificationItem[] => {
  return [
    {
      id: 1,
      notification: {
        id: 1,
        title: 'Tizimga xush kelibsiz',
        body: '<h3>Sizni ko\'rganingizdan xursandmiz!</h3><p>Ro\'yxatdan o\'tganingiz uchun rahmat. Endi siz platformamizning barcha imkoniyatlaridan foydalanishingiz mumkin.</p><img src="https://via.placeholder.com/600x300" alt="Xush kelibsiz" />',
        created_at: '2025-04-08T10:30:00',
        is_read: true,
        type: 'success'
      }
    },
    {
      id: 2,
      notification: {
        id: 2,
        title: 'Administratordan yangi xabar',
        body: '<p>Hurmatli foydalanuvchi,</p><p>Tizimda rejalashtirilgan texnik ishlar <strong>10 aprel soat 02:00 dan 04:00 gacha</strong> olib borilishi haqida xabar beramiz. Bu vaqt davomida xizmat ishlamasligi mumkin.</p><p>Hurmat bilan, Ma\'muriyat</p>',
        created_at: '2025-04-07T15:45:00',
        is_read: false,
        type: 'warning'
      }
    },
    {
      id: 3,
      notification: {
        id: 3,
        title: 'Tizim yangilanishi',
        body: '<h4>Versiya 2.5.1 chiqarildi!</h4><ul><li>Ish unumdorligi yaxshilandi</li><li>Xavfsizlik xatolari tuzatildi</li><li>Yangi funksiyalar qo\'shildi</li></ul><p>O\'zgarishlarni ko\'rish uchun sahifani qayta yuklang.</p>',
        created_at: '2025-04-06T09:15:00',
        is_read: false,
        type: 'info'
      }
    },
    {
      id: 4,
      notification: {
        id: 4,
        title: 'Uchrashiv haqida eslatma',
        body: '<p>Ertaga soat 14:00 da rejalashtirilgan uchrashiv haqida eslatma.</p><p>Mavzu: Choraklik hisobotni muhokama qilish</p><p>Joy: Onlayn (havola boshlashdan 15 daqiqa oldin yuboriladi)</p>',
        created_at: '2025-04-05T12:00:00',
        is_read: true,
        type: 'message'
      }
    },
    {
      id: 5,
      notification: {
        id: 5,
        title: 'Foydalanish shartlarining o\'zgarishi',
        body: '<h3>Hurmatli foydalanuvchilar!</h3><p>Sizni 2025 yil 15 maydan kuchga kiradigan xizmatdan foydalanish shartlarining o\'zgarishi haqida xabardor qilamiz.</p><p>Asosiy o\'zgarishlar:</p><ul><li>Maxfiylik siyosati</li><li>Ma\'lumotlarni saqlash qoidalari</li><li>Obuna shartlari</li></ul><p>O\'zgarishlarning to\'liq matni bilan tanishish uchun "Hujjatlar" bo\'limiga o\'ting.</p>',
        created_at: '2025-04-04T17:20:00',
        is_read: false,
        type: 'error'
      }
    }
  ];
};

export default function Notifications() {
  const { back } = useRouter();
  const theme = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeData = generateFakeNotifications();
      setNotifications(fakeData);
      setSelectedNotification(fakeData[0]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleReadNotification = (notificationItem: NotificationItem) => {
    setSelectedNotification(notificationItem);

    if (!notificationItem.notification.is_read) {
      setNotifications(prevNotifications =>
        prevNotifications.map(item =>
          item.id === notificationItem.id
            ? {
              ...item,
              notification: {
                ...item.notification,
                is_read: true
              }
            }
            : item
        )
      );
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter(item => !item.notification.is_read).length;
  }, [notifications]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uz', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: alpha(theme.palette.background.default, 0.7),
      p: 2
    }}>
      <NotificationHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={back}
            sx={{
              color: theme.palette.primary.main,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateX(-3px)'
              }
            }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Xabarnomalar
            {unreadCount > 0 && (
              <Badge
                color="primary"
                badgeContent={unreadCount}
                sx={{
                  ml: 2,
                  '& .MuiBadge-badge': {
                    animation: unreadCount ? 'pulse 2s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.2)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }
                }}
              />
            )}
          </Typography>
        </Box>
      </NotificationHeader>

      {loading ? (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 2 }}>
          <Box sx={{ width: '35%', height: '100%' }}>
            <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
              <Skeleton variant="rectangular" width="50%" height={30} sx={{ mb: 2 }} />
              <Divider sx={{ mb: 2 }} />
              {[1, 2, 3, 4].map((item) => (
                <Box key={item} sx={{ mb: 2, p: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Skeleton variant="circular" width={30} height={30} sx={{ mr: 1.5 }} />
                    <Skeleton variant="rectangular" width="70%" height={24} />
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={40} />
                </Box>
              ))}
            </Paper>
          </Box>

          <Box sx={{ width: '65%', height: '100%' }}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Skeleton variant="rectangular" width="60%" height={32} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Skeleton variant="rectangular" width={100} height={30} />
                  <Skeleton variant="rectangular" width={100} height={30} />
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 2 }} />
            </Paper>
          </Box>
        </Box>
      ) : notifications.length ? (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 2 }}>
          {/* Xabarnomalar ro'yxati */}
          <Box sx={{ width: '35%', height: '100%', overflow: 'hidden' }}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.3s ease',
                backgroundColor: theme.palette.background.paper,
                '&:hover': {
                  boxShadow: `0 5px 15px ${alpha(theme.palette.primary.main, 0.08)}`,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Barcha xabarnomalar ({notifications.length})
                </Typography>
                <Fade in={unreadCount > 0} timeout={500}>
                  <Chip
                    label={`${unreadCount} o'qilmagan`}
                    size="small"
                    color="primary"
                    sx={{
                      fontSize: '0.75rem',
                      visibility: unreadCount > 0 ? 'visible' : 'hidden'
                    }}
                  />
                </Fade>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <List sx={{ flex: 1, overflow: 'auto', px: 1 }}>
                {notifications.map((item, index) => (
                  <Fade key={item.id} in={true} timeout={300 + index * 100}>
                    <NotificationListItem
                      selected={selectedNotification?.id === item.id}
                      isread={item.notification.is_read ? 1 : 0}
                      onClick={() => handleReadNotification(item)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                        <NotificationAvatar>
                          {getNotificationIcon(item.notification.type)}
                        </NotificationAvatar>
                        <Box sx={{ width: '100%', pr: 5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {!item.notification.is_read && (
                              <Circle
                                size={8}
                                fill={theme.palette.primary.main}
                                style={{ marginRight: '8px' }}
                              />
                            )}
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: !item.notification.is_read ? 700 : 500,
                                color: !item.notification.is_read
                                  ? theme.palette.text.primary
                                  : theme.palette.text.secondary,
                                transition: 'color 0.2s ease'
                              }}
                            >
                              {item.notification.title}
                            </Typography>
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: alpha(theme.palette.text.secondary, 0.9),
                              display: '-webkit-box',
                              overflow: 'hidden',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              mt: 0.5
                            }}
                          >
                            {item.notification.body.replace(/<[^>]*>?/gm, '').substring(0, 60)}...
                          </Typography>
                        </Box>
                      </Box>
                      <TimeChip
                        label={formatDate(item.notification.created_at)}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: alpha(theme.palette.text.secondary, 0.8),
                          borderColor: alpha(theme.palette.divider, 0.3),
                        }}
                      />
                    </NotificationListItem>
                  </Fade>
                ))}
              </List>
            </Paper>
          </Box>

          <Box sx={{ width: '65%', height: '100%' }}>
            {selectedNotification ? (
              <Fade in={true} timeout={400}>
                <NotificationDetailPanel>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <NotificationAvatar sx={{ width: 38, height: 38, mr: 2 }}>
                        {getNotificationIcon(selectedNotification.notification.type)}
                      </NotificationAvatar>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {selectedNotification.notification.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Yuborilgan vaqt">
                        <Chip
                          icon={<Calendar size={16} />}
                          label={formatDate(selectedNotification.notification.created_at)}
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: '6px' }}
                        />
                      </Tooltip>
                      <Tooltip title={selectedNotification.notification.is_read ? "O'qilgan" : "O'qilmagan"}>
                        <Chip
                          icon={selectedNotification.notification.is_read ? <Check size={16} /> : <Circle size={16} />}
                          label={selectedNotification.notification.is_read ? "O'qilgan" : "O'qilmagan"}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: '6px' }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <NotificationContent>
                    <div dangerouslySetInnerHTML={{ __html: selectedNotification.notification.body }} />
                  </NotificationContent>

                  <Fade in={true} timeout={700}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Tooltip title="Saqlab qo'yish">
                        <IconButton
                          color="primary"
                          sx={{
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'scale(1.1) rotate(10deg)',
                              backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }
                          }}
                        >
                          <Bookmark size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Fade>
                </NotificationDetailPanel>
              </Fade>
            ) : (
              <Fade in={true} timeout={500}>
                <Paper sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Bell size={60} color={alpha(theme.palette.text.secondary, 0.3)} />
                    <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                      Xabar tanlang
                    </Typography>
                  </Box>
                </Paper>
              </Fade>
            )}
          </Box>
        </Box>
      ) : (
        <Fade in={true} timeout={500}>
          <Box sx={{
            height: 'calc(100vh - 100px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <EmptyContent title="Xabarnomalar yo'q" />
          </Box>
        </Fade>
      )}
    </Box>
  );
}
