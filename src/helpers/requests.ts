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

export async function getRequest(url: string, query: any = {}) {
  const cookieStore = cookies()

  let select = '*'
  if (query?.hasOwnProperty('select')) {
    select = query?.select
  }

  const supabase = createServerClient(cookieStore)
    .from(url)
    .select(select, query?.count || {})

  if (query?.hasOwnProperty('filters') && Array.isArray(query?.filters)) {
    query?.filters.forEach((filter: any) => {
      if (filter?.type === 'is') {
        supabase.is(filter?.column, filter?.value)
      }
      if (filter?.type === 'eq') {
        supabase.eq(filter?.column, filter?.value)
      }
      if (filter?.type === 'neq') {
        supabase.neq(filter?.column, filter?.value)
      }
    })
  }

  if (query?.hasOwnProperty('order')) {
    supabase.order(query?.order, { ascending: query?.sort === 'desc' ? false : true })
  } else {
    supabase.order('created_at', { ascending: false })
  }

  if (query?.hasOwnProperty('limit') && query?.hasOwnProperty('offset')) {
    supabase.range(query?.offset, query?.offset + query?.limit - 1)
  }

  if (query?.hasOwnProperty('id')) {
    supabase.eq('id', query?.id).single()
  }

  const response = await supabase

  if (response?.error) {
    catchError(response?.error)
  }

  return response
}

export async function getRequestLocal(url: string, query: any = {}) {
  return await fetch(`${baseUrlLocal}${url}${Object.keys(query).length > 0 ? `?${stringifyRequestQuery(query)}` : ''}`)
    .then((response) => response.json())
    .catch((error) => {
      catchError(error)
    })
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

export async function createRequest(url: string, values: any) {
  const cookieStore = cookies()
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

export async function updateRequest(url: string, id: number, values: any) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const response = await supabase.from(url).update(values).eq('id', id)

  if (response?.error) {
    catchError(response?.error)
  }

  return response
}

export async function upsertRequest(url: string, values: any) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const response = await supabase.from(url).upsert(values)

  if (response?.error) {
    catchError(response?.error)
  }

  return response
}

export async function deleteRequest(url: string, id: any) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const response = await supabase.from(url).delete().eq('id', id)

  if (response?.error) {
    catchError(response?.error)
  }

  return response
}

const catchError = (error: any) => {
  console.log('catchError', error)
}
