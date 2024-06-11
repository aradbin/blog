'use client'
import { TRANSACTION_URL } from '@/helpers/apiEndpoints'
import { DataTable } from '../common/data-table'
import { TransactionTableColumns } from './transaction-table-columns'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import InputField from '../common/input-field'
import { transactionTypes } from '@/helpers/variables'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useCreateHook } from '@/helpers/hooks'
import { Loader2 } from 'lucide-react'
import { getInstrumentOptions } from '@/helpers/utils'

export const Portfolio = ({ portfolio }: any) => {
  const [refetch, setRefetch] = useState(1)

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center">{portfolio.name}</h1>

      <Card className="flex w-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h6 className="text-center">Transactions</h6>
          <AddTransaction portfolio={portfolio} setRefetch={() => setRefetch(refetch + 1)} />
        </div>
        <DataTable
          columns={TransactionTableColumns}
          url={TRANSACTION_URL}
          query={{ select: '*', count: { count: 'exact' } }}
          refetch={refetch}
        />
      </Card>
    </section>
  )
}

const AddTransaction = ({ portfolio, setRefetch }: any) => {
  const [instrumentOptions, setInstrumentOptions] = useState([])
  const buttonRef = useRef<any>(null)
  const { create, isLoading } = useCreateHook(TRANSACTION_URL)

  const formSchema = z.object({
    portfolio_id: z.number(),
    type: z.string().min(1, { message: 'Type is required' }),
    instrument: z.string().optional(),
    quantity: z.string().optional(),
    amount: z.string().optional(),
    date: z.date().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolio_id: portfolio.id,
      type: '',
      instrument: '',
      quantity: '1',
      amount: '1',
      date: new Date(),
    },
  })

  useEffect(() => {
    form.setValue('portfolio_id', portfolio.id)
  }, [portfolio])

  useEffect(() => {
    getCompanies()
  }, [])

  const getCompanies = async () => {
    const options = await getInstrumentOptions()
    setInstrumentOptions(options)
  }

  const fields = [
    {
      form: form,
      name: 'type',
      label: 'Type',
      type: 'select',
      options: transactionTypes,
      placeholder: 'Select Transaction Type',
      onChangeHandler: (value: any) => {
        form.setValue('type', value)
        if (value === 'deposit' || value === 'withdrawal') {
          form.setValue('instrument', 'CASH')
          form.setValue('quantity', '1')
        } else {
          if (form.watch().instrument === 'CASH') {
            form.setValue('instrument', '')
          }
        }
      },
    },
    {
      form: form,
      name: 'instrument',
      label: 'Instrument',
      type: 'select',
      options: instrumentOptions,
      placeholder: 'Select Instrument',
      hide: form.watch().type === 'deposit' || form.watch().type === 'withdrawal',
    },
    {
      form: form,
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      hide: form.watch().type === 'deposit' || form.watch().type === 'withdrawal',
    },
    {
      form: form,
      name: 'amount',
      label: form.watch().type === 'buy' || form.watch().type === 'sell' ? 'Price per unit' : 'Amount',
      type: 'number',
    },
    { form: form, name: 'date', label: 'Date', type: 'date' },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await create({ ...values })
    if (response.status === 201) {
      toast.success('Transaction added successfully')
      form.reset()
      setRefetch()
      buttonRef?.current?.click()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" ref={buttonRef}>
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-72 w-11/12 sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              className="flex w-full flex-1 flex-col justify-center gap-3 text-foreground animate-in"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {fields.map((field, index) => (
                <InputField key={index} props={field} />
              ))}
              {!isLoading ? (
                <Button type="submit">Submit</Button>
              ) : (
                <Button type="button">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
