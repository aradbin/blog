'use client'

import { firstLetterUpperCase, formatDate } from '@/helpers/utils'
import { format, parseISO } from 'date-fns'

export const TransactionTableColumns = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }: any) => formatDate(row?.original?.date),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }: any) => firstLetterUpperCase(row?.original?.type),
  },
  {
    accessorKey: 'instrument',
    header: 'Instrument',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    right: true,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    right: true,
  },
  {
    accessorKey: 'subtotal',
    header: 'Sub Total',
    cell: ({ row }: any) => row?.original?.amount * row?.original?.quantity,
    right: true,
  },
]
