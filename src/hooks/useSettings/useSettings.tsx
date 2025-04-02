import api from '../../@core/utils/api'
import { Endpoints } from '../endpoints'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../queryKeys'

const getSettings = async () => {
  try {
    const response = await api.get(Endpoints.CompanySettingList)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const patchSettings = async (requestParams: any) => {
  try {
    await api.patch(Endpoints.CompanySettingUpdate, requestParams)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const useGetSettings = () =>
  useQuery({
    queryKey: [queryKeys.companySettingList],
    queryFn: getSettings
  })


export const usePatchSettings = () =>
  useMutation({
    mutationKey: [queryKeys.companySettingUpdate],
    mutationFn: (requestParams: any) => patchSettings(requestParams),
  })
