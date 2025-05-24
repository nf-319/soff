import { useMutation, useQuery } from '@tanstack/react-query'
import api from '@utils/api'
import { Endpoints } from '@api/endpoints'
import { QueryKeys } from '@/shared/query-hooks/queryKeys'

type LeadsDescriptionUpdateType = {
  id: string,
  newText: string,
  anonim_user: string,
  date: Date | null
}

const putLeadDescription = async ({ id, anonim_user, newText, date }: LeadsDescriptionUpdateType) => {
  try {
    const url = Endpoints.LeadsDescriptionDetail.replace(":id", id)
    const response = await api.put(url, { anonim_user, body: newText, date })
    return response.data
  } catch (error) {
    console.error(error)
  }
}

const deleteLeadDescription = async ({ id }: Pick<LeadsDescriptionUpdateType, 'id'>) => {
  try {
    const url = Endpoints.LeadsDescriptionDetail.replace(":id", id)
    const response = await api.delete(url)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

const getLeadDetail = async (id?: string) => {
  try {
    const url = Endpoints.LeadDetails.replace(':id', String(id))
    const response = await api.get(url)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const usePutLeadsDescription = () => useMutation({
  mutationKey: [QueryKeys.LeadsDescriptionUpdate],
  mutationFn: ({ id, anonim_user, newText, date }: LeadsDescriptionUpdateType) => putLeadDescription({ id, anonim_user, newText, date }),
})
export const useDeleteLeadsDescription = () => useMutation({
  mutationKey: [QueryKeys.LeadsDescriptionUpdate],
  mutationFn: ({ id }: Pick<LeadsDescriptionUpdateType, 'id'>) => deleteLeadDescription({ id }),
})

export const useGetLeadDetail = (id?: string) => useQuery({
  queryKey: [QueryKeys.LeadDetail, id],
  queryFn: () => getLeadDetail(id),
  enabled: !!id
})
