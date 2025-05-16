import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@shared/query-hooks/queryKeys'
import { ApiResponse } from '@/types'
import { MentorSellersType } from '@modules/MentorSellers/api/types'

const getMentorSellers = async () => {
  try {
    const response = await api.get<ApiResponse<MentorSellersType[]>>(Endpoints.EmployeeSalaries);
    return response.data
  } catch (error) {
    console.log(error);
  }
}

export const useGetMentorSellers = () => useQuery({
  queryKey: [QueryKeys.EmployeeSellers],
  queryFn: getMentorSellers
})


