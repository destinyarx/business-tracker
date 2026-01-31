import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useExpensesService } from '@/features/expenses/expenses.service'
import type { ExpensesFormData } from '@/features/expenses/expenses.types'

export function useExpenseMutation(){
    const qc = useQueryClient()
    const expensesService = useExpensesService()

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
        createExpense,
        updateExpense,
        deleteExpense
    }
}