// store/leadsStore.js
import { create } from 'zustand';

export const useLeadsStore = create((set) => ({
  leadsSellers: [],
  setLeadsSellers: (data:any) => set({ leadsSellers: data }),
}));
