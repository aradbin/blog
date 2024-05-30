import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoginForm from './login-form'
import { redirect } from 'next/navigation'
import { getUser } from '../actions'

export default async function Login() {
  const user = await getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Card className="mx-auto w-full max-w-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-row gap-2">
              <Button variant="outline" className="w-full">
                Facebook
              </Button>
              <Button variant="outline" className="w-full">
                Google
              </Button>
            </div>
            <LoginForm />
          </div>
          <div className="mt-4 text-center text-sm">
            Not registered?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
