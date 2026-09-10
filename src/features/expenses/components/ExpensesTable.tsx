'use client'

import { format } from 'date-fns'
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CreditCard,
  Eye,
  Inbox,
  Landmark,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Wallet,
} from 'lucide-react'
import { PAYMENT_METHOD } from '@/constants'
import type { ExpensesData } from '@/features/expenses/expenses.types'
import { getExpenseCategoryLabel, formatExpenseAmount } from '../expense-summary'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import NoItemFound from '@/components/organisms/NoItemFound'

type ExpensesTableProps = {
  expenses: ExpensesData[]
  isLoading: boolean
  isError: boolean
  hasNext: boolean
  currentPage: number
  onPageChange: (page: number) => void
  onView: (expense: ExpensesData) => void
  onUpdate: (expense: ExpensesData) => void
  onDelete: (expenseId: number) => void
}

type MethodVisual = {
  Icon: React.ElementType
  color: string
}

const methodVisual = (method?: string): MethodVisual => {
  const normalizedMethod = method?.toLowerCase() ?? ''

  if (normalizedMethod.includes('cash')) {
    return { Icon: Wallet, color: 'text-emerald-600 dark:text-emerald-400' }
  }

  if (
    normalizedMethod.includes('card') ||
    normalizedMethod.includes('visa') ||
    normalizedMethod.includes('master')
  ) {
    return { Icon: CreditCard, color: 'text-blue-600 dark:text-blue-400' }
  }

  if (normalizedMethod.includes('bank') || normalizedMethod.includes('transfer')) {
    return { Icon: Landmark, color: 'text-violet-600 dark:text-violet-400' }
  }

  return { Icon: Banknote, color: 'text-[#7c8e8e]' }
}

function PaymentMethod({ paymentMethod }: { paymentMethod: string }) {
  if (paymentMethod === 'maya') {
    return <img src="/svg/maya.svg" alt="Maya" className="h-3 w-auto" />
  }

  if (paymentMethod === 'gcash') {
    return <img src="/svg/gcash.svg" alt="GCash" className="h-4 w-auto" />
  }

  const { Icon, color } = methodVisual(paymentMethod)
  const methodName =
    PAYMENT_METHOD.find((method) => method.value === paymentMethod)?.name ??
    paymentMethod.replaceAll('_', ' ')

  return (
    <span className="inline-flex items-center gap-2 capitalize text-[#5f7273] dark:text-[#9fb3b0]">
      <Icon className={`size-4 ${color}`} strokeWidth={1.8} />
      {methodName}
    </span>
  )
}

