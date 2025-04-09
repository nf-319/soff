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

const fetchNotificationRead = async (id: string) => {
  try {
    const url = Endpoints.NotificationRead.replace("{id}", id);
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

export const useNotificationRead = (id: string) => {
  return useQuery({
    queryKey: ['notification-read'],
    queryFn: () => fetchNotificationRead(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id
  });
};
