import api from 'src/@core/utils/api'
import { Endpoints } from '@api/endpoints'
import { useMutation, useQuery } from '@tanstack/react-query'

type CreateNotification = {
  title: string,
  body: string,
  receivers: string[]
  tenant?: number
}

const postNotification = async (requestParams: CreateNotification) => {
  try {
    await api.post(Endpoints.SendGlobalNotification, requestParams)
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getAllNotification = async () => {
  try {
    const response = await api.get(Endpoints.GlobalNotifications)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getListClient = async (params?: any) => {
  try {
    const response = await api.get(Endpoints.OwnerListClient, { params })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getNotificationDetail = async (id: string) => {
  try {
    const endpoint = Endpoints.GlobalNotifications.replace("{id}", id)
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


