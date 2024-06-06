import { UseInfiniteQueryResult, UseQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getRequest, getRequestLocal } from './requests'
import { toast } from 'sonner'

export function useQueryHook(url: string, query: {} = {}): UseQueryResult<{ data: any }, Error> {
  return useQuery({
    queryKey: [url, query],
    queryFn: async () => {
      try {
        const data = await getRequest(url, query)
        if (data?.error) {
          toast.error('Something went wrong. Please try again')
        }
        return data
      } catch (error) {
        toast.error('Something went wrong. Please try again')
        throw error
      }
    },
  })
}

export function useQueryHookLocal(url: string, query: {} = {}): UseQueryResult<{ data: any }, Error> {
  return useQuery({
    queryKey: [url, query],
    queryFn: async () => {
      try {
        const data = await getRequestLocal(url, query)
        return data
      } catch (error) {
        throw error
      }
    },
  })
}

export function useInfiniteQueryHook(
  url: string,
  query: {} = {},
  queryFn: any = null,
): UseInfiniteQueryResult<{ data: any }, Error> {
  return useInfiniteQuery({
    queryKey: [url, query],
    queryFn: ({ pageParam }: any) => {
      const { url, query } = pageParam
      return queryFn ? queryFn(url, query) : getRequest(url, query)
    },
    initialPageParam: { url: url, query: { limit: 20, offset: 0, ...query } },
    getNextPageParam: (_, __, lastPageParam) => {
      return {
        ...lastPageParam,
        query: {
          ...lastPageParam.query,
          offset: lastPageParam.query.offset + lastPageParam.query.limit,
        },
      }
    },
  })
}
