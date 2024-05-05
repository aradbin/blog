import {
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { getRequest } from './requests'

export function useQueryHook(
  url: string,
  query: {} = {},
): UseQueryResult<{ data: any }, Error> {
  return useQuery({
    queryKey: [url, query],
    queryFn: async () => {
      try {
        const data = await getRequest(url, query)
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
): UseInfiniteQueryResult<{ data: any }, Error> {
  return useInfiniteQuery({
    queryKey: [url, query],
    queryFn: processRequestInfinity,
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

export async function processRequestInfinity({ pageParam }: any) {
  const { url, query } = pageParam
  return getRequest(url, query)
}
