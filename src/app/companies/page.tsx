'use client'
import { COMPANIES_URL } from '@/helpers/apiEndpoints'
import BlogCard from '../../components/blog/blog-card'
import { Fragment } from 'react'
import { useQueryHook } from '@/helpers/useQueryHook'
import BlogCardSkeleton from '../../components/blog/blog-card-skeleton'
import { createRequest, getRequestLocal, upsertRequest } from '@/helpers/requests'
import { Button } from '@/components/ui/button'

export default function Page(params: any) {
  const { data, isFetching }: any = useQueryHook(COMPANIES_URL, params?.searchParams)

  const call = async () => {
    const categories = ['A', 'B', 'G', 'N', 'Z']
    categories.map(async (category) => {
      const response = await getRequestLocal(`/api/dse/sync/category/${category}`)

      const has: any[] = []
      const hasNot: any[] = []

      response?.companies?.map((company: any) => {
        let matched: any = null
        data?.map((item: any) => {
          if (item.name === company.name) {
            matched = item
          }
        })
        if (matched) {
          has.push({
            id: matched.id,
            name: company.name,
            price: parseFloat(company.price.replace(/,/g, '')),
            market: 'dse',
            category: category,
          })
        } else {
          hasNot.push({
            name: company.name,
            price: parseFloat(company.price.replace(/,/g, '')),
            market: 'dse',
            category: category,
          })
        }
      })

      await upsertRequest(COMPANIES_URL, has)
      await createRequest(COMPANIES_URL, hasNot)
    })
  }

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-row-reverse">
        <Button variant={'default'} onClick={() => call()} className="w-[100px]">
          Sync
        </Button>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data?.pages?.map((page: any, pageIndex: number) => (
          <Fragment key={pageIndex}>
            {page?.map((item: any, index: number) => <BlogCard key={index} blog={item} />)}
          </Fragment>
        ))}
        {isFetching && <BlogCardSkeleton count={20} />}
      </div>
    </section>
  )
}
