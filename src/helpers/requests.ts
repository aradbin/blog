'use server'
import axios, { AxiosResponse } from 'axios'
import { stringifyRequestQuery } from './utils'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

const baseUrlLocal = process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:3000'
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''
const headers = { apiKey: apiKey }

axios.defaults.baseURL = baseUrl
axios.defaults.headers.common['apiKey'] = apiKey

const cookieStore = cookies()

export async function getRequest(url: string, query: any = {}) {
  const supabase = createServerClient(cookieStore).from(url).select('*')

  if (query?.hasOwnProperty('limit') && query?.hasOwnProperty('offset')) {
    supabase.range(query?.offset, query?.offset + query?.limit - 1)
  }

  if (query?.hasOwnProperty('order')) {
    supabase.order(query?.order?.split('.')[0], { ascending: query?.order?.split('.')[1] === 'desc' ? false : true })
  } else {
    supabase.order('created_at', { ascending: false })
  }

  if (query?.hasOwnProperty('id')) {
    console.log(query?.id)
    supabase.eq('id', query?.id)
  }

  const response = await supabase

  if (response?.error) {
    catchError(response?.error)
  }

  return response
}

export async function getRequestFetch(url: string, query: any = {}) {
  return await fetch(`${baseUrl}${url}${Object.keys(query).length > 0 ? `?${stringifyRequestQuery(query)}` : ''}`, {
    headers: headers,
  })
    .then((response) => response.json())
    .catch((error) => {
      catchError(error)
    })
}

export async function getRequestAxios(url: string, query: any = {}) {
  return await axios
    .get(`${url}${Object.keys(query).length > 0 ? `?${stringifyRequestQuery(query)}` : ''}`)
    .then((d: AxiosResponse<any>) => {
      return d.data
    })
    .catch((error) => {
      catchError(error)
    })
}

export async function getRequestLocal(url: string, query: any = {}) {
  return await fetch(`${baseUrlLocal}${url}${Object.keys(query).length > 0 ? `?${stringifyRequestQuery(query)}` : ''}`)
    .then((response) => response.json())
    .catch((error) => {
      catchError(error)
    })
}

export async function createRequest(url: string, values: any) {
  const supabase = createServerClient(cookieStore)
  const response = await supabase.from(url).insert(values)

  if (response?.error) {
    catchError(response?.error)
  }

  return response
}

export async function createRequestWithFile(url: string, values: any) {
  return await axios
    .post(url, values, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .catch((error) => {
      catchError(error)
    })
}

export async function updateRequest(url: string, values: any) {
  return await axios.patch(url, values).catch((error) => {
    catchError(error)
  })
}

export async function upsertRequest(url: string, values: any) {
  const supabase = createServerClient(cookieStore)
  const response = await supabase.from(url).upsert(values)

  if (response?.error) {
    catchError(response?.error)
  }

  return response
}

export async function deleteRequest(url: string) {
  return await axios.delete(url).catch((error) => {
    catchError(error)
  })
}

const catchError = (error: any) => {
  console.log(error)
  // if(error?.response?.data?.statusCode===401){
  //   toast.error(error?.response?.data?.message)
  //   window.location.replace('/auth')
  // }else if(error?.response?.data?.statusCode===409){
  //   toast.error(error?.response?.data?.message)
  // }else if(error?.response?.data?.statusCode===400){
  //   error?.response?.data?.message?.map((item: string) => {
  //     toast.error(item)
  //   })
  // }else if(error?.response?.data?.statusCode===404){
  //   toast.error(error?.response?.data?.message)
  // }else{
  //   toast.error('Something went wrong. Please try again')
  // }
  // toast.error(error?.response?.data?.message)
}
