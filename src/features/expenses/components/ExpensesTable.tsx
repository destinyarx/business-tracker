'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import type { ExpensesData, ExpenseFilters } from '@/features/expenses/expenses.types'
import { usePaginatedExpensesQuery } from '@/features/expenses/hooks/usePaginatedExpensesQuery'
import { PAYMENT_METHOD } from '@/constants'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableFooter, TableRow } from '@/components/ui/table'
import { ArrowLeft, ArrowRight, Banknote, CalendarDays, CreditCard, PhilippinePeso, Inbox, Landmark, Loader2, Tag, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ActionButton from '@/components/molecules/ActionButton'
import NoItemFound from '@/components/organisms/NoItemFound'

type Props = {
    onView: (data: ExpensesData) => void,
    onUpdate: (data: ExpensesData) => void,
    onDelete: (id: number) => void,
    offset: number,
    onOffsetChange: (value: number) => void,
    currentPage: number,
    onPageChange: (value: number) => void,
    filters: ExpenseFilters
}

type MethodVisual = {
    Icon: React.ElementType
    color: string
}

export default function ExpensesTable({ onView, onUpdate, onDelete, offset, onOffsetChange, currentPage, onPageChange, filters }: Props) {
    const [limit, setLimit] = useState(10)

    const { data, isLoading, isPending, isError } = usePaginatedExpensesQuery({ limit, offset, filters })
    const expenses = data?.data?.data?.results ?? []
    const hasNext = data?.data?.data?.hasNext ?? false

    useEffect(() => {
        onOffsetChange((currentPage * limit) - limit )
    }, [currentPage])
      
    function methodVisual(method?: string): MethodVisual {
        const m = (method || '').toLowerCase()
      
        if (m.includes('cash')) {
          return {
            Icon: Wallet,
            color: 'text-emerald-500',
          }
        }
      
        if (m.includes('card') || m.includes('visa') || m.includes('master')) {
          return {
            Icon: CreditCard,
            color: 'text-blue-500',
          }
        }
      
        if (m.includes('bank') || m.includes('transfer')) {
          return {
            Icon: Landmark,
            color: 'text-purple-500',
          }
        }
      
        return {
          Icon: Banknote,
          color: 'text-muted-foreground',
        }
    }

    function displayPaymentMethod(paymentMethod: string) {
        if (paymentMethod=== 'maya') {
            return (
                <div className="flex justify-center">
                    <img src="/svg/maya.svg" alt="Logo" className="h-3 w-auto" />
                </div>
            )
        } else if (paymentMethod === 'gcash') {
            return (
                <div className="flex justify-center">
                    <img src="/svg/gcash.svg" alt="Logo" className="h-4 w-auto" />
                </div>
            )
        } else {
            return (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    {(() => {
                        const { Icon, color } = methodVisual(paymentMethod)
                        return <Icon className={`h-4 w-4 ${color}`} />
                    })()}

                    <span className="capitalize text-muted-foreground">
                        {PAYMENT_METHOD.find((item) => item.value === paymentMethod)?.name ?? ''}
                    </span>
                </div>
            )
        }
    }

    function emptyMessage() {
        return (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="flex flex-col items-center justify-center">
                  <NoItemFound title="No expenses recorded" description="Start tracking expenses to keep your records up to date."/>
                </div>
              </TableCell>
            </TableRow>
        )
    }

    function errorMessage() {
        return (
            <TableRow>
              <TableCell colSpan={7} className="py-10">
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Inbox className="h-5 w-5" />
                    <span className="text-sm font-medium">Error encountered while fetching data.</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
        )
    }

    function loadingMessage() {
        return (
          <TableRow>
            <TableCell colSpan={7} className="py-12">
              <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <div className="text-sm font-medium">Loading expenses…</div>
                <div className="text-xs">
                  Please wait while we fetch your data
                </div>
              </div>
            </TableCell>
          </TableRow>
        )
    }

    function renderTableData() {
        return (
            <>
                {expenses.map((expense: ExpensesData) => (
                    <TableRow key={expense.id} className="hover:bg-muted/40 text-xs">
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 opacity-0" />
                                <span className="truncate">{expense.title}</span>
                            </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-sky-500" />
                                <span>{format(expense.dateIncurred, 'MMM. dd, yyyy')}</span>
                            </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-yellow-400" />
                                <span className="capitalize">{expense.category}</span>
                            </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                            <div className="flex items-center justify-end gap-2">
                                <PhilippinePeso className="h-4 w-4 text-green-400" />
                                <span className="font-semibold">{expense.amount}</span>
                            </div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">
                            {displayPaymentMethod(expense.paymentMethod)}
                        </TableCell>

                        <TableCell className="max-w-[360px] text-muted-foreground">
                            <p className="text-xs italic">
                                {expense.description?.trim() ? expense.description : '—'}
                            </p>
                        </TableCell>

                        <TableCell>
                            <ActionButton
                                // TODO: add view functionality
                                onView={() => onView(expense)}
                                onUpdate={() => onUpdate(expense)}
                                onDelete={() => onDelete(expense.id!)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </>
        )
    }



    return (
        <div className="rounded-lg border bg-card shadow-sm">

            <Table className="overflow-x-auto rounded-xl table-auto border border-border">
                <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent [&_th]:h-11 [&_th]:text-xs [&_th]:font-semibold dark:[&_th]:text-white [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-muted-foreground [&_th:last-child]:pr-6">
                        <TableHead className="pl-7">Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                        <TableHead className="text-center">Method</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center w-[5%] whitespace-nowrap">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { isError ? errorMessage() : (
                        isLoading || isPending ? loadingMessage()
                            : expenses.length === 0
                            ? emptyMessage()
                            : renderTableData()
                    )}
                </TableBody>
                <TableFooter className="w-full">
                    <TableRow>
                        <TableCell colSpan={7} className="p-0">
                            <div className="flex w-full items-center justify-end gap-2 border px-4 py-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => onPageChange(currentPage - 1)}
                                    className="bg-teal-600 text-white hover:bg-teal-700"
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                    Previous
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!hasNext}
                                    onClick={() => onPageChange(currentPage + 1)}
                                    className="bg-teal-600 text-white hover:bg-teal-700"
                                >
                                    Next
                                    <ArrowRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}