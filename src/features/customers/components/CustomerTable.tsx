'use client'

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'
import type { Customer, CustomerType } from '@/features/customers/customers.types'
import { CustomerBadge } from './CustomerBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NoItemFound from '@/components/organisms/NoItemFound'
import { cn } from '@/lib/utils'

interface CustomerTableProps {
  data: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
  globalFilter: string
  onGlobalFilterChange: (filter: string) => void
}

const typeFilters: Array<'all' | CustomerType> = [
  'all',
  'normal',
  'loyal',
  'deluxe',
  'premium',
  'VIP',
]

const initialsFor = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join('')
    .toUpperCase()

export function CustomerTable({
  data,
  onEdit,
  onDelete,
  globalFilter,
  onGlobalFilterChange,
}: CustomerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedType, setSelectedType] = useState<'all' | CustomerType>('all')

  const filteredCustomers = useMemo(
    () =>
      selectedType === 'all'
        ? data
        : data.filter((customer) => customer.customerType === selectedType),
    [data, selectedType],
  )

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button type="button" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="inline-flex items-center gap-1.5">
          Name <ArrowDownUp className="size-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[#e4f7f4] text-[11px] font-semibold text-[#007f78] dark:bg-[#1b3b37] dark:text-[#5eebdd]">
            {initialsFor(row.original.name)}
          </span>
          <span className="font-medium text-[#16292b] dark:text-[#eaf3f1]">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <button type="button" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="inline-flex items-center gap-1.5">
          Date added <ArrowDownUp className="size-3" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-[11.5px] text-[#5f7273] dark:text-[#9fb3b0]">
          {row.original.createdAt ? format(row.original.createdAt, 'MMM dd, yyyy') : '—'}
        </span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Contact number',
      cell: ({ row }) => (
        <span className="font-mono text-[11.5px] text-[#5f7273] dark:text-[#9fb3b0]">
          {row.original.phone?.trim() || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'customerType',
      header: 'Customer type',
      cell: ({ row }) => <CustomerBadge type={row.original.customerType} />,
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }) => (
        <p className="max-w-[280px] truncate text-xs text-[#7c8e8e]">
          {row.original.notes?.trim() || '—'}
        </p>
      ),
    },
    {
      id: 'actions',
      header: () => <span className="block text-right">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label={`Actions for ${row.original.name}`} className="grid size-8 place-items-center rounded-[9px] border border-transparent text-[#5f7273] hover:border-[#dce3e2] hover:bg-[#f8fafa] dark:text-[#9fb3b0] dark:hover:border-[#2b4340] dark:hover:bg-[#1b2e2c]">
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
              <DropdownMenuItem onClick={() => onEdit(row.original)} className="rounded-lg text-[12.5px]">
                <Pencil className="size-3.5" />
                Edit customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(row.original)} className="rounded-lg text-[12.5px] text-red-600 focus:text-red-600">
                <Trash2 className="size-3.5" />
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: filteredCustomers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: { sorting, globalFilter },
    onGlobalFilterChange,
    globalFilterFn: (row, _columnId, filter) => {
      const query = String(filter).toLowerCase()
      return [row.original.name, row.original.customerType, row.original.phone, row.original.email, row.original.notes]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(query))
    },
    initialState: { pagination: { pageSize: 10 } },
  })

  const visibleRows = table.getRowModel().rows
  const firstRecord = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1
  const lastRecord = Math.min(firstRecord + visibleRows.length - 1, table.getFilteredRowModel().rows.length)

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#edf1f0] px-[18px] py-3.5 dark:border-[#1e322f]">
        <div className="flex min-w-60 items-center gap-2 rounded-[10px] border border-[#e3e9e8] bg-[#f8fafa] px-3 dark:border-[#2b4340] dark:bg-[#1b2e2c]">
          <Search className="size-3.5 text-[#7c8e8e]" />
          <Input
            aria-label="Filter customer table"
            value={globalFilter}
            onChange={(event) => onGlobalFilterChange(event.target.value)}
            placeholder="Search name, tier or notes"
            className="h-9 min-w-0 border-0 bg-transparent p-0 text-[13px] shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {typeFilters.map((customerType) => (
            <button
              key={customerType}
              type="button"
              aria-pressed={selectedType === customerType}
              onClick={() => {
                setSelectedType(customerType)
                table.setPageIndex(0)
              }}
              className={cn(
                'rounded-full border border-[#e3e9e8] bg-white px-3 py-[7px] text-xs font-medium capitalize text-[#3f5254] hover:border-[#00beaa] hover:text-[#007f78] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]',
                selectedType === customerType && 'border-[#0c4b47] bg-[#0c4b47] text-white hover:text-white dark:border-[#5eebdd] dark:bg-[#5eebdd] dark:text-[#0c4b47]',
              )}
            >
              {customerType}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[940px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-[#edf1f0] bg-[#f8fafa] hover:bg-[#f8fafa] dark:border-[#1e322f] dark:bg-[#1b2e2c]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 px-3.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#7c8e8e] first:pl-[18px] last:pr-[18px]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleRows.length ? (
              visibleRows.map((row) => (
                <TableRow key={row.id} className="h-[58px] border-[#f3f6f5] hover:bg-[#fbfcfc] dark:border-[#1e322f] dark:hover:bg-[#16292b]">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3.5 py-2.5 text-[12.5px] first:pl-[18px] last:pr-[18px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64">
                  <NoItemFound title="No customer records found" description="Try another filter or add your first customer." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-[#edf1f0] bg-[#fbfcfc] px-[18px] py-2.5 dark:border-[#1e322f] dark:bg-[#16292b]">
        <p className="text-xs text-[#7c8e8e]">
          {visibleRows.length ? `Showing ${firstRecord} to ${lastRecord} of ${table.getFilteredRowModel().rows.length} customers` : 'No customers to show'}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="h-8 rounded-[9px] border-[#dce3e2] bg-white px-3 text-xs dark:border-[#2b4340] dark:bg-[#12201f]">
            <ChevronLeft className="size-3.5" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="h-8 rounded-[9px] border-[#dce3e2] bg-white px-3 text-xs dark:border-[#2b4340] dark:bg-[#12201f]">
            Next
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
