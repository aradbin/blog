'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PORTFOLIO_URL } from '@/helpers/apiEndpoints'
import { RefreshCw } from 'lucide-react'
import { useEffect } from 'react'
import { Skeleton } from '../ui/skeleton'
import { useQueryHook } from '@/helpers/hooks'

const SelectPortfolio = ({ value, onChangeHandler }: any) => {
  const { data, isFetching }: any = useQueryHook(PORTFOLIO_URL)

  useEffect(() => {
    if (data?.data.length) {
      onChangeHandler(JSON.stringify(data?.data[0]))
    }
  }, [data])

  return (
    <>
      {isFetching ? (
        <Skeleton className="h-[40px] w-full" />
      ) : (
        <Select value={value} onValueChange={onChangeHandler}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isFetching ? <RefreshCw className="animate-spin" /> : 'Select Portfolio'} />
          </SelectTrigger>
          <SelectContent>
            {data?.data?.map((item: any) => (
              <SelectItem key={item?.id} value={JSON.stringify(item)}>
                {item?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  )
}

export default SelectPortfolio
