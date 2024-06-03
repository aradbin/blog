'use client'
import { BLOGS_URL, PORTFOLIO_URL } from '@/helpers/apiEndpoints'
import BlogCard from '../../components/blog/blog-card'
import { Fragment, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useInfiniteQueryHook, useQueryHook } from '@/helpers/useQueryHook'
import BlogCardSkeleton from '../../components/blog/blog-card-skeleton'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Page(params: any) {
  const [portfolio, setPortfolio] = useState('')
  const { data, isFetching }: any = useQueryHook(PORTFOLIO_URL, {
    ...params?.searchParams,
  })

  useEffect(() => {
    setPortfolio(data?.data[0]?.id)
  }, [data])

  return (
    <section className="flex w-full flex-col gap-4">
      <Select
        value={portfolio}
        onValueChange={(e: any) => {
          setPortfolio(e)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Portfolio" />
        </SelectTrigger>
        <SelectContent>
          {data?.data?.map((item: any) => (
            <SelectItem key={item?.id} value={item?.id}>
              {item?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  )
}
