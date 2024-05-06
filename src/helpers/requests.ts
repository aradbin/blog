'use server'

import axios, { AxiosResponse } from 'axios'
import { stringifyRequestQuery } from './utils'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const headers = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
}

axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
axios.defaults.headers.common['apiKey'] = process.env.NEXT_PUBLIC_API_KEY || ''

export async function getRequest(url: string, query: any = {}) {
  return await fetch(
    `${baseUrl}${url}${
      Object.keys(query).length > 0 ? `?${stringifyRequestQuery(query)}` : ''
    }`,
    {
      headers: headers,
    },
  )
    .then(async (response) => {
      const data = await response.json()
      return data
    })
    .catch((error) => {
      catchError(error)
    })
}

export async function getRequestAxios(url: string, query: any = {}) {
  return await axios
    .get(
      `${url}${
        Object.keys(query).length > 0 ? `?${stringifyRequestQuery(query)}` : ''
      }`,
    )
    .then((d: AxiosResponse<any>) => {
      return d.data
    })
    .catch((error) => {
      catchError(error)
    })
}

export async function createRequest(url: string, values: any) {
  return await axios.post(url, values).catch((error) => {
    catchError(error)
  })
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
