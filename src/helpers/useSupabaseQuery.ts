import { createBrowserClient } from '@/utils/supabase'
import { UseQueryResult, useQuery } from '@tanstack/react-query'

const useSupabaseQuery = (
  from: string,
  select: string = '*',
  key: string,
): UseQueryResult<{ data: any }, Error> => {
  const supabase = createBrowserClient()

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const { data, error } = await supabase.from(from).select(select)

      if (error) {
        throw error
      }

      return data
    },
  })
}

export default useSupabaseQuery
