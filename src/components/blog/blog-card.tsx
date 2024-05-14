import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import Placeholder from './../../../public/placeholder.jpg'
import { Badge } from '../ui/badge'

export default function BlogCard({ blog }: any) {
  return (
    <Link href={`/blogs/${blog?.id}`}>
      <Card className="shadow-md dark:bg-black">
        <CardHeader className="p-4">
          <Image alt="Banner" src={blog?.banner || Placeholder} className="h-[200px] w-full rounded-lg object-cover" />
          <div className="flex h-[25px] items-center gap-1 overflow-hidden">
            <Badge className="rounded-lg">Tag</Badge>
            <Badge className="rounded-lg">Tag</Badge>
            <Badge className="rounded-lg">Tag</Badge>
            <Badge className="rounded-lg">Tag</Badge>
          </div>
          <CardDescription className="font-semibold tracking-tight">21st May, 2024</CardDescription>
          <CardTitle className="h-[73px] overflow-hidden">{blog?.title}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}
