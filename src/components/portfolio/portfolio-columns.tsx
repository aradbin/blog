'use client'
import { firstLetterUpperCase, formatDate } from '@/helpers/utils'

export const PortfolioInstrumentColumns = [
  {
    accessorKey: 'instrument',
    header: 'Instrument',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) => (row?.original?.instrument === 'CASH' ? '' : row?.original?.amount),
    right: true,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }: any) => (row?.original?.instrument === 'CASH' ? '' : row?.original?.quantity),
    right: true,
  },
  {
    accessorKey: 'subtotal',
    header: 'Sub Total',
    cell: ({ row }: any) => row?.original?.amount * row?.original?.quantity,
    right: true,
  },
  {
    accessorKey: 'metadata',
    header: 'Fees & Taxes',
    cell: ({ row }: any) => row?.original?.metadata?.charge || 0,
    right: true,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }: any) => row?.original?.amount * row?.original?.quantity + (row?.original?.metadata?.charge || 0),
    right: true,
  },
]

export const TransactionColumns = [
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
    cell: ({ row }: any) => (row?.original?.instrument === 'CASH' ? '' : row?.original?.amount),
    right: true,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }: any) => (row?.original?.instrument === 'CASH' ? '' : row?.original?.quantity),
    right: true,
  },
  {
    accessorKey: 'subtotal',
    header: 'Sub Total',
    cell: ({ row }: any) => row?.original?.amount * row?.original?.quantity,
    right: true,
  },
  {
    accessorKey: 'metadata',
    header: 'Fees & Taxes',
    cell: ({ row }: any) => row?.original?.metadata?.charge || 0,
    right: true,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }: any) => row?.original?.amount * row?.original?.quantity + (row?.original?.metadata?.charge || 0),
    right: true,
  },
]
