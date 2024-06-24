'use client'
import { PORTFOLIO_INSTRUMENTS_URL, TRANSACTION_URL } from '@/helpers/apiEndpoints'
import { DataTable } from '../common/data-table'
import { PortfolioInstrumentColumns, TransactionColumns } from './portfolio-columns'
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
import { useQueryHook, useRequestHook } from '@/helpers/hooks'
import { Loader2 } from 'lucide-react'
import {
  calculatePortfolioAmount,
  calculatePortfolioQuantity,
  getInstrumentOptions,
  getPortfolioPercentage,
} from '@/helpers/utils'
import { useQueryClient } from '@tanstack/react-query'
import PortfolioChart from '../chart/portfolio-chart'
import { PortfolioChartSkeleton } from './portfolio-skeleton'

export const Portfolio = ({ portfolio }: any) => {
  const [refetch, setRefetch] = useState(1)
  const [chart, setChart] = useState([])
  const [query, setQuery] = useState<any>({
    select: '*',
    count: { count: 'exact' },
    filters: [{ type: 'eq', column: 'portfolio_id', value: portfolio.id }],
  })

  const queryClient = useQueryClient()
  const { data, isFetching }: any = useQueryHook(PORTFOLIO_INSTRUMENTS_URL, query)

  useEffect(() => {
    if (refetch > 1) {
      queryClient.refetchQueries({ queryKey: [PORTFOLIO_INSTRUMENTS_URL, query] })
    }
  }, [refetch])

  useEffect(() => {
    if (data?.data) {
      const chartData = data?.data?.map((item: any) => {
        const percentage = getPortfolioPercentage(data?.data, item)
        return {
          id: item?.instrument,
          label: item?.instrument,
          value: percentage,
        }
      })
      console.log('chartData', chartData)
      setChart(chartData)
    }
  }, [data])

  return (
    <section className="flex flex-col gap-4">
      <Card className="flex w-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h6 className="text-center">{portfolio.name}</h6>
        </div>
        {chart?.length ? <PortfolioChart data={chart} /> : <>{isFetching ? <PortfolioChartSkeleton /> : <></>}</>}
      </Card>

      <Card className="flex w-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h6 className="text-center">Instruments</h6>
        </div>
        <DataTable
          columns={PortfolioInstrumentColumns}
          url={PORTFOLIO_INSTRUMENTS_URL}
          query={{
            select: '*',
            count: { count: 'exact' },
            filters: [{ type: 'eq', column: 'portfolio_id', value: portfolio.id }],
          }}
          refetch={refetch}
        />
      </Card>

      <Card className="flex w-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h6 className="text-center">Transactions</h6>
          <AddTransaction
            portfolio={portfolio}
            portfolioInstruments={data?.data || []}
            setRefetch={() => setRefetch(refetch + 1)}
          />
        </div>
        <DataTable
          columns={TransactionColumns}
          url={TRANSACTION_URL}
          query={{
            select: '*',
            count: { count: 'exact' },
            filters: [{ type: 'eq', column: 'portfolio_id', value: portfolio.id }],
          }}
          refetch={refetch}
        />
      </Card>
    </section>
  )
}

