import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@shared/query-hooks/queryKeys'
import { MentorType } from '../model/types'

const getMentor = async (id: string) => {
  try {
    const url = Endpoints.TeacherDetails.replace(":id", id)
    const response = await api.get<MentorType>(url)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetMentor = (id: string) =>
  useQuery({
    queryKey: [QueryKeys.TeacherDetail, id],
    queryFn: () => getMentor(id),
    enabled: !!id,
  })
