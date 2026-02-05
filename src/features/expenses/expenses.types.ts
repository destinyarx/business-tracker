import { EXPENSE_CATEGORIES, PAYMENT_METHOD } from '@/constants'

export type PaymentCategory = typeof EXPENSE_CATEGORIES[number]['value']
export type PaymentMethod = typeof PAYMENT_METHOD[number]['value']

export type ExpensesFormData = {
    id?: number | null
    title: string
    dateIncurred: Date
    amount: number | string
    category: string
    paymentMethod: string
    description?: string | undefined
    referenceNumber?: string | undefined
    categoryOther?: string | undefined
    paymentMethodOther?: string | undefined
}

// export type ExpensesData = ExpensesFormData & {
//     createdAt: Date | string
// }

export type ExpensesData = Omit<ExpensesFormData, 'id'> & {
    id?: number | null
    createdAt?: Date | string
}

export type ExpenseFilters = {
    searchKey?: string,
    category?: string,
    paymentMethod?: string,
    timePeriod?: string,
}
