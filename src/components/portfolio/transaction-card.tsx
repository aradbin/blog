import { Card, CardContent, CardHeader } from '../ui/card'

export default function TransactionCard({ transaction }: any) {
  return (
    <Card className="shadow-md dark:bg-black">
      <CardContent className="grid w-full grid-cols-1 gap-1 py-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <h6>{transaction?.name}</h6>
        <h6>{transaction?.price * transaction?.quantity}</h6>
      </CardContent>
    </Card>
  )
}
