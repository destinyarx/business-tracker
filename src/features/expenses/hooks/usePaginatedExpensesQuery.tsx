import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useExpensesService } from '@/features/expenses/expenses.service'
import { useAuth } from '@clerk/nextjs'
import { ExpenseFilters } from '@/features/expenses/expenses.types'

type Props = {
    limit: number,
    offset: number,
    filters: ExpenseFilters
}

export function usePaginatedExpensesQuery({ limit, offset, filters }: Props) {
    const { getPaginated } = useExpensesService()
    const { isLoaded } = useAuth()

    console.log(limit, offset)

    return useQuery({
        queryKey: ['expenses', limit, offset, filters],
        queryFn: () => getPaginated(limit, offset, filters),
        staleTime: 1000 * 60 * 5,
        enabled: isLoaded,
        placeholderData: keepPreviousData,
    })
}