"use client"
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from '../actions'

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Provide valid email address"}),
    password: z.string().min(1, { message: "Password is required" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    signIn(values).then((response) => {
      if(response.status === 'error'){
        setError(response.message)
      }else{
        router.push('/')
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-1 flex-col justify-center gap-3 text-foreground animate-in"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center'>
                <FormLabel>Password</FormLabel>
                <Link href="/forgot" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!loading ?
          <Button type="submit" className="w-full">
            Login
          </Button>
        :
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        }
        {error != "" && <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>}
      </form>
    </Form>
  )
}
