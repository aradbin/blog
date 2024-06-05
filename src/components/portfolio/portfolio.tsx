'use client'
import { TRANSACTION_URL } from '@/helpers/apiEndpoints'
import { useQueryHook } from '@/helpers/useQueryHook'
import TransactionCard from './transaction-card'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export const Portfolio = ({ portfolio }: any) => {
  const [instruments, setInstruments] = useState<any>([])
  const [error, setError] = useState(null)

  const { data, isFetching }: any = useQueryHook(TRANSACTION_URL, { select: '*, instruments (*)' })

  useEffect(() => {
    if (data?.error && data?.error?.message !== error) {
      toast.error('Something went wrong. Please try again')
      setError(data?.error?.message)
    }
    const arr: any = []
    data?.data?.forEach((transaction: any) => {
      let exist: any = instruments?.find((instrument: any) => instrument?.id === transaction?.instruments?.id)
      if (!exist) {
        exist = {
          id: transaction?.instruments?.id,
          name: transaction?.instruments?.name,
          quantity: transaction?.type === 'buy' ? transaction?.quantity : -transaction?.quantity,
          price: transaction?.price,
        }
      } else {
        exist.quantity += transaction?.type === 'buy' ? transaction?.quantity : -transaction?.quantity
        exist.price = transaction?.price
      }
      arr.push(exist)
    })
    setInstruments(arr)
  }, [data])

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center">{portfolio.name}</h1>
      <div className="flex w-full flex-col gap-1">
        {instruments?.map((item: any, index: number) => <TransactionCard key={index} transaction={item} />)}
      </div>
    </section>
  )
}
