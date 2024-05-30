import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import RegisterForm from './register-form'
import { getUser } from '../actions'

export default async function Register() {
  const user = await getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Card className="mx-auto w-full max-w-sm rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Enter your email below to register</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-row gap-2">
              <Button variant="outline" className="w-full">
                Facebook
              </Button>
              <Button variant="outline" className="w-full">
                Google
              </Button>
            </div>
            <RegisterForm />
          </div>
          <div className="mt-4 text-center text-sm">
            Already registered?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
