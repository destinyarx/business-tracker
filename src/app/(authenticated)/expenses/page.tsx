'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CalendarSearch,
  CircleDollarSign,
  CircleX,
  Plus,
  RefreshCw,
  Search,
  Tags,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EXPENSE_CATEGORIES, PAYMENT_METHOD, TIME_PERIOD } from '@/constants'
import type {
  ExpenseFilters,
  ExpensesData,
  ExpensesFormData,
} from '@/features/expenses/expenses.types'
import type { FormMode } from '@/types/global.types'
import { useExpenseMutation } from '@/features/expenses/hooks/useExpenseMutation'
import { usePaginatedExpensesQuery } from '@/features/expenses/hooks/usePaginatedExpensesQuery'
import { createExpensePageSummary } from '@/features/expenses/expense-summary'
import { ExpenseOverview } from '@/features/expenses/components/ExpenseOverview'
import ExpensesTable from '@/features/expenses/components/ExpensesTable'
import ExpenseForm from '@/features/expenses/components/ExpenseForm'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const expensesPerPage = 10
const emptyExpense: ExpensesFormData = {
  title: '',
  description: '',
  dateIncurred: new Date(),
  amount: 0,
  referenceNumber: '',
  category: 'rent',
  categoryOther: '',
  paymentMethod: 'cash',
  paymentMethodOther: '',
}

