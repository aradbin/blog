import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import Placeholder from './../../../public/placeholder.jpg'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

export default function BlogCard({ blog }: any) {
  return (
    <Link href={`/blogs/${blog?.id}`}>
      <Card className="shadow-md dark:bg-black">
        <CardHeader className="h-[400px] overflow-hidden p-4">
          <Image alt="Banner" src={blog?.banner || Placeholder} className="h-[200px] w-full rounded-lg object-cover" />
          <div className="flex items-center gap-1">
            <Badge className="rounded-lg">Tag</Badge>
            <Badge className="rounded-lg">Tag</Badge>
            <Badge className="rounded-lg">Tag</Badge>
            <Badge className="rounded-lg">Tag</Badge>
          </div>
          <CardDescription className="font-semibold tracking-tight">21st May, 2024</CardDescription>
          <CardTitle className="py-2">{blog?.title}</CardTitle>
          <CardDescription>{blog?.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex-row-reverse p-4 pt-2">
          <Button variant={'link'} className="h-5 p-0 pt-1">
            Read more <ArrowRight size={15} className="ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
