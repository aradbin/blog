'use client'
import { ASSETS_URL, INSTRUMENTS_URL, DSE_SYNC_URL } from '@/helpers/apiEndpoints'
import { useEffect, useState } from 'react'
import { createRequest, getRequest, getRequestLocal, upsertRequest } from '@/helpers/requests'
import { FilterIcon, RefreshCw, Search } from 'lucide-react'
import CompanyCard from '@/components/company/company-card'
import CompanyCardSkeleton from '@/components/company/company-card-skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function Page(params: any) {
  const [filter, setFilter] = useState({ keyword: '', category: 'select', sector: 'select', index: 'select' })
  const [loading, setLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [companies, setCompanies] = useState<any>([])
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [sectorOptions, setSectorOptions] = useState<string[]>([])
  const indexOptions = ['DSEX', 'DS30']

  useEffect(() => {
    getCompanies()
  }, [filter])

  const getCompanies = async (force = false) => {
    setLoading(true)
    let initialCompanies = []
    if (localStorage.getItem('companies') && !force) {
      initialCompanies = JSON.parse(localStorage.getItem('companies') || '[]')
    } else {
      initialCompanies = await getRequest(INSTRUMENTS_URL, { ...params?.searchParams, order: 'name' }).then(
        (response) => {
          if (response?.data?.length && response?.data?.length > 0) {
            localStorage.setItem('companies', JSON.stringify(response?.data))
          }
          return response?.data || []
        },
      )
    }
    const categories: string[] = []
    const sectors: string[] = []
    const filteredCompanies = initialCompanies?.filter((item: any) => {
      if (item?.metadata?.category && !categories.includes(item?.metadata?.category)) {
        categories.push(item?.metadata?.category)
      }
      if (item?.metadata?.sector && !sectors.includes(item?.metadata?.sector)) {
        sectors.push(item?.metadata?.sector)
      }
      let matched = true
      if (
        filter?.keyword &&
        !item?.name?.toLowerCase().includes(filter?.keyword?.toLowerCase()) &&
        !item?.metadata?.full_name?.toLowerCase().includes(filter?.keyword?.toLowerCase())
      ) {
        matched = false
      }
      if (filter?.category !== 'select' && item?.metadata?.category !== filter?.category) {
        matched = false
      }
      if (filter?.sector !== 'select' && item?.metadata?.sector !== filter?.sector) {
        matched = false
      }
      if (filter?.index !== 'select' && !item?.metadata?.indexes?.includes(filter?.index)) {
        matched = false
      }
      if (matched) {
        return item
      }
    })
    setSectorOptions(sectors)
    setCategoryOptions(categories)
    setCompanies(filteredCompanies)
    setLoading(false)
  }

  const sync = async () => {
    setSyncLoading(true)
    const assets = await getRequest(ASSETS_URL)
    const dse: any = assets?.data?.find((item: any) => item?.metadata?.slug === 'dse')
    if (dse) {
      const response = await getRequestLocal(DSE_SYNC_URL)
      const currentCompanies = await getRequest(INSTRUMENTS_URL)

      const companiesToUpdate: any[] = []
      const companiesToCreate: any[] = []

      for (const company of response.companies) {
        const matched: any = currentCompanies?.data?.find((item: any) => item.name === company.code)

        const payload = {
          asset_id: dse?.id,
          name: company?.code,
          metadata: {
            price: parseFloat(company?.LTP) || 0,
            category: company?.category,
            indexes: company?.indexes || null,
            full_name: company?.FullName || null,
            sector: company?.BusinessSegment || null,
            eps: company?.Eps || 0,
            pe: company?.PE || 0,
            pe_audited: company?.AuditedPE || 0,
            pe_unaudited: company?.UnAuditedPE || 0,
            nav: company?.NAV || 0,
            nav_price: company?.NavPrice || 0,
          },
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

      await upsertRequest(INSTRUMENTS_URL, companiesToUpdate)
      await createRequest(INSTRUMENTS_URL, companiesToCreate)
      setSyncLoading(false)
      getCompanies(true)
    }
  }

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-row justify-between gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Company"
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            value={filter?.keyword}
            onChange={(e) => {
              setFilter((prev: any) => {
                return { ...prev, keyword: e.target.value.toLowerCase() }
              })
            }}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className="w-1/2 dark:bg-black md:w-[100px]">
              <FilterIcon size={15} className="mr-2" /> Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-4">
            <SelectComponent
              label="Category"
              value={filter?.category}
              onValueChange={(e: string) => {
                setFilter((prev: any) => {
                  return { ...prev, category: e }
                })
              }}
              options={categoryOptions}
            />
            <SelectComponent
              label="Sector"
              value={filter?.sector}
              onValueChange={(e: string) => {
                setFilter((prev: any) => {
                  return { ...prev, sector: e }
                })
              }}
              options={sectorOptions}
            />
            <SelectComponent
              label="Index"
              value={filter?.index}
              onValueChange={(e: string) => {
                setFilter((prev: any) => {
                  return { ...prev, index: e }
                })
              }}
              options={indexOptions}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
        {companies?.map((item: any, index: number) => <CompanyCard key={index} company={item} />)}
        {loading && <CompanyCardSkeleton count={20} />}
      </div>
      <Button variant={'default'} size="icon" onClick={() => sync()} className="fixed bottom-3 right-3 rounded-full">
        <RefreshCw className={syncLoading ? 'animate-spin' : ''} />
      </Button>
    </section>
  )
}

export const SelectComponent = ({ label, value, onValueChange, options }: any) => {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select
        value={value}
        onValueChange={(e: string) => {
          onValueChange(e)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="select">Select {label}</SelectItem>
            {options?.map((item: string) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
