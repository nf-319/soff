import api from '@/@core/utils/api'
import ceoConfigs from '@/configs/ceo'
import { useQuery } from '@tanstack/react-query'

const fetchGroupDebtors = async (params: { group?: number }) => {
  try {
    const res = await api.get(ceoConfigs.groupDebtors, {
      params: {
        with_debts: true,
        group: params.group || ''
      }
    })
    return res.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const useGroupDebtors = (group?: number, isOpen?: boolean) => {
    console.log(isOpen);
    
  return useQuery({
    queryKey: ['group_debts', group],
    queryFn: () => fetchGroupDebtors({ group }),
    staleTime: 1000 * 60 * 5,
    enabled: !isOpen
  })
}
