import api from '@utils/api'
import { useQuery } from '@tanstack/react-query'
import { EmployeeChecklistType } from '../types'
import { type ApiResponse } from '@/types'

const getTeachers = async (params: any) => {
  try {
    const response = await api.get('employee/teachers/', { params })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useGetTeachers = (params: any) =>
  useQuery<ApiResponse<EmployeeChecklistType[]>>({
    queryKey: ['teachers', params],
    queryFn: () => getTeachers(params),
    enabled: false,
  })

const getChecklist = async (params: any) => {
  try {
    const response = await api.get(`employee/check-list/`, {
      params
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const useGetCheckList = (params: any) => useQuery({
  queryKey: ['checklist-filter', params],
  queryFn: () => getChecklist(params),
})
