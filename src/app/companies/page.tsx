'use client'
import { COMPANIES_URL } from '@/helpers/apiEndpoints'
import { useEffect, useState } from 'react'
import { useQueryHook } from '@/helpers/useQueryHook'
import { createRequest, getRequestLocal, upsertRequest } from '@/helpers/requests'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import CompanyCard from '@/components/company/company-card'
import CompanyCardSkeleton from '@/components/company/company-card-skeleton'
import { Input } from '@/components/ui/input'

export default function Page(params: any) {
  const [companies, setCompanies] = useState<any>([])
  const [keyword, setKeyword] = useState('')
  const { data, isFetching }: any = useQueryHook(COMPANIES_URL, { ...params?.searchParams, order: 'name.asc' })

  useEffect(() => {
    setKeyword('')
  }, [])

  useEffect(() => {
    const filteredCompanies = data?.filter((item: any) => item.name.toLowerCase().includes(keyword.toLowerCase()))
    setCompanies(filteredCompanies)
  }, [data, keyword])

  const call = async () => {
    const categories = ['A', 'B', 'G', 'N', 'Z']
    categories.map(async (category) => {
      const response = await getRequestLocal(`/api/dse/sync/category/${category}`)

      const has: any[] = []
      const hasNot: any[] = []

      response?.companies?.map((company: any) => {
        let matched: any = null
        data?.map((item: any) => {
          if (item.name === company.name) {
            matched = item
          }
        })
        if (matched) {
          has.push({
            id: matched.id,
            name: company.name,
            price: parseFloat(company.price.replace(/,/g, '')),
            market: 'dse',
            category: category,
          })
        } else {
          hasNot.push({
            name: company.name,
            price: parseFloat(company.price.replace(/,/g, '')),
            market: 'dse',
            category: category,
          })
        }
      })

      await upsertRequest(COMPANIES_URL, has)
      await createRequest(COMPANIES_URL, hasNot)
    })
  }

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Company"
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value.toLowerCase())
            }}
          />
        </div>
        <Button variant={'default'} onClick={() => call()} className="w-[100px]">
          Sync
        </Button>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {companies?.map((item: any, index: number) => <CompanyCard key={index} company={item} />)}
        {isFetching && <CompanyCardSkeleton count={20} />}
      </div>
    </section>
  )
}
