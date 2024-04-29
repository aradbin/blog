'use server'

import { createServerClient } from '@/utils/supabase'
import { cookies, headers } from 'next/headers'

export async function signUp(values: any) {
    const origin = headers().get('origin')
    const email = values.email
    const password = values.password
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
        return {
            status: 'error',
            message: "Something went wrong. Please try again",
        }
    }

    return {
        status: 'success',
        message: 'Login successful',
    }
}

export async function signIn(values: any) {
    const email = values.email
    const password = values.password
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
        return {
            status: 'error',
            message: 'User credentials did not match. Please try again',
        }
    }

    return {
        status: 'success',
        message: 'Login successful',
    }
}