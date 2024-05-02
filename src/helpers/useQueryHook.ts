import {
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { getRequest, getRequestInfinity } from './requests'
import { stringifyRequestQuery } from './utils'

export function useInfiniteQueryHook(
  key: string,
  url: string,
): UseInfiniteQueryResult<{ data: any }, Error> {
  return useInfiniteQuery({
    queryKey: [key],
    queryFn: getRequestInfinity,
    initialPageParam: { limit: 2, offset: 0 },
    getNextPageParam: (_, __, lastPageParam) => {
      return { limit: 2, offset: lastPageParam.offset + 2 }
    },
  })
}

export function useQueryHook(
  key: string,
  url: string,
  query: {} = {},
): UseQueryResult<{ data: any }, Error> {
  const params = stringifyRequestQuery(query)
  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      try {
        const data = await getRequest(url, params)
        return data
      } catch (error) {
        throw error
      }
    },
  })
}
