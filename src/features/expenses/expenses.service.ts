'use client'

import { useMemo } from 'react'
import { createExpensesApi } from './expenses.api'
import { paginatedExpensesResponseSchema } from './expenses.schema'
import type {
    CreateExpenseCommand,
    ExpenseFilters,
    PaginatedExpenses,
    UpdateExpenseCommand,
} from './expenses.types'
import { useApi } from '@/hooks/useApi'
import { ensureFeatureError } from '@/lib/feature-error'

export function useExpensesService() {
    const api = useApi()
    const expensesApi = useMemo(() => createExpensesApi(api), [api])

    return {
        async getPaginated(
            limit: number,
            offset: number,
            filters?: ExpenseFilters,
        ): Promise<PaginatedExpenses> {
            try {
                const response = await expensesApi.getPaginated(limit, offset, filters)
                return paginatedExpensesResponseSchema.parse(response).data
            } catch (error) {
                throw ensureFeatureError('expense', error instanceof Error ? error : null)
            }
        },

        async create(expense: CreateExpenseCommand): Promise<void> {
            try {
                await expensesApi.create(expense)
            } catch (error) {
                throw ensureFeatureError('expense', error instanceof Error ? error : null)
            }
        },

        async update(expense: UpdateExpenseCommand): Promise<void> {
            try {
                await expensesApi.update(expense)
            } catch (error) {
                throw ensureFeatureError('expense', error instanceof Error ? error : null)
            }
        },

        async delete(expenseId: number): Promise<void> {
            try {
                await expensesApi.delete(expenseId)
            } catch (error) {
                throw ensureFeatureError('expense', error instanceof Error ? error : null)
            }
        },
    }
}
