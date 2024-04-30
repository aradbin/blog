import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { getRequest } from './requests'
import { stringifyRequestQuery } from './utils'

const useQueryHook = (
  key: string,
  url: string,
  query: {} = {},
): UseQueryResult<{ data: any }, Error> => {
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

export default useQueryHook
