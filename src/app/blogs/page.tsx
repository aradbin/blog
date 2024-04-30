'use client'
import { BLOGS_URL } from '@/helpers/apiEndpoints'
import useQueryHook from '@/helpers/useQueryHook'
import SkeletonBlogCard from './skeleton-blog-card'
import BlogCard from './blog-card'
import { useEffect, useState } from 'react'

export default function Blogs({ searchParams }: any) {
  const [blogs, setBlogs] = useState<any>([])
  const { data, isLoading, error }: any = useQueryHook('blogs', BLOGS_URL, {
    limit: 10,
    offset: 0,
  })

  useEffect(() => {
    if (
      data !== undefined &&
      data?.length > 0 &&
      JSON.stringify(blogs) !== JSON.stringify(data)
    ) {
      setBlogs((prevBlogs: any) => [...prevBlogs, ...data])
    }
  }, [data])

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {isLoading ? (
        <SkeletonBlogCard count={6} />
      ) : (
        <>
          {blogs?.map((item: any, index: number) => (
            <BlogCard key={index} blog={item} />
          ))}
        </>
      )}
    </div>
  )
}
