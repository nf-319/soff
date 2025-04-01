import { useGet } from 'src/hooks/useApi';
import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  products: [],
  loading: false,
    fetchProducts: async () => {
    const {data,isLoading} = useGet('')
    set({ loading: isLoading });
    set({ products: data, loading: false });
  },
}));

export default useNotificationStore;
