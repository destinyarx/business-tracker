'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ExpensesFormData, ExpensesData, ExpenseFilters } from '@/features/expenses/expenses.types'
import type { FormMode } from '@/types/global.types'
import { useExpenseMutation } from '@/features/expenses/hooks/useExpenseMutation'
import { EXPENSE_CATEGORIES, PAYMENT_METHOD, TIME_PERIOD } from '@/constants'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useToast } from '@/hooks/useToast'
import { useInvalidateQuery } from '@/hooks/useInvalidateQuery'

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button' 
import { Plus, Search, RefreshCw, CalendarSearch, Tags, CircleDollarSign, CircleX } from 'lucide-react'
import ExpensesTable from '@/features/expenses/components/ExpensesTable';
import ExpensesForm from '@/features/expenses/components/ExpenseForm';
import { Modal } from '@/components/molecules/Modal';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function Index() {
    const { createExpense, updateExpense, deleteExpense } = useExpenseMutation()
    const appToast = useToast()
    const confirmation = useConfirmation()
    const { invalidateKey } = useInvalidateQuery()

    const formDefault = {
        title: '',
        description: '',
        dateIncurred: new Date(),
        amount: 0,
        referenceNumber: '',
        category: 'rent',
        categoryOther: '',
        paymentMethod: 'cash',
        paymentMethodOther: ''
    }

    // form state
    const [formMode, setFormMode] =useState<FormMode>('create')
    const [showForm, setShowForm] = useState<boolean>(false)
    const [expensesForm, setExpensesForm] = useState<ExpensesFormData | typeof formDefault>(formDefault)
    const updateId = useRef<number | null>(null)

    // table state
    const [currentPage, setCurrentPage] = useState(1)
    const [offset, setoffset] = useState(0)
    const [filters, setFilters] = useState<ExpenseFilters>({
        searchKey: undefined,
        category: undefined,
        paymentMethod: undefined,
        timePeriod: undefined,
    })

    const setFilter = async (key: keyof ExpenseFilters, value: string) => {
        if (key === 'searchKey') {
            await new Promise(r => setTimeout(r, 1000))
        }

        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const modalTitle = {
        'view': 'View Expense Details',
        'create': 'Create Expense',
        'update': 'Update Expense',
    }

    const [animate, setAnimate] = useState(false)
    const handleRefresh = () => {
        setAnimate(true)

        setoffset(0)
        setCurrentPage(1)
        setFilters({
            searchKey: undefined,
            category: undefined,
            paymentMethod: undefined,
            timePeriod: undefined,
        })

        invalidateKey('expenses')

        setTimeout(() => {
            setAnimate(false)
        }, 300)
    }

    const setFormValues = (data: ExpensesData) => {
        updateId.current = data.id ?? null
        setExpensesForm({ ...formDefault, ...data })
    }

    const handleAddExpenses = () => {
        setFormMode('create')
        updateId.current = null
        setExpensesForm(formDefault)
        setShowForm(true)
    }

    const handleView = (data: ExpensesData) => {
        setFormMode('view')
        setFormValues(data)
        setShowForm(true)
    }

    const handleUpdate = async (data: ExpensesData) => {
        setFormMode('update')
        setFormValues(data)
        setShowForm(true)
    }

    const handleDelete = async (id: number) => {
        const confirm = await confirmation('Are you sure?', 'You want to delete this record.')
        if (!confirm) return

        await deleteExpense.mutateAsync(id)
        setExpensesForm(formDefault)
    }

    const updateExpenses = async (data: ExpensesData) => {
        await updateExpense.mutateAsync(data)

        setExpensesForm(formDefault)
        setShowForm(false)
    }

    const createExpenses = async (data: ExpensesFormData) => {
        await createExpense.mutateAsync(data)
        setExpensesForm(formDefault)
        setShowForm(false)
    }

    return (
        <>
            <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
                <div className="flex flex-row justify-between w-full mb-3 ml-5">
                    <div className="flex flex-row gap-1 lg:w-[65%] md:w-[75%]">
                        <div className="relative w-full lg:w-1/2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search expenses..."
                                value={undefined}
                                onChange={(e) => setFilter('searchKey', e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* filter for category */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='gap-2'>
                                    <Tags className={cn('h-4 w-4', filters.category && 'text-amber-400')} />
                                    <span className='text-sm'>
                                        {filters.category ? EXPENSE_CATEGORIES.find((item) => item.value === filters.category)?.name : 'Category'}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-52'>
                                {EXPENSE_CATEGORIES.map((category) => (
                                    <DropdownMenuCheckboxItem
                                        key={category.value}
                                        checked={filters.category === category.value}
                                        onCheckedChange={() => setFilter('category', category.value)}
                                    >
                                        {category.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilter('category', '')} className="flex justify-center text-muted-foreground">
                                    <CircleX className="h-4 w-4 text-red-600" />
                                    Clear
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* filter for payment method */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='gap-2'>
                                <CircleDollarSign className={cn('h-4 w-4', filters.paymentMethod && 'text-green-400')} />
                                <span className='text-sm'>
                                    {filters.paymentMethod ? PAYMENT_METHOD.find((item) => item.value === filters.paymentMethod)?.name : 'Payment Method'}
                                </span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-52'>
                                {PAYMENT_METHOD.map((method) => (
                                    <DropdownMenuCheckboxItem
                                        key={method.value}
                                        checked={filters.paymentMethod === method.value}
                                        onCheckedChange={() => setFilter('paymentMethod', method.value)}
                                    >
                                        {method.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilter('paymentMethod', '')} className="flex justify-center text-muted-foreground">
                                    <CircleX className="h-4 w-4 text-red-600" />
                                    Clear
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* filter for date */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='gap-2'>
                                <CalendarSearch className={cn('h-4 w-4', filters.timePeriod && 'text-sky-500')} />
                                <span className='text-sm'>
                                    {filters.timePeriod ? TIME_PERIOD.find((item) => item.value === filters.timePeriod)?.name : 'Time Period'}
                                </span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-52'>
                                {TIME_PERIOD.map((method) => (
                                    <DropdownMenuCheckboxItem
                                        key={method.value}
                                        checked={filters.timePeriod === method.value}
                                        onCheckedChange={() => setFilter('timePeriod', method.value)}
                                    >
                                        {method.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilter('timePeriod', '')} className="flex justify-center text-muted-foreground">
                                    <CircleX className="h-4 w-4 text-red-600" />
                                    Clear
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* table reload */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    onClick={() => handleRefresh()}
                                    variant="outline" 
                                    size="icon-sm" 
                                    className={cn("bg-sky-800 hover:bg-sky-400", animate && 'animate-spin')}
                                >
                                    <RefreshCw className="h-4 w-4 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Refresh Data</p>
                            </TooltipContent>
                        </Tooltip>


                        
                    </div>

                    <Button
                        variant="outline"
                        className="bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-2 mr-10"
                        onClick={() => handleAddExpenses()}
                    >
                        <Plus className="w-4 h-4" />
                        Add Expenses
                    </Button>
                </div>

               <div className="w-full px-5">
                    <ExpensesTable 
                        onView={handleView}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        offset={offset}
                        onOffsetChange={setoffset}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        filters={filters}
                    />
               </div>
            </div>

            <Modal 
                open={showForm} 
                onOpenChange={setShowForm} 
                title={modalTitle[formMode]}
                className="lg:max-w-3xl max-h-[85vh] overflow-y-auto"
            >
                <div className="-mt-3">
                    <ExpensesForm 
                        formMode={formMode}
                        data={expensesForm}
                        onCreate={createExpenses}
                        onUpdate={updateExpenses}
                        updateId={updateId.current}
                    />
                </div>
            </Modal>
        </>
    );
}
  