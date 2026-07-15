import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useExpensesService } from '@/features/expenses/expenses.service'
import { businessKeys, useBusinessScope } from '@/lib/business-scope'
import { ExpenseFilters } from '@/features/expenses/expenses.types'

type Props = {
    limit: number,
    offset: number,
    filters: ExpenseFilters
}

export function usePaginatedExpensesQuery({ limit, offset, filters }: Props) {
    const { getPaginated } = useExpensesService()
    const { ready, userId } = useBusinessScope()

    return useQuery({
        queryKey: businessKeys.expenses(userId, limit, offset, filters),
        queryFn: () => getPaginated(limit, offset, filters),
        staleTime: 1000 * 60 * 5,
        enabled: ready,
        placeholderData: keepPreviousData,
    })
}