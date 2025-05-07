import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { OverviewFinanceType } from '@/types/finance'

const getFinance = async (year: number, month?: number, branch?: number) => {
  const params = { year, branch, ...(month ? { month } : {}) }
  const response = await api.get<OverviewFinanceType>(Endpoints.FinancialsIncomeOverview, { params })
  return response.data
}

export const useGetFinance = (year: number, month?: number, branch?: number) =>
  useQuery({
    queryKey: [QueryKeys.FinancialsIncomeOverview, year, month, branch],
    queryFn: () => getFinance(year, month, branch),
    enabled: !!year && !!month && !!branch,
  })

