import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCustomerService } from '../customers.service'
import type { Customer } from '../customers.types'
import { useAuth } from '@clerk/nextjs'

export function useCustomers() {
    const qc = useQueryClient()
    const customerService = useCustomerService()
    const { isLoaded } = useAuth()

    const customerQuery = useQuery({
        queryKey: ['customers'],
        queryFn: () => customerService.getAll(),
        staleTime: 1000 * 60 * 5,
        enabled: isLoaded,
    })

    const createCustomer = useMutation({
        mutationFn: (data: Customer) => customerService.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['customers']})
        }
    })

    const updateCustomer = useMutation({
        mutationFn: ({ id, values }: {id: number, values: Customer}) => customerService.update(id, values),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['customers']})
        }
    })

    const deleteCustomer = useMutation({
        mutationFn: (id: number) => customerService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['customers']})
        }
    })

    return { customerQuery, createCustomer, updateCustomer, deleteCustomer }
}

