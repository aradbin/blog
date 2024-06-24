'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PORTFOLIO_URL } from '@/helpers/apiEndpoints'
import { Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { useGetUserHook, useQueryHook, useRequestHook } from '@/helpers/hooks'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import InputField from '../common/input-field'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { getUser } from '@/app/(auth)/actions'

export const SelectPortfolio = ({ value, onChangeHandler }: any) => {
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
  const queryClient = useQueryClient()
  const buttonRef = useRef<any>(null)
  const { create: createPortfolio, isLoading: createPortfolioLoading } = useRequestHook(PORTFOLIO_URL)

  const formSchema = z.object({
    user_id: z.string(),
    name: z.string().min(1, { message: 'Name is required' }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: user?.id,
      name: '',
    },
  })

  const fields = [
    {
      name: 'name',
      label: 'Portfolio Name',
    },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const portfolioResponse = await createPortfolio(values)

    if (portfolioResponse.status === 201) {
      toast.success('Portfolio added successfully')
      form.reset()
      queryClient.refetchQueries({ queryKey: [PORTFOLIO_URL, {}] })
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
          <DialogTitle>Add Portfolio</DialogTitle>
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

              {!createPortfolioLoading ? (
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
