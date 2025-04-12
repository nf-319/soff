export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'message';

export interface Notification {
  id: number;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
  type: NotificationType;
}

export interface NotificationItem {
  id: number;
  notification: Notification;
}

export interface NotificationListProps {
  notifications: NotificationItem[];
  selectedNotification: NotificationItem | null;
  handleReadNotification: (notificationItem: NotificationItem) => void;
  unreadCount: number;
}

export interface NotificationDetailProps {
  selectedNotification: NotificationItem | null;
}
