'use client'

export const TransactionTableColumns = [
  {
    accessorKey: 'instruments.name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }: any) => <div className="text-right">{row?.original?.price}</div>,
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
    cell: ({ row }: any) => row?.original?.price * row?.original?.quantity,
    right: true,
  },
]
