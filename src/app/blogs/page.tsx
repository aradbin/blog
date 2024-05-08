'use client'
import { BLOGS_URL } from '@/helpers/apiEndpoints'
import BlogCard from '../../components/blog/blog-card'
import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { useInfiniteQueryHook } from '@/helpers/useQueryHook'
import BlogCardSkeleton from '../../components/blog/blog-card-skeleton'
import { Loader2 } from 'lucide-react'

export default function Page(params: any) {
  const { data, fetchNextPage, isFetching, isFetchingNextPage }: any = useInfiniteQueryHook(
    BLOGS_URL,
    params?.searchParams,
  )

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-row-reverse">
        <Button variant={'default'} onClick={() => console.log()} className="w-[100px]">
          Sync
        </Button>
      </div>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data?.pages?.map((page: any, pageIndex: number) => (
          <Fragment key={pageIndex}>
            {page?.map((item: any, index: number) => <BlogCard key={index} blog={item} />)}
          </Fragment>
        ))}
        {(isFetching || isFetchingNextPage) && <BlogCardSkeleton count={20} />}
      </div>
      <div className="flex justify-center pt-4">
        {data?.pages[data?.pages?.length - 1]?.length === 2 && (
          <Button
            variant={'default'}
            onClick={() => fetchNextPage()}
            className="w-[150px]"
            disabled={isFetching || isFetchingNextPage}
          >
            {isFetching || isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
              </>
            ) : (
              <span>Load More</span>
            )}
          </Button>
        )}
      </div>
    </section>
  )
}