const AddTransaction = ({ portfolio, portfolioInstruments, setRefetch }: any) => {
  const [instrumentOptions, setInstrumentOptions] = useState([])
  const [portfolioinstrumentOptions, setPortfolioInstrumentOptions] = useState<any>([])
  const buttonRef = useRef<any>(null)
  const { create: createTransaction, isLoading: createTransactionLoading } = useRequestHook(TRANSACTION_URL)
  const {
    create: createInstrument,
    update: updateInstrument,
    isLoading: createInstrumentLoading,
  } = useRequestHook(PORTFOLIO_INSTRUMENTS_URL)

  const formSchema = z.object({
    portfolio_id: z.number(),
    type: z.string().min(1, { message: 'Type is required' }),
    instrument: z.string().optional(),
    quantity: z.string().optional(),
    amount: z.string().optional(),
    charge: z.string().optional(),
    commission: z.string().optional(),
    tax: z.string().optional(),
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
      charge: '0',
      commission: '0',
      tax: '0',
      date: new Date(),
    },
  })

  useEffect(() => {
    form.setValue('portfolio_id', portfolio.id)
  }, [portfolio])

  useEffect(() => {
    const filtered = portfolioInstruments?.filter((item: any) => item?.instrument !== 'CASH')
    const options = filtered?.map((item: any) => {
      return {
        label: item.instrument,
        value: item.instrument,
      }
    })
    setPortfolioInstrumentOptions(options)
  }, [portfolioInstruments])

  useEffect(() => {
    getCompanies()
  }, [])

  const getCompanies = async () => {
    const options = await getInstrumentOptions()
    setInstrumentOptions(options)
  }

  const fields = [
    {
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
          form.setValue('instrument', '')
        }
      },
    },
    {
      name: 'instrument',
      label: 'Instrument',
      type: 'searchable-select',
      options: form.watch().type === 'buy' ? instrumentOptions : portfolioinstrumentOptions,
      placeholder: 'Select Instrument',
      hide: form.watch().type === '' || form.watch().type === 'deposit' || form.watch().type === 'withdrawal',
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      hide: form.watch().type === '' || form.watch().type === 'deposit' || form.watch().type === 'withdrawal',
    },
    {
      name: 'amount',
      label: form.watch().type === 'buy' || form.watch().type === 'sell' ? 'Price per unit' : 'Amount',
      type: 'number',
    },
    {
      name: 'charge',
      label: 'Charge',
      type: 'number',
      hide: form.watch().type !== 'deposit' && form.watch().type !== 'withdrawal',
    },
    {
      name: 'commission',
      label: 'Commission',
      type: 'number',
      hide: form.watch().type !== 'buy' && form.watch().type !== 'sell',
    },
    {
      name: 'tax',
      label: 'Tax',
      type: 'number',
      hide: form.watch().type !== 'dividend',
    },
    { name: 'date', label: 'Date', type: 'date' },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      portfolio_id: values.portfolio_id,
      type: values.type,
      instrument: values.instrument,
      quantity: values.quantity,
      amount: values.amount,
      date: values.date,
      metadata: {
        expenses: {
          charge: parseFloat(values.charge || '0'),
          commission: parseFloat(values.commission || '0'),
          tax: parseFloat(values.tax || '0'),
        },
      },
    }
    const response = await createTransaction(formData)
    if (response.status === 201) {
      const has = portfolioInstruments?.find((instrument: any) => instrument.instrument === values.instrument)
      if (has) {
        const portfolioResponse = await updateInstrument(has.id, {
          quantity: calculatePortfolioQuantity(values.type, parseInt(values.quantity || '1'), has.quantity),
          amount: calculatePortfolioAmount(
            values.type,
            parseFloat(values.amount || '1'),
            has.amount,
            parseInt(values.quantity || '1'),
            has.quantity,
          ),
          metadata: {
            expenses: {
              charge: parseFloat(values.charge || '0') + (has?.metadata?.expenses?.charge || 0),
              commission: parseFloat(values.commission || '0') + (has?.metadata?.expenses?.commission || 0),
              tax: parseFloat(values.tax || '0') + (has?.metadata?.expenses?.tax || 0),
            },
          },
        })
        if (portfolioResponse.status === 204) {
          success()
        }
      } else {
        const portfolioResponse = await createInstrument({
          portfolio_id: portfolio.id,
          instrument: values.instrument,
          quantity: values.quantity,
          amount: values.amount,
          metadata: {
            expenses: {
              charge: parseFloat(values.charge || '0'),
              commission: parseFloat(values.commission || '0'),
              tax: parseFloat(values.tax || '0'),
            },
          },
        })
        if (portfolioResponse.status === 201) {
          success()
        }
      }
    }
  }

  const success = () => {
    toast.success('Transaction added successfully')
    form.reset()
    setRefetch()
    buttonRef?.current?.click()
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
                <InputField key={index} form={form} props={field} />
              ))}

              {!(createTransactionLoading || createInstrumentLoading) ? (
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
