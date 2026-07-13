import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useExpensesService } from '@/features/expenses/expenses.service'
import type { CreateExpenseCommand, UpdateExpenseCommand } from '@/features/expenses/expenses.types'

export function useExpenseMutation(){
    const qc = useQueryClient()
    const expensesService = useExpensesService()

    const createExpense = useMutation({
        mutationFn: (expense: CreateExpenseCommand) => expensesService.create(expense),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['expenses']})
        }
    })

    const updateExpense = useMutation({
        mutationFn: (expense: UpdateExpenseCommand) => expensesService.update(expense),
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
        createExpense,
        updateExpense,
        deleteExpense
    }
}
