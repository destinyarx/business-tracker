import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useExpensesService } from '@/features/expenses/expenses.service'
import { useAuth } from '@clerk/nextjs'

type Props = {
    limit: number,
    offset: number
}

export function usePaginatedExpensesQuery({ limit, offset }: Props) {
    const { getPaginated } = useExpensesService()
    const { isLoaded } = useAuth()

    console.log(limit, offset)

    return useQuery({
        queryKey: ['expenses', limit, offset],
        queryFn: () => getPaginated(limit, offset),
        staleTime: 1000 * 60 * 5,
        enabled: isLoaded,
        placeholderData: keepPreviousData,
    })
}