import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@shared/query-hooks/queryKeys'
import { MentorGroupType } from '../model/types'
import { ApiResponse } from '@/types'

const getGroups = async (mentorId?: string) => {
  try {
    const response = await api.get<ApiResponse<MentorGroupType[]>>(Endpoints.Groups, {
      params: { teacher: mentorId }
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetGroups = (mentorId?: string) => useQuery({
  queryKey: [QueryKeys.Groups],
  queryFn: () => getGroups(mentorId),
  enabled: !!mentorId
})


