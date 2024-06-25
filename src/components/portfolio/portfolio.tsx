'use client'
import { PORTFOLIO_INSTRUMENTS_URL, PORTFOLIO_TRANSACTION_URL } from '@/helpers/apiEndpoints'
import { DataTable } from '../common/data-table'
import { PortfolioInstrumentColumns, PortfolioTransactionColumns } from './portfolio-columns'
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
  calculatePortfolioInstrumentNewAmount,
  calculatePortfolioInstrumentNewQuantity,
  getInstrumentOptions,
  getPortfolioInstrumentPercentage,
} from '@/helpers/utils'
import { useQueryClient } from '@tanstack/react-query'
import PortfolioChart from '../chart/portfolio-chart'
import { PortfolioSkeleton } from './portfolio-skeleton'
import {
  portfolioTransactionDefaultValues,
  portfolioTransactionFields,
  portfolioTransactionSchema,
} from './portfolio-fields'
import Modal from '../common/modal'
import FormComponent from '../common/form-component'

export const Portfolio = ({ portfolio }: any) => {
  const [refetch, setRefetch] = useState(1)
  const [chart, setChart] = useState([])
  const [query, setQuery] = useState({
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
    setQuery({ ...query, filters: [{ type: 'eq', column: 'portfolio_id', value: portfolio.id }] })
  }, [portfolio])

  useEffect(() => {
    if (data?.data?.length) {
      const chartData = data?.data?.map((item: any) => {
        const percentage = getPortfolioInstrumentPercentage(data?.data, item)
        return {
          id: item?.instrument,
          label: item?.instrument,
          value: percentage,
        }
      })
      setChart(chartData)
    } else {
      setChart([])
    }
  }, [data])

  return (
    <section className="flex flex-col gap-4">
      <Card className="flex w-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h6 className="text-center">{portfolio.name}</h6>
        </div>
        {chart?.length ? <PortfolioChart data={chart} /> : <>{isFetching ? <PortfolioSkeleton /> : <></>}</>}
      </Card>

      <Card className="flex w-full flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h6 className="text-center">Instruments</h6>
        </div>
        <DataTable
          columns={PortfolioInstrumentColumns}
          url={PORTFOLIO_INSTRUMENTS_URL}
          query={query}
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
          columns={PortfolioTransactionColumns}
          url={PORTFOLIO_TRANSACTION_URL}
          query={query}
          refetch={refetch}
        />
      </Card>
    </section>
  )
}

const AddTransaction = ({ portfolio, portfolioInstruments, setRefetch }: any) => {
  const [instrumentOptions, setInstrumentOptions] = useState([])
  const [portfolioinstrumentOptions, setPortfolioInstrumentOptions] = useState<any>([])
  const [show, setShow] = useState(true)
  const [loading, setLoading] = useState(false)
  const { create: createTransaction, isLoading: createTransactionLoading } = useRequestHook(PORTFOLIO_TRANSACTION_URL)
  const {
    create: createInstrument,
    update: updateInstrument,
    isLoading: createInstrumentLoading,
  } = useRequestHook(PORTFOLIO_INSTRUMENTS_URL)

  const form = useForm<z.infer<typeof portfolioTransactionSchema>>({
    resolver: zodResolver(portfolioTransactionSchema),
    defaultValues: portfolioTransactionDefaultValues,
  })

  useEffect(() => {
    getCompanies()
  }, [])

  useEffect(() => {
    if (createInstrumentLoading || createTransactionLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [createInstrumentLoading, createTransactionLoading])

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

  const getCompanies = async () => {
    const options = await getInstrumentOptions()
    setInstrumentOptions(options)
  }

  async function onSubmit(values: z.infer<typeof portfolioTransactionSchema>) {
    const formData = {
      portfolio_id: portfolio.id,
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
        const portfolioResponse = await updateInstrument(
          has.id,
          {
            quantity: calculatePortfolioInstrumentNewQuantity(
              values.type,
              parseInt(values.quantity || '1'),
              has.quantity,
            ),
            amount: calculatePortfolioInstrumentNewAmount(
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
          },
          'Transaction added successfully',
        )
        if (portfolioResponse.status === 204) {
          success()
        }
      } else {
        const portfolioResponse = await createInstrument(
          {
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
          },
          'Transaction added successfully',
        )
        if (portfolioResponse.status === 201) {
          success()
        }
      }
    }
  }

  const success = () => {
    form.reset()
    setRefetch()
    setShow(false)
  }

  return (
    <Modal show={show} toggleShow={setShow} title="Add Transaction" btn="Add">
      <FormComponent
        form={form}
        fields={portfolioTransactionFields(form, instrumentOptions, portfolioinstrumentOptions)}
        onSubmit={onSubmit}
        loading={loading}
      />
    </Modal>
  )
}
