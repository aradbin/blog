import { BLOGS_URL } from '@/helpers/apiEndpoints'
import BlogPostSkeleton from './blog-post-skeleton'
import Image from 'next/image'
import placeholder from './../../../../public/placeholder.png'
import { getRequest } from '@/helpers/requests'
import { Metadata } from 'next'

export async function generateMetadata(params: any): Promise<Metadata> {
  const item = await getRequest(`${BLOGS_URL}`, {
    id: `eq.${params.params.id}`,
  })
  if (item?.length > 0) {
    return {
      title: item[0]?.title,
      description: item[0]?.description,
    }
  }

  return {}
}

export default async function BlogPost(params: any) {
  const blog = await getRequest(`${BLOGS_URL}`, {
    id: `eq.${params.params.id}`,
  })
  console.log(blog)

  return (
    <div className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 2xl:w-2/5">
      {/* {data?.length > 0 && 
        <div>
          <Image
            alt="Banner"
            src={data[0]?.banner || placeholder}
            className="w-full"
            placeholder="blur"
          />
          <h4>{data[0].title}</h4>
          <p>{data[0].description}</p>  
        </div>
      } */}
      <BlogPostSkeleton />
    </div>
  )
}