export default function ExpensesTable({
  expenses,
  isLoading,
  isError,
  hasNext,
  currentPage,
  onPageChange,
  onView,
  onUpdate,
  onDelete,
}: ExpensesTableProps) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]" aria-label="Expenses table">
      <div className="overflow-x-auto">
        <Table className="min-w-[940px]">
          <TableHeader>
            <TableRow className="border-[#edf1f0] bg-[#f8fafa] hover:bg-[#f8fafa] dark:border-[#1e322f] dark:bg-[#16292b] dark:hover:bg-[#16292b]">
              <TableHead className="h-11 pl-[18px] text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Name</TableHead>
              <TableHead className="h-11 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Date</TableHead>
              <TableHead className="h-11 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Category</TableHead>
              <TableHead className="h-11 text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Amount</TableHead>
              <TableHead className="h-11 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Method</TableHead>
              <TableHead className="h-11 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Description</TableHead>
              <TableHead className="h-11 pr-[18px] text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError && (
              <TableRow><TableCell colSpan={7} className="h-40"><div className="flex items-center justify-center gap-2 text-sm text-red-700 dark:text-red-300"><Inbox className="size-5" />We could not load the expense records.</div></TableCell></TableRow>
            )}
            {isLoading && !isError && (
              <TableRow><TableCell colSpan={7} className="h-40"><div className="flex flex-col items-center justify-center gap-2 text-[#7c8e8e]"><Loader2 className="size-5 animate-spin" /><span className="text-xs">Loading expenses…</span></div></TableCell></TableRow>
            )}
            {!isLoading && !isError && expenses.length === 0 && (
              <TableRow><TableCell colSpan={7} className="h-52"><NoItemFound title="No expenses recorded" description="Start tracking expenses to keep your records up to date." /></TableCell></TableRow>
            )}
            {!isLoading && !isError && expenses.map((expense) => {
              const expenseId = expense.id
              return (
                <TableRow key={expenseId ?? `${expense.title}-${expense.dateIncurred.toString()}`} className="border-[#edf1f0] text-[12.5px] transition-colors hover:bg-[#f8fafa] dark:border-[#1e322f] dark:hover:bg-[#16292b]">
                  <TableCell className="py-[13px] pl-[18px] text-[13.5px] font-medium text-[#16292b] dark:text-[#eaf3f1]">{expense.title}</TableCell>
                  <TableCell className="whitespace-nowrap py-[13px] text-[#5f7273] dark:text-[#9fb3b0]">{format(expense.dateIncurred, 'MMM. dd, yyyy')}</TableCell>
                  <TableCell className="py-[13px]"><span className="inline-flex rounded-full border border-[#dce3e2] bg-[#f3fbf8] px-2.5 py-1 text-[11.5px] font-medium capitalize text-[#0c4b47] dark:border-[#2b514d] dark:bg-[#18302e] dark:text-[#8ce6dd]">{getExpenseCategoryLabel(expense)}</span></TableCell>
                  <TableCell className="whitespace-nowrap py-[13px] text-right font-mono text-[13px] font-medium tabular-nums text-[#16292b] dark:text-[#eaf3f1]">{formatExpenseAmount(Number(expense.amount) || 0)}</TableCell>
                  <TableCell className="py-[13px]"><PaymentMethod paymentMethod={expense.paymentMethod} /></TableCell>
                  <TableCell className="max-w-[260px] py-[13px] text-[#5f7273] dark:text-[#9fb3b0]"><p className="truncate" title={expense.description?.trim() || undefined}>{expense.description?.trim() || '—'}</p></TableCell>
                  <TableCell className="py-[13px] pr-[18px] text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon-sm" aria-label={`Actions for ${expense.title}`} className="size-8 rounded-[9px] border-[#dce3e2] bg-white shadow-none hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:hover:bg-[#18302e]"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#dce3e2] p-1.5 dark:border-[#2b4340]">
                        <DropdownMenuLabel className="truncate px-2 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] text-[#93a5a5]">{expense.title}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(expense)} className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium"><Eye className="size-4 text-[#007f78]" />View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdate(expense)} className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium"><Pencil className="size-4 text-[#b77a00]" />Edit expense</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled={!expenseId} onClick={() => expenseId && onDelete(expenseId)} className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-red-700 focus:bg-red-50 focus:text-red-800 dark:text-red-400 dark:focus:bg-red-950/30"><Trash2 className="size-4" />Delete expense</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-[#edf1f0] px-[18px] py-3 dark:border-[#1e322f]">
        <span className="text-xs text-[#7c8e8e]">{expenses.length} {expenses.length === 1 ? 'record' : 'records'} on this page</span>
        <nav className="ml-auto flex items-center gap-1.5" aria-label="Expense pages">
          <Button variant="outline" size="sm" disabled={currentPage === 1 || isLoading} onClick={() => onPageChange(currentPage - 1)} className="h-8 rounded-[9px] border-[#dce3e2] bg-white px-3 text-xs shadow-none dark:border-[#2b4340] dark:bg-[#12201f]"><ArrowLeft className="size-3.5" />Previous</Button>
          <span className="grid size-8 place-items-center rounded-[9px] bg-[#16292b] text-xs font-semibold text-white dark:bg-[#eaf3f1] dark:text-[#12201f]">{currentPage}</span>
          <Button variant="outline" size="sm" disabled={!hasNext || isLoading} onClick={() => onPageChange(currentPage + 1)} className="h-8 rounded-[9px] border-[#dce3e2] bg-white px-3 text-xs shadow-none dark:border-[#2b4340] dark:bg-[#12201f]">Next<ArrowRight className="size-3.5" /></Button>
        </nav>
      </footer>
    </section>
  )
}
