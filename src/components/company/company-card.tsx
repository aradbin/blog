import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

export default function CompanyCard({ company }: any) {
  return (
    // <Link href={`/companys/${company?.id}`}>
    <Card className="h-[170px] w-full rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-base font-medium">{company?.code}</CardTitle>
        <Badge className="rounded-lg">{company?.category}</Badge>
      </CardHeader>
      <CardContent className="p-4">
        <div>৳ {company?.price}</div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between overflow-hidden p-4">
        <Badge className="rounded-lg">{company?.sector}</Badge>
        {/* <Button size="sm" variant="outline">Cancel</Button>
        <Button size="sm">Deploy</Button> */}
      </CardFooter>
    </Card>
    // </Link>
  )
}
