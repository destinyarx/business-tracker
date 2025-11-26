import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductService } from '../productService.service'
import type { Product } from '../products.types'
import { useAuth } from '@clerk/nextjs'
import { useProductFormStore} from '@/features/products/store/useProductFormStore'

export function useProducts() {
    const qc = useQueryClient()
    const productService = useProductService()
    const { closeForm } = useProductFormStore()
    const { isLoaded } = useAuth()

    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: productService.getAll,
        enabled: isLoaded,
    })

    const createProduct = useMutation({
        mutationFn: (values: Product) => productService.create(values),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
            closeForm()
        }
    })

    const updateProduct = useMutation({
        mutationFn: ({id, values}: {id: number, values: Product}) => productService.update(id, values),
        onSuccess: () => {
            console.log('Gumana naman')
            qc.invalidateQueries({ queryKey: ['products'] })
            closeForm()
        }
    })

    const deleteProduct = useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
            closeForm()
        }
    })

    return {
        productsQuery,
        createProduct,
        updateProduct,
        deleteProduct
    }

}