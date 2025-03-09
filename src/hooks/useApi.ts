/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  InfiniteData,
  MutateOptions,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
  useSuspenseQuery,
  UseSuspenseQueryOptions
} from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'
import api from 'src/@core/utils/api'

type ICustomUseQueryOptions<TQueryFnData, TError, TData> = Partial<UseQueryOptions<TQueryFnData, TError, TData>>
type ICustomUseSuspenseQueryOptions<TQueryFnData, TError, TData> = Partial<
  UseSuspenseQueryOptions<TQueryFnData, TError, TData>
>
type ICustomUseInfiniteQueryOptions<TQueryFnData, TError, TData> = Partial<
  UseInfiniteQueryOptions<TQueryFnData, TError, TData>
>
type ICustomUseMutationOptions<D, E, P> = Partial<UseMutationOptions<D, E, P>>


export const getRequest = (url: string, config?: AxiosRequestConfig) =>
    api.get(url, config).then((res) => res.data);
  

export const postRequest = <T>(
    url: string,
    payload: T,
    config: AxiosRequestConfig = {},
) =>
    api
        .post(`/${url}`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
            ...config,
        })
        .then((res) => res.data)
export const putRequest = <T>(
    url: string,
    payload: T,
    config?: AxiosRequestConfig,
) => api.put(`/${url}`, payload, config).then((res) => res.data)

export const patchRequest = <T>(
    url: string,
    payload: T,
    config?: AxiosRequestConfig,
) => api.patch(`/${url}`, payload, config).then((res) => res.data)


export const deleteRequest = (url: string, config?: AxiosRequestConfig) =>
  api.delete(`/${url}`, config).then(res => res.data)

// --------------------------------------------------------------------------------

export type UseGetArgs<TData = any, TQueryFnData = unknown, TError = any> = {
  deps?: QueryKey
  options?: ICustomUseQueryOptions<TQueryFnData, TError, TData>
  config?: Omit<AxiosRequestConfig, 'params'>
  params?: Record<string, unknown>
}

export const useGet = <TData = any, TQueryFnData = unknown, TError = any>(
  url: string,
  args?: UseGetArgs<TData, TQueryFnData, TError>
) => {
  const { deps, config, options, params } = args || {}
  return useQuery<TQueryFnData, TError, TData>({
    queryKey: deps ? [url, ...deps, ...Object.values(params || {})] : [url, ...Object.values(params || {})],
    queryFn: () => getRequest(url, { ...config, params }),
    ...(options || {})
  })
}

export type UseSuspenseGetArgs<TData = any, TQueryFnData = unknown, TError = any> = {
  deps?: QueryKey
  options?: ICustomUseSuspenseQueryOptions<TQueryFnData, TError, TData>
  config?: Omit<AxiosRequestConfig, 'params'>
  params?: Record<string, unknown>
}
export const useSuspenseGet = <TData = any, TQueryFnData = unknown, TError = any>(
  url: string,
  args?: UseSuspenseGetArgs<TData, TQueryFnData, TError>
) => {
  const { deps, config, options, params } = args || {}
  return useSuspenseQuery<TQueryFnData, TError, TData>({
    queryKey: deps ? [url, ...deps, ...Object.values(params || {})] : [url, ...Object.values(params || {})],
    queryFn: () => getRequest(url, { ...config, params }),
    ...(options || {})
  })
}

export const useInfinite = <
  TData = any,
  TQueryFnData = {
    has_next_page: boolean
    next_cursor: number
    items: TData
  },
  TError = Error
>(
  url: string,
  {
    deps,
    options,
    config,
    cursor_key = 'cursor'
  }: {
    deps?: QueryKey
    options?: ICustomUseInfiniteQueryOptions<TQueryFnData, TError, InfiniteData<TQueryFnData, unknown>>
    config?: AxiosRequestConfig
    cursor_key?: string
  }
) => {
  return useInfiniteQuery<TQueryFnData, TError, TData>({
    queryKey: deps ? [url, ...deps] : [url],
    queryFn: ({ pageParam = undefined }) => {
      return getRequest(url, {
        ...config,
        params: { ...config?.params, [cursor_key]: pageParam }
      })
    },
    getNextPageParam: lastPage =>
      // @ts-expect-error default settings
      lastPage?.has_next_page && lastPage?.next_cursor
        ? // @ts-expect-error default settings
          lastPage?.next_cursor
        : undefined,
    initialPageParam: undefined,
    // @ts-expect-error default settings
    select: ({ pages }) =>
      // @ts-expect-error default settings
      pages.flatMap(p => (Array.isArray(p?.items) ? p.items : [])) || [],
    ...(options || {})
  })
}

// Mutation factory
type RequestFunction = <T>(url: string, payload: T, config?: AxiosRequestConfig) => Promise<any>

const createMutationHook = <P = any, D = any>(requestFn: RequestFunction) => {
  return (options?: ICustomUseMutationOptions<D, any, { url: string; payload: P }>, config?: AxiosRequestConfig) => {
    const mutation = useMutation<D, any, { url: string; payload: P }>({
      mutationFn: ({ url, payload }) => requestFn(url, payload, config),
      ...(options || {})
    })

    const mutate = (
      url: string,
      payload: P,
      mutateOptions?: MutateOptions<D, any, { url: string; payload: P }, unknown>
    ) => {
      mutation.mutate({ url, payload }, mutateOptions)
    }

    const mutateAsync = (
      url: string,
      payload: P,
      mutateOptions?: MutateOptions<D, any, { url: string; payload: P }, unknown>
    ) => mutation.mutateAsync({ url, payload }, mutateOptions)

    return { ...mutation, mutate, mutateAsync }
  }
}

// Mutation hooks
export const usePost = createMutationHook(postRequest)
export const usePut = createMutationHook(putRequest)
export const usePatch = createMutationHook(patchRequest)

export const useDelete = (options?: ICustomUseMutationOptions<any, any, string>, config?: AxiosRequestConfig) => {
  const mutation = useMutation<any, any, string>({
    mutationFn: url => deleteRequest(url, config),
    ...(options || {})
  })

  return mutation
}
