'use client'
import { BLOGS_URL } from '@/helpers/apiEndpoints'
import SkeletonBlogCard from './skeleton-blog-card'
import BlogCard from './blog-card'
import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import { useInfiniteQueryHook } from '@/helpers/useQueryHook'

export default function Blogs({ searchParams }: any) {
  const { data, fetchNextPage, isFetching, isFetchingNextPage }: any =
    useInfiniteQueryHook('blogs', BLOGS_URL)

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {data?.pages?.map((page: any, pageIndex: number) => (
        <Fragment key={pageIndex}>
          {page?.map((item: any, index: number) => (
            <BlogCard key={index} blog={item} />
          ))}
        </Fragment>
      ))}
      {(isFetching || isFetchingNextPage) && <SkeletonBlogCard count={6} />}
      {data?.pages[data?.pages?.length - 1]?.length === 2 && (
        <Button variant={'default'} onClick={() => fetchNextPage()}>
          Load more
        </Button>
      )}
    </div>
  )
}