export default function ExpensesPage() {
  const { createExpense, updateExpense, deleteExpense } = useExpenseMutation()
  const appToast = useToast()
  const confirmation = useConfirmation()
  const { invalidateKey } = useInvalidateQuery()
  const updateId = useRef<number | null>(null)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [expenseForm, setExpenseForm] = useState<ExpensesFormData>(emptyExpense)
  const [currentPage, setCurrentPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filters, setFilters] = useState<ExpenseFilters>({})
  const expensesQuery = usePaginatedExpensesQuery({
    limit: expensesPerPage,
    offset,
    filters,
  })
  const expenses = expensesQuery.isPlaceholderData ? [] : (expensesQuery.data?.results ?? [])
  const expenseSummary = createExpensePageSummary(expenses)

  useEffect(() => {
    const searchDelay = window.setTimeout(() => {
      setCurrentPage(1)
      setOffset(0)
      setFilters((currentFilters) => ({
        ...currentFilters,
        searchKey: searchText || undefined,
      }))
    }, 1000)

    return () => window.clearTimeout(searchDelay)
  }, [searchText])

  const setFilter = (filterName: keyof ExpenseFilters, filterValue?: string) => {
    setCurrentPage(1)
    setOffset(0)
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filterName]: filterValue || undefined,
    }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setOffset((page - 1) * expensesPerPage)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setCurrentPage(1)
    setOffset(0)
    setSearchText('')
    setFilters({})
    invalidateKey('expenses')
    window.setTimeout(() => setIsRefreshing(false), 300)
  }

  const setFormValues = (expense: ExpensesData) => {
    updateId.current = expense.id ?? null
    setExpenseForm({ ...emptyExpense, ...expense })
  }

  const openCreateDrawer = () => {
    setFormMode('create')
    updateId.current = null
    setExpenseForm(emptyExpense)
    setIsFormOpen(true)
  }

  const openViewDrawer = (expense: ExpensesData) => {
    setFormMode('view')
    setFormValues(expense)
    setIsFormOpen(true)
  }

  const openUpdateDrawer = (expense: ExpensesData) => {
    setFormMode('update')
    setFormValues(expense)
    setIsFormOpen(true)
  }

  const closeFormDrawer = () => {
    setIsFormOpen(false)
    updateId.current = null
    setExpenseForm(emptyExpense)
  }

  const handleDelete = async (expenseId: number): Promise<void> => {
    const confirmed = await confirmation(
      'Delete this expense?',
      'This expense will be removed from your records. This action cannot be undone.',
    )
    if (!confirmed) return

    try {
      await appToast.loadingPromise(deleteExpense.mutateAsync(expenseId), {
        loadingTitle: 'Deleting expense...',
        successTitle: 'Expense deleted',
        errorTitle: 'Failed to delete expense',
        errorDescription: 'Please try again.',
      })
    } catch {
      return
    }
  }

  const handleUpdate = async (expense: ExpensesData): Promise<void> => {
    const expenseId = expense.id ?? updateId.current
    if (!expenseId) return

    try {
      await appToast.loadingPromise(
        updateExpense.mutateAsync({ ...expense, id: expenseId }),
        {
          loadingTitle: 'Updating expense...',
          successTitle: 'Expense updated',
          errorTitle: 'Failed to update expense',
          errorDescription: 'Please check the form and try again.',
        },
      )
      closeFormDrawer()
    } catch {
      return
    }
  }

  const handleCreate = async (expense: ExpensesFormData): Promise<void> => {
    try {
      await appToast.loadingPromise(createExpense.mutateAsync(expense), {
        loadingTitle: 'Adding expense...',
        successTitle: 'Expense created',
        errorTitle: 'Failed to create expense',
        errorDescription: 'Please check the form and try again.',
      })
      closeFormDrawer()
    } catch {
      return
    }
  }

  const panelTitle =
    formMode === 'create'
      ? 'Record an expense'
      : formMode === 'view'
        ? 'Expense details'
        : 'Edit expense'
  const panelCrumb =
    formMode === 'create'
      ? 'Expenses / New record'
      : formMode === 'view'
        ? 'Expenses / View record'
        : 'Expenses / Edit record'

  return (
    <div className="mx-auto w-full max-w-[1480px] text-[#16292b] dark:text-[#eaf3f1]">
      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-1">
          <div className="relative min-w-60 flex-1 sm:w-[320px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search expenses"
              placeholder="Search expenses..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Tags className={cn('size-4', filters.category && 'text-amber-500')} />
                <span className="text-sm">{filters.category ? EXPENSE_CATEGORIES.find((category) => category.value === filters.category)?.name : 'Category'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {EXPENSE_CATEGORIES.map((category) => (
                <DropdownMenuCheckboxItem key={category.value} checked={filters.category === category.value} onCheckedChange={() => setFilter('category', category.value)}>{category.name}</DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('category')} className="justify-center text-muted-foreground"><CircleX className="size-4 text-red-600" />Clear</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CircleDollarSign className={cn('size-4', filters.paymentMethod && 'text-green-500')} />
                <span className="text-sm">{filters.paymentMethod ? PAYMENT_METHOD.find((method) => method.value === filters.paymentMethod)?.name : 'Payment Method'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {PAYMENT_METHOD.map((method) => (
                <DropdownMenuCheckboxItem key={method.value} checked={filters.paymentMethod === method.value} onCheckedChange={() => setFilter('paymentMethod', method.value)}>{method.name}</DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('paymentMethod')} className="justify-center text-muted-foreground"><CircleX className="size-4 text-red-600" />Clear</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarSearch className={cn('size-4', filters.timePeriod && 'text-sky-500')} />
                <span className="text-sm">{filters.timePeriod ? TIME_PERIOD.find((period) => period.value === filters.timePeriod)?.name : 'Time Period'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {TIME_PERIOD.map((period) => (
                <DropdownMenuCheckboxItem key={period.value} checked={filters.timePeriod === period.value} onCheckedChange={() => setFilter('timePeriod', period.value)}>{period.name}</DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('timePeriod')} className="justify-center text-muted-foreground"><CircleX className="size-4 text-red-600" />Clear</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleRefresh} variant="outline" size="icon-sm" aria-label="Refresh expenses" className="bg-sky-800 hover:bg-sky-400">
                <RefreshCw className={cn('size-4 text-white', isRefreshing && 'animate-spin')} />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Refresh data</p></TooltipContent>
          </Tooltip>
        </div>

        <Button onClick={openCreateDrawer} className="h-10 w-full rounded-[11px] bg-[#0c4b47] px-[18px] text-[13px] font-semibold text-white hover:bg-[#007f78] sm:w-auto xl:ml-auto">
          <Plus className="size-4" />
          Add Expense
        </Button>
      </div>

      <ExpenseOverview summary={expenseSummary} />
      <ExpensesTable
        expenses={expenses}
        isLoading={expensesQuery.isLoading || expensesQuery.isPending || expensesQuery.isPlaceholderData}
        isError={expensesQuery.isError}
        hasNext={expensesQuery.data?.hasNext ?? false}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onView={openViewDrawer}
        onUpdate={openUpdateDrawer}
        onDelete={handleDelete}
      />

      <Sheet open={isFormOpen} onOpenChange={(open) => !open && closeFormDrawer()}>
        <SheetContent className="w-[470px] max-w-[94vw] gap-0 border-l-0 bg-white p-0 shadow-[-30px_0_60px_-30px_rgba(11,32,33,0.5)] dark:bg-[#12201f] sm:max-w-[470px] [&>button]:hidden">
          <SheetHeader className="flex-row items-start gap-3 border-b border-[#edf1f0] px-[22px] py-4 text-left dark:border-[#1e322f]">
            <span className="w-1 self-stretch shrink-0 rounded-full bg-gradient-to-b from-[#ffde68] to-[#ffb018]" />
            <div className="min-w-0 flex-1">
              <SheetDescription className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#93a5a5]">{panelCrumb}</SheetDescription>
              <SheetTitle className="text-[19px] font-semibold tracking-[-0.02em]">{panelTitle}</SheetTitle>
              {expenseForm.title && <p className="mt-1 truncate text-[11.5px] text-[#7c8e8e]">{expenseForm.title}</p>}
            </div>
            <button type="button" onClick={closeFormDrawer} aria-label="Close expense form" className="grid size-8 place-items-center rounded-[10px] border border-[#e3e9e8] bg-white transition-colors hover:border-[#16292b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f]"><X className="size-4" /></button>
          </SheetHeader>
          <ExpenseForm
            key={`${formMode}-${expenseForm.id ?? 'new'}`}
            formMode={formMode}
            data={expenseForm}
            updateId={updateId.current}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancel={closeFormDrawer}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
