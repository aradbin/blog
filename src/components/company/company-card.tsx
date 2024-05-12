import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function CompanyCard({ company }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="h-[115px] w-full rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
            <CardTitle className="text-base font-medium">{company?.code}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-1 p-2">
            {/* <div>
              <Badge className="rounded-lg">{company?.category}</Badge>
            </div> */}
            {/* <div>
              {company?.indexes?.map((item: string, index: number) => <Badge key={index} className="rounded-lg">{item}</Badge>)}
            </div> */}
            {/* <div>
              <Badge className="rounded-lg">{company?.sector}</Badge>
            </div> */}
            <div>৳ {company?.price}</div>
          </CardContent>
          {/* <Separator /> */}
          {/* <CardFooter className="flex justify-between overflow-hidden p-4"></CardFooter> */}
        </Card>
      </DialogTrigger>

      <DialogContent className="p-0">
        <DialogHeader className="p-6">
          <DialogTitle>{company?.code}</DialogTitle>
          <DialogDescription>{company?.name}</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="p-6"></div>
        {/* <DialogFooter className='flex-row justify-end gap-2'>
          <Button type="button" variant="secondary" className='bg-green-700'>Buy</Button>
          <Button type="button" variant="secondary" className='bg-red-700'>Sell</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
