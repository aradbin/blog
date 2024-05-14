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
        <Card className="h-[auto] w-full cursor-pointer rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
            <CardTitle className="text-base font-medium">{company?.code}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col gap-1 p-3">
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

      <DialogContent className="max-w-72 w-11/12 p-0 sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <DialogHeader className="items-center p-6 pb-2">
          <DialogTitle>{company?.code}</DialogTitle>
          <DialogDescription>{company?.name}</DialogDescription>
          <div className="flex flex-row justify-center gap-1 sm:justify-start">
            {company?.category && <Badge className="rounded-lg">{company?.category}</Badge>}
            {company?.sector && <Badge className="rounded-lg">{company?.sector}</Badge>}
            {company?.indexes?.map((item: string, index: number) => (
              <Badge key={index} className="rounded-lg">
                {item}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <Separator />

        <DialogTitle className="text-center">৳ {company?.price}</DialogTitle>

        <Separator />

        <div className="flex flex-row justify-evenly">
          <div className="text-center">
            <DialogTitle className={getEpsColor(company?.eps)}>{company?.eps}</DialogTitle>
            <DialogDescription>EPS</DialogDescription>
          </div>
          <Separator orientation="vertical" />
          <div className="text-center">
            <DialogTitle className={getPeColor(company?.pe)}>{company?.pe}</DialogTitle>
            <DialogDescription>P/E</DialogDescription>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row justify-evenly">
          <div className="text-center">
            <DialogTitle className={getPeColor(company?.pe)}>{company?.pe_audited}</DialogTitle>
            <DialogDescription>Audited P/E</DialogDescription>
          </div>
          <Separator orientation="vertical" />
          <div className="text-center">
            <DialogTitle className={getPeColor(company?.pe)}>{company?.pe_unaudited}</DialogTitle>
            <DialogDescription>Unaudited P/E</DialogDescription>
          </div>
        </div>

        <Separator />

        <div className="flex flex-row justify-evenly">
          <div className="text-center">
            <DialogTitle className={getNavColor(company?.nav)}>{company?.nav}</DialogTitle>
            <DialogDescription>NAV</DialogDescription>
          </div>
          <Separator orientation="vertical" />
          <div className="text-center">
            <DialogTitle className={getPriceNavColor(company?.nav_price)}>{company?.nav_price}</DialogTitle>
            <DialogDescription>Price/NAV</DialogDescription>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex-row justify-end gap-2">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
