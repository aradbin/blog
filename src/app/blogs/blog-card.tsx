import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import placeholder from './../../../public/placeholder.png'
import Link from 'next/link'

export default function BlogCard({ blog }: any) {
  return (
    <Link href={`/blogs/${blog?.id}`}>
      <Card className="h-[350px] w-full rounded-xl">
        <CardHeader className="p-0">
          {/* <Image
            alt="Banner"
            src={blog?.banner || placeholder}
            className="h-[200px] w-full rounded-t-xl"
            placeholder="blur"
          /> */}
        </CardHeader>
        <CardContent>
          <h2 className="pt-2">{blog?.title}</h2>
        </CardContent>
      </Card>
    </Link>
  )
}
