import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@shared/query-hooks/queryKeys'
import { ApiResponse } from '@/types'
import { MentorSellersRealTimeType, MentorSellersType as MentorType } from '@modules/MentorSellers/api/types'

type MentorSellersType = { id?: string, date: string }

const getMentorSellers = async () => {
  try {
    const response = await api.get<ApiResponse<MentorType[]>>(Endpoints.EmployeeSalaries);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export const useGetMentorSellers = () => useQuery({
  queryKey: [QueryKeys.EmployeeSellers],
  queryFn: getMentorSellers
})

const getMentorRealTime = async ({ id, date}: MentorSellersType) => {
  try {
    const url = Endpoints.EmployeeSalariesRealTime.replace(":id", String(id))
    const response = await api.get<MentorSellersRealTimeType[]>(url, {
      params: { date }
    });
    return response.data
  } catch (error) {
    console.error(error);
  }
}

export const useGetMentorRealTime = ({ id, date }: MentorSellersType) =>
  useQuery({
    queryKey: [QueryKeys.EmployeeSellersRealTime, id, date],
    queryFn: () => getMentorRealTime({ id, date }),
    enabled: !!id
  })


