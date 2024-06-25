'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PORTFOLIO_URL } from '@/helpers/apiEndpoints'
import { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { useGetUserHook, useQueryHook, useRequestHook } from '@/helpers/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import Modal from '../common/modal'
import { portfolioDefaultValues, portfolioFields, portfolioSchema } from './portfolio-fields'
import FormComponent from '../common/form-component'

export const PortfolioSelect = ({ value, onChangeHandler }: any) => {
  const { data, isFetching }: any = useQueryHook(PORTFOLIO_URL)
  const { data: user } = useGetUserHook()

  useEffect(() => {
    if (!value && data?.data.length) {
      onChangeHandler(JSON.stringify(data?.data[0]))
    }
  }, [data])

  return (
    <div className="flex justify-between gap-2">
      {data ? (
        <Select value={value} onValueChange={onChangeHandler}>
          <SelectTrigger className="w-full md:w-80">
            <SelectValue placeholder="Select Portfolio" />
          </SelectTrigger>
          <SelectContent>
            {data?.data?.map((item: any) => (
              <SelectItem key={item?.id} value={JSON.stringify(item)}>
                {item?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <>{isFetching ? <Skeleton className="h-[40px] w-full" /> : <></>}</>
      )}
      {user && <AddPortfolio user={user} />}
    </div>
  )
}

export const AddPortfolio = ({ user }: any) => {
  const [show, setShow] = useState(true)

  const queryClient = useQueryClient()

  const { create: createPortfolio, isLoading: createPortfolioLoading } = useRequestHook(PORTFOLIO_URL)

  const form = useForm<z.infer<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: portfolioDefaultValues,
  })

  async function onSubmit(values: z.infer<typeof portfolioSchema>) {
    const formData = { ...values, user_id: user?.id || '' }
    const portfolioResponse = await createPortfolio(formData, 'Portfolio added successfully')
    if (portfolioResponse.status === 201) {
      form.reset()
      queryClient.refetchQueries({ queryKey: [PORTFOLIO_URL, {}] })
      setShow(false)
    }
  }

  return (
    <Modal show={show} toggleShow={setShow} title="Add Portfolio" btn="Add">
      <FormComponent form={form} fields={portfolioFields} onSubmit={onSubmit} loading={createPortfolioLoading} />
    </Modal>
  )
}
