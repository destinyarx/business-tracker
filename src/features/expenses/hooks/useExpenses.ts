import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useExpensesService } from '@/features/expenses/expenses.service'
import { useAuth } from '@clerk/nextjs'
import type { ExpensesFormData } from '@/features/expenses/expenses.types'

export function useExpenses(limit: number, offset: number) {
    const qc = useQueryClient()
    const expensesService = useExpensesService()
    const { isLoaded } = useAuth()

    const expenseQuery = useQuery({
        queryKey: ['expenses', limit, offset],
        queryFn: () => expensesService.getPaginated(limit, offset),
        staleTime: 1000 * 60 * 5,
        enabled: isLoaded,
        placeholderData: keepPreviousData,
    })

    const createExpense = useMutation({
        mutationFn: (form: ExpensesFormData) => expensesService.create(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['expenses']})
        }
    })

    const updateExpense = useMutation({
        mutationFn: (form: ExpensesFormData) => expensesService.update(form),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['expenses'] })
        }
    })

    const deleteExpense = useMutation({
        mutationFn: (id: number) => expensesService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['expenses'] })
        }
    })

    return {
        expenseQuery,
        createExpense,
        updateExpense,
        deleteExpense
    }
}
