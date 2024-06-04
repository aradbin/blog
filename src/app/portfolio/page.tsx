'use client'
import { useState } from 'react'
import SelectPortfolio from '@/components/portfolio/select-portfolio'
import { Portfolio } from '@/components/portfolio/portfolio'

export default function Page(params: any) {
  const [portfolio, setPortfolio] = useState('')

  return (
    <section className="flex w-full flex-col gap-4">
      <SelectPortfolio value={portfolio} onChangeHandler={(value: string) => setPortfolio(value)} />
      {portfolio && <Portfolio portfolio={JSON.parse(portfolio)} />}
    </section>
  )
}