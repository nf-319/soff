import { useQuery } from '@tanstack/react-query';
import api from 'src/@core/utils/api';
import ceoConfigs from 'src/configs/ceo';
import { Endpoints } from '@api/endpoints'

const fetchNotifications = async (params: { page?: number; limit?: number }) => {
  try {
    const res = await api.get(ceoConfigs.notification, {
      params: {
        page: params.page || '',
        limit: params.limit || '',
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const fetchNotificationsNotRead = async () => {
  try {
    const res = await api.get(ceoConfigs.notification, {
      params: {
        is_read: false,
      },
    });

    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const fetchNotificationRead = async (id: number) => {
  try {
    const url = Endpoints.NotificationRead.replace("{id}", String(id));
    const response = await api.get(url)
    return response.data;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.msg);
  }
}

export const useNotifications = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ['notification', page, limit],
    queryFn: () => fetchNotifications({ page, limit }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useNotificationsNotRead = () => {
  return useQuery({
    queryKey: ['notification-not-read'],
    queryFn: fetchNotificationsNotRead,
    staleTime: 1000 * 60 * 5,
    enabled: false
  });
};

export const useNotificationRead = (id: number | undefined) => {
  const isValidId = id !== undefined && !isNaN(Number(id)) && Number(id) > 0;

  return useQuery({
    queryKey: ['notification-read', id],
    queryFn: () => {
      if (!isValidId) {
        return Promise.resolve(null);
      }
      return fetchNotificationRead(Number(id));
    },
    staleTime: 1000 * 60 * 5,
    enabled: isValidId && false,
  });
};
