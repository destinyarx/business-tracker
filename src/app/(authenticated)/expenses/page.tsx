'use client'

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { ExpensesFormData, ExpensesData } from '@/features/expenses/expenses.types'
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

    // table state
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [filterCategory, setFilterCategory] = useState<string>('')
    const [filterMethod, setFilterMethod] = useState<string>('')
    const [filterTimePeriod, setFilterTimePeriod] = useState<string>('')

    // form state
    const [formMode, setFormMode] =useState<FormMode>('create')
    const [showForm, setShowForm] = useState<boolean>(false)
    const [expensesForm, setExpensesForm] = useState<ExpensesFormData | typeof formDefault>(formDefault)
    const updateId = useRef<number | null>(null)

    const modalTitle = {
        'view': 'View Expense Details',
        'create': 'Create Expense',
        'update': 'Update Expense',
    }

    const handleRefresh = () => {
        invalidateKey('expenses')
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
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* filter for category */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='gap-2'>
                                    <Tags className={cn('h-4 w-4', filterCategory && 'text-amber-400')} />
                                    <span className='text-sm'>
                                        {filterCategory ? EXPENSE_CATEGORIES.find((item) => item.value === filterCategory)?.name : 'Category'}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-52'>
                                {EXPENSE_CATEGORIES.map((category) => (
                                    <DropdownMenuCheckboxItem
                                        key={category.value}
                                        checked={filterCategory === category.value}
                                        onCheckedChange={() => setFilterCategory(category.value)}
                                    >
                                        {category.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterCategory('')} className="flex justify-center text-muted-foreground">
                                    <CircleX className="h-4 w-4 text-red-600" />
                                    Clear
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* filter for payment method */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='gap-2'>
                                <CircleDollarSign className={cn('h-4 w-4', filterMethod && 'text-green-400')} />
                                <span className='text-sm'>
                                    {filterMethod ? PAYMENT_METHOD.find((item) => item.value === filterMethod)?.name : 'Payment Method'}
                                </span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-52'>
                                {PAYMENT_METHOD.map((method) => (
                                    <DropdownMenuCheckboxItem
                                        key={method.value}
                                        checked={filterCategory === method.value}
                                        onCheckedChange={() => setFilterMethod(method.value)}
                                    >
                                        {method.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterMethod('')} className="flex justify-center text-muted-foreground">
                                    <CircleX className="h-4 w-4 text-red-600" />
                                    Clear
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* filter for date */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='gap-2'>
                                <CalendarSearch className={cn('h-4 w-4', filterTimePeriod && 'text-sky-500')} />
                                <span className='text-sm'>
                                    {filterTimePeriod ? TIME_PERIOD.find((item) => item.value === filterTimePeriod)?.name : 'Time Period'}
                                </span>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end' className='w-52'>
                                {TIME_PERIOD.map((method) => (
                                    <DropdownMenuCheckboxItem
                                        key={method.value}
                                        checked={filterCategory === method.value}
                                        onCheckedChange={() => setFilterTimePeriod(method.value)}
                                    >
                                        {method.name}
                                    </DropdownMenuCheckboxItem>
                                ))}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setFilterTimePeriod('')} className="flex justify-center text-muted-foreground">
                                    <CircleX className="h-4 w-4 text-red-600" />
                                    Clear
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* table reload */}
                        <Button 
                            onClick={() => handleRefresh()}
                            variant="outline" 
                            size="icon-sm" 
                            className="bg-sky-800 hover:bg-sky-400"
                        >
                            <RefreshCw className="h-4 w-4 text-white" />
                        </Button>
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
  