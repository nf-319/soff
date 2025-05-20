import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@shared/query-hooks/queryKeys'
import { ApiResponse } from '@/types'
import { MentorSellersRealTimeType, MentorSellersType } from '@modules/MentorSellers/api/types'

const getMentorSellers = async () => {
  try {
    const response = await api.get<ApiResponse<MentorSellersType[]>>(Endpoints.EmployeeSalaries);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export const useGetMentorSellers = () => useQuery({
  queryKey: [QueryKeys.EmployeeSellers],
  queryFn: getMentorSellers
})

const getMentorRealTime = async (id?: string) => {
  try {
    const url = Endpoints.EmployeeSalariesRealTime.replace(":id", String(id))
    const response = await api.get<ApiResponse<MentorSellersRealTimeType[]>>(url);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export const useGetMentorRealTime = (id?: string) => useQuery({
  queryKey: [QueryKeys.EmployeeSellersRealTime],
  queryFn: () => getMentorRealTime(id),
  enabled: !!id
})


