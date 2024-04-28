"use client"
import Link from 'next/link'
// import { headers, cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import { createServerClient } from '@/utils/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export default function Login() {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  // const signIn = async (formData: FormData) => {
  //   'use server'

  //   const email = formData.get('email') as string
  //   const password = formData.get('password') as string
  //   const cookieStore = cookies()
  //   const supabase = createServerClient(cookieStore)

  //   const { error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   })

  //   if (error) {
  //     return redirect('/login?message=Could not authenticate user')
  //   }

  //   return redirect('/')
  // }

  // const signUp = async (formData: FormData) => {
  //   'use server'

  //   const origin = headers().get('origin')
  //   const email = formData.get('email') as string
  //   const password = formData.get('password') as string
  //   const cookieStore = cookies()
  //   const supabase = createServerClient(cookieStore)

  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       emailRedirectTo: `${origin}/auth/callback`,
  //     },
  //   })

  //   if (error) {
  //     return redirect('/login?message=Could not authenticate user')
  //   }

  //   return redirect('/login?message=Check email to continue sign in process')
  // }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Card className="mx-auto max-w-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-row gap-2">
              <Button variant="outline" className="w-full">
                Login with Facebook
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
