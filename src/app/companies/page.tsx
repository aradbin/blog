'use client'
import { COMPANIES_URL } from '@/helpers/apiEndpoints'
import { useEffect, useState } from 'react'
import { createRequest, getRequest, getRequestLocal, upsertRequest } from '@/helpers/requests'
import { Search } from 'lucide-react'
import CompanyCard from '@/components/company/company-card'
import CompanyCardSkeleton from '@/components/company/company-card-skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Page(params: any) {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState<any>([])

  useEffect(() => {
    getCompanies()
  }, [keyword])

  const getCompanies = async (force = false) => {
    setLoading(true)
    let initialCompanies = []
    if (localStorage.getItem('companies') && !force) {
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
      (item: any) =>
        item?.code?.toLowerCase().includes(keyword?.toLowerCase()) ||
        item?.name?.toLowerCase().includes(keyword?.toLowerCase()),
    )
    setCompanies(filteredCompanies)
    setLoading(false)
  }

  const sync = async () => {
    const response = await getRequestLocal(`/api/dse/sync`)
    console.log(response?.companies[87].FullName)
    const currentCompanies = await getRequest(COMPANIES_URL)

    const companiesToUpdate: any[] = []
    const companiesToCreate: any[] = []

    for (const company of response.companies) {
      const matched = currentCompanies?.find((item: any) => item.code === company.code)

      const payload = {
        market: 'dse',
        code: company.code,
        price: parseFloat(company.price.replace(/,/g, '')),
        category: company.category,
        indexes: company.indexes || null,
        name: company.FullName || null,
        sector: company.BusinessSegment || null,
        eps: company.Eps || 0,
        pe: company.PE || 0,
        pe_audited: company.AuditedPE || 0,
        pe_unaudited: company.UnAuditedPE || 0,
        nav: company.NAV || 0,
        nav_price: company.NavPrice || 0,
      }

      if (matched) {
        companiesToUpdate.push({
          id: matched.id,
          ...payload,
        })
      } else {
        companiesToCreate.push(payload)
      }
    }

    await upsertRequest(COMPANIES_URL, companiesToUpdate)
    await createRequest(COMPANIES_URL, companiesToCreate)
    getCompanies(true)
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
        <Button variant={'default'} onClick={() => sync()} className="w-[100px]">
          Sync
        </Button>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {companies?.map((item: any, index: number) => <CompanyCard key={index} company={item} />)}
        {loading && <CompanyCardSkeleton count={20} />}
      </div>
    </section>
  )
}
