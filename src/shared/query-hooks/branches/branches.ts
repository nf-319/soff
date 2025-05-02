import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'
import { BranchTypes } from '@hooks/useRooms'
import { ApiResponse } from '@/types'

const getBranches = async () => {
  try {
    const response = await api.get<ApiResponse<BranchTypes[]>>(Endpoints.Branches)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const useGetBranches = () => useQuery({
  queryKey: [QueryKeys.Branches],
  queryFn: getBranches
})
