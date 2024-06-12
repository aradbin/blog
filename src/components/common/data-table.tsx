'use client'
import { getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Badge } from '../ui/badge'
import { useQueryHook } from '@/helpers/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '../ui/skeleton'

export function DataTable({ columns, url, query, refetch = 1 }: any) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })
  const queryClient = useQueryClient()
  const { data, isFetching }: any = useQueryHook(url, {
    ...query,
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  })

  const table = useReactTable({
    columns,
    data: data?.data || [],
    getCoreRowModel: getCoreRowModel(),
    rowCount: data?.count || 0,
    manualPagination: true,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  })

  useEffect(() => {
    if (refetch > 1) {
      if (pagination.pageIndex > 0) {
        setPagination({ pageIndex: 0, pageSize: 2 })
      } else {
        queryClient.refetchQueries({ queryKey: [url, query] })
      }
    }
  }, [refetch])

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id} className={header?.column?.columnDef?.right ? 'text-right' : ''}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className={cell?.column?.columnDef?.right ? 'text-right' : ''}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <>
                {isFetching ? (
                  <>
                    {Array.from({ length: pagination.pageSize }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={columns.length} className=" text-center">
                          <Skeleton className="h-[20px] w-full " />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start">
          <Badge variant="outline" className="rounded">
            Total: {data?.count || 0}
          </Badge>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  )
}
