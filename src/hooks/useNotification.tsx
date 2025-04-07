import { useQuery } from '@tanstack/react-query';
import api from 'src/@core/utils/api';
import ceoConfigs from 'src/configs/ceo';

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

export const useNotifications = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: ['notification', page, limit],
    queryFn: () => fetchNotifications({ page, limit }), 
    staleTime: 1000 * 60 * 5,
  });
};
