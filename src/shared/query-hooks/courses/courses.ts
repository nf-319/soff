import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { ChecklistCoursesType } from '@/types/courses'

const getChecklistCourses = async () => {
  try {
    const response = await api.get<ChecklistCoursesType[]>(Endpoints.ChecklistCourses)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetChecklistCourses = () => useQuery({
  queryKey: [QueryKeys.ChecklistCourse],
  queryFn: getChecklistCourses,
})
