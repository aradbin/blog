import { BLOGS_URL } from '@/helpers/apiEndpoints'
import { getRequest } from '@/helpers/requests'
import { Metadata } from 'next'
import BlogPost from '../../../components/blog/blog-post'

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

export default async function Page(params: any) {
  return (
    <div className="w-full md:w-4/5 lg:w-3/5 xl:w-2/5 2xl:w-2/5">
      <BlogPost id={params.params.id} />
    </div>
  )
}
