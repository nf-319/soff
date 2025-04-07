import api from 'src/@core/utils/api'
import { Endpoint } from 'src/shared/api/endpoints'
import { useMutation, useQuery } from '@tanstack/react-query'

type CreateNotification = {
  title: string,
  body: string,
  receivers: "ceo_admin" | "all"
  tenant?: number
}

const postNotification = async (requestParams: CreateNotification) => {
  try {
    await api.post(Endpoint.SendGlobalNotification, requestParams)
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getAllNotification = async () => {
  try {
    const response = await api.get(Endpoint.GlobalNotifications)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getListClient = async (params?: any) => {
  try {
    const response = await api.get(Endpoint.OwnerListClient, { params })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getNotificationDetail = async (id: string) => {
  try {
    const endpoint = Endpoint.GlobalNotifications.replace("{id}", id)
    const response = await api.get(endpoint)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const usePostNotification = () => useMutation({
  mutationKey: ['create-notification'],
  mutationFn: (requestParams: CreateNotification) => postNotification(requestParams),
})

export const useGetAllNotifications = () =>
  useQuery({
    queryKey: ['all-notification'],
    queryFn: getAllNotification
  })

export const useGetNotificationDetail = (id: string) =>
  useQuery({
    queryKey: ['all-notification'],
    queryFn: () => getNotificationDetail(id),
  })

export const useGetListClient = (params?: any) =>
  useQuery({
    queryKey: ['all client'],
    queryFn: () => getListClient(params),
  })


