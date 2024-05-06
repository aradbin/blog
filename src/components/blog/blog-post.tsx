'use client'

import Image from 'next/image'
import { useQueryHook } from '@/helpers/useQueryHook'
import { BLOGS_URL } from '@/helpers/apiEndpoints'
import BlogPostSkeleton from './blog-post-skeleton'

export default function BlogPost({ id }: any) {
  const { data, isFetching }: any = useQueryHook(BLOGS_URL, {
    id: `eq.${id}`,
  })

  return (
    <>
      {isFetching ? (
        <BlogPostSkeleton />
      ) : (
        <>
          {data?.map((item: any, index: number) => (
            <div key={index}>
              {item?.banner && (
                <Image
                  alt="Banner"
                  src={item?.banner || '/placeholder.png'}
                  width={100}
                  height={100}
                  className="w-full rounded"
                />
              )}
              <h4>{item?.title}</h4>
              <p>{item?.description}</p>
            </div>
          ))}
        </>
      )}
    </>
  )
}
