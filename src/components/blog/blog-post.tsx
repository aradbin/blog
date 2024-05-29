'use client'
import Image from 'next/image'
import { useQueryHook } from '@/helpers/useQueryHook'
import { BLOGS_URL } from '@/helpers/apiEndpoints'
import BlogPostSkeleton from './blog-post-skeleton'
import { Badge } from '../ui/badge'

export default function BlogPost({ id }: any) {
  const { data, isFetching }: any = useQueryHook(BLOGS_URL, {
    id: id,
  })

  return (
    <>
      {isFetching ? (
        <BlogPostSkeleton />
      ) : (
        <>
          {data?.data?.map((item: any, index: number) => (
            <div key={index} className="flex flex-col gap-2">
              {item?.banner && (
                <Image alt="Banner" src={item?.banner} className="h-[250px] w-full rounded-lg object-cover" />
              )}
              <h3 className="mt-4 overflow-hidden text-2xl font-semibold leading-none tracking-tight">{item?.title}</h3>
              <div className="flex items-center gap-1">
                <Badge className="rounded-lg">Tag</Badge>
                <Badge className="rounded-lg">Tag</Badge>
                <Badge className="rounded-lg">Tag</Badge>
                <Badge className="rounded-lg">Tag</Badge>
              </div>
              <p className="text-sm font-semibold tracking-tight text-muted-foreground">21st May, 2024</p>
              <p className="mt-4">{item.description}</p>
            </div>
          ))}
        </>
      )}
    </>
  )
}
