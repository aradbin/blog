import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
import { getEpsColor, getNavColor, getPeColor, getPriceNavColor } from '@/helpers/utils'

export default function CompanyCard({ company }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="h-[auto] w-full cursor-pointer rounded-lg shadow dark:bg-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
            <CardTitle className="text-base font-medium">{company?.name}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-1 p-3">
            {/* <div>
              <Badge className="rounded-lg">{company?.metadata?.category}</Badge>
            </div> */}
            {/* <div>
              {company?.metadata?.indexes?.map((item: string, index: number) => <Badge key={index} className="rounded-lg">{item}</Badge>)}
            </div> */}
            {/* <div>
              <Badge className="rounded-lg">{company?.metadata?.sector}</Badge>
            </div> */}
            <div>৳ {company?.metadata?.price}</div>
          </CardContent>
          {/* <Separator /> */}
          {/* <CardFooter className="flex justify-between overflow-hidden p-4"></CardFooter> */}
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-72 w-11/12 p-0 sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <DialogHeader className="items-center p-6 pb-2">
          <DialogTitle>{company?.name}</DialogTitle>
          <DialogDescription>{company?.metadata?.full_name}</DialogDescription>
          <div className="flex flex-row justify-center gap-1 sm:justify-start">
            {company?.metadata?.category && <Badge className="rounded-lg">{company?.metadata?.category}</Badge>}
            {company?.metadata?.sector && <Badge className="rounded-lg">{company?.metadata?.sector}</Badge>}
            {company?.metadata?.indexes?.map((item: string, index: number) => (
              <Badge key={index} className="rounded-lg">
                {item}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Separator />

        <DialogTitle className="text-center">৳ {company?.metadata?.price}</DialogTitle>

        <Separator />

        <div className="flex flex-row justify-evenly">
          <div className="w-1/2 text-center">
            <DialogTitle className={getEpsColor(company?.metadata?.eps)}>{company?.metadata?.eps}</DialogTitle>
            <DialogDescription>EPS</DialogDescription>
          </div>
          <Separator orientation="vertical" />
          <div className="w-1/2 text-center">
            <DialogTitle className={getPeColor(company?.metadata?.pe)}>{company?.metadata?.pe}</DialogTitle>
            <DialogDescription>P/E</DialogDescription>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row justify-evenly">
          <div className="w-1/2 text-center">
            <DialogTitle className={getPeColor(company?.metadata?.pe)}>{company?.metadata?.pe_audited}</DialogTitle>
            <DialogDescription>Audited P/E</DialogDescription>
          </div>
          <Separator orientation="vertical" />
          <div className="w-1/2 text-center">
            <DialogTitle className={getPeColor(company?.metadata?.pe)}>{company?.metadata?.pe_unaudited}</DialogTitle>
            <DialogDescription>Unaudited P/E</DialogDescription>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row justify-evenly">
          <div className="w-1/2 text-center">
            <DialogTitle className={getNavColor(company?.metadata?.nav)}>{company?.metadata?.nav}</DialogTitle>
            <DialogDescription>NAV</DialogDescription>
          </div>
          <Separator orientation="vertical" />
          <div className="w-1/2 text-center">
            <DialogTitle className={getPriceNavColor(company?.metadata?.nav_price)}>
              {company?.metadata?.nav_price}
            </DialogTitle>
            <DialogDescription>Price/NAV</DialogDescription>
          </div>
        </div>

        <Separator />

        {/* <DialogFooter className="flex-row justify-end gap-2">
          <Button type="button" variant="secondary" className="bg-green-700">
            Buy
          </Button>
          <Button type="button" variant="secondary" className="bg-red-700">
            Sell
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
