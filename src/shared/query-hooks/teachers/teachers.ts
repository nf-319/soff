import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { ChecklistTeacherType } from '@/types/teachers'

const getTeachers = async () => {
  try {
    const response = await api.get<ChecklistTeacherType[]>(Endpoints.ChecklistTeacher);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const useGetTeachers = () => useQuery({
  queryKey: [QueryKeys.ChecklistTeacher],
  queryFn: getTeachers,
})
