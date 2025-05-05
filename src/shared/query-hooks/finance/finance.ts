import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { OverviewFinanceType } from '@/types/finance'

const getFinance = async (year: number, month?: number) => {
  const params = { year, ...(month ? { month } : {}) }
  const response = await api.get<OverviewFinanceType>(Endpoints.FinancialsIncomeOverview, { params })
  return response.data
}

export const useGetFinance = (year: number, month?: number) =>
  useQuery({
    queryKey: [QueryKeys.FinancialsIncomeOverview, year, month],
    queryFn: () => getFinance(year, month),
    enabled: !!year,
  })
