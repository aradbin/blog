'use client'
import { TRANSACTION_URL } from '@/helpers/apiEndpoints'
import { DataTable } from '../common/data-table'
import { TransactionTableColumns } from './transaction-table-columns'

export const Portfolio = ({ portfolio }: any) => {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center">{portfolio.name}</h1>
      <div className="flex w-full flex-col gap-1">
        <DataTable
          columns={TransactionTableColumns}
          url={TRANSACTION_URL}
          query={{ select: '*, instruments (*)', count: { count: 'exact' } }}
        />
      </div>
    </section>
  )
}
