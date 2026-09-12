import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useExpensesService } from '@/features/expenses/expenses.service'
import type { CreateExpenseCommand, UpdateExpenseCommand } from '@/features/expenses/expenses.types'
import { businessKeys, useBusinessScope } from '@/lib/business-scope'

export function useExpenseMutation(){
    const qc = useQueryClient()
    const expensesService = useExpensesService()
    const { userId } = useBusinessScope()

    const createExpense = useMutation({
        mutationFn: (expense: CreateExpenseCommand) => expensesService.create(expense),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['expenses']})
            qc.invalidateQueries({ queryKey: businessKeys.dashboardRoot(userId) })
        }
    })

    const updateExpense = useMutation({
        mutationFn: (expense: UpdateExpenseCommand) => expensesService.update(expense),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['expenses'] })
            qc.invalidateQueries({ queryKey: businessKeys.dashboardRoot(userId) })
        }
    })

    const deleteExpense = useMutation({
        mutationFn: (id: number) => expensesService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['expenses'] })
            qc.invalidateQueries({ queryKey: businessKeys.dashboardRoot(userId) })
        }
    })

    return {
        createExpense,
        updateExpense,
        deleteExpense
    }
}
