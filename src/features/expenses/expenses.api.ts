import type { AxiosInstance } from 'axios'
import type { CreateExpenseCommand, ExpenseFilters, UpdateExpenseCommand } from './expenses.types'

export function createExpensesApi(api: AxiosInstance) {
    return {
        async getPaginated(limit: number, offset: number, filters?: ExpenseFilters): Promise<object> {
            const params = new URLSearchParams({
                limit: String(limit),
                offset: String(offset),
            })

            if (filters?.searchKey) params.set('searchKey', filters.searchKey)
            if (filters?.category) params.set('category', filters.category)
            if (filters?.paymentMethod) params.set('paymentMethod', filters.paymentMethod)
            if (filters?.timePeriod) params.set('timePeriod', filters.timePeriod)

            const response = await api.get<object>('/expenses/paginated', { params })
            return response.data
        },

        async create(expense: CreateExpenseCommand): Promise<void> {
            await api.post('/expenses', expense)
        },

        async update(expense: UpdateExpenseCommand): Promise<void> {
            await api.patch(`/expenses/${expense.id}`, expense)
        },

        async delete(expenseId: number): Promise<void> {
            await api.delete(`/expenses/${expenseId}`)
        },
    }
}
