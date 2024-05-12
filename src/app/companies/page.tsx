'use client'
import { COMPANIES_URL } from '@/helpers/apiEndpoints'
import { useEffect, useState } from 'react'
import { getRequest } from '@/helpers/requests'
import { Search } from 'lucide-react'
import CompanyCard from '@/components/company/company-card'
import CompanyCardSkeleton from '@/components/company/company-card-skeleton'
import { Input } from '@/components/ui/input'

export default function Page(params: any) {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<any>([])

  useEffect(() => {
    getCompanies()
  }, [keyword])

  const getCompanies = async () => {
    setLoading(true)
    let initialCompanies = []
    if (localStorage.getItem('companies')) {
      initialCompanies = JSON.parse(localStorage.getItem('companies') || '[]')
    } else {
      initialCompanies = await getRequest(COMPANIES_URL, { ...params?.searchParams, order: 'code.asc' }).then(
        (response) => {
          if (response?.length > 0) {
            localStorage.setItem('companies', JSON.stringify(response))
          }
          return response
        },
      )
    }
    const filteredCompanies = initialCompanies?.filter(
      (item: any) => item?.code?.toLowerCase().includes(keyword?.toLowerCase()),
    )
    setCompanies(filteredCompanies)
    setLoading(false)
  }

  // const call = async () => {
  //   const response = await getRequestLocal(`/api/dse/sync`)

  //   const companiesToUpdate: any[] = []
  //   const companiesToCreate: any[] = []

  //   for (const company of response.companies) {
  //     const matched = data?.find((item: any) => item.code === company.code)

  //     if (matched) {
  //       companiesToUpdate.push({
  //         id: matched.id,
  //         code: company.code,
  //         price: parseFloat(company.price.replace(/,/g, '')),
  //         market: 'dse',
  //         category: company.category,
  //         sector: company.sector,
  //         indexes: company.indexes
  //       })
  //     } else {
  //       companiesToCreate.push({
  //         code: company.code,
  //         price: parseFloat(company.price.replace(/,/g, '')),
  //         market: 'dse',
  //         category: company.category,
  //         sector: company.sector,
  //         indexes: company.indexes
  //       })
  //     }
  //   }

  //   await upsertRequest(COMPANIES_URL, companiesToUpdate)
  //   await createRequest(COMPANIES_URL, companiesToCreate)
  //   refetch()
  // }

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
        {/* <Button variant={'default'} onClick={() => call()} className="w-[100px]">
          Sync
        </Button> */}
      </div>
      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {companies?.map((item: any, index: number) => <CompanyCard key={index} company={item} />)}
        {loading && <CompanyCardSkeleton count={20} />}
      </div>
    </section>
  )
}
