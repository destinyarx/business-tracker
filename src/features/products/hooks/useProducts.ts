import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductService } from '../productService.service'
import type { Product } from '../products.types'
import { useProductFormStore} from '@/features/products/store/useProductFormStore'

export function useProducts() {
    const qc = useQueryClient()
    const productService = useProductService()
    const { closeForm } = useProductFormStore()

    const productsQuery = useQuery({
        queryKey: ['products'],
        queryFn: productService.getAll,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const createProduct = useMutation({
        mutationFn: ({values, file}: { values: Product|any, file: any }) => productService.create(values, file),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
            closeForm()
        }
    })

    const updateProduct = useMutation({
        mutationFn: ({id, values}: { id: number, values: Product | any }) => productService.update(id, values),
        onSuccess: () => {
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

    const deleteProductImage = useMutation({
        mutationFn: (image: string) => productService.deleteImage(image)
    })

    return {
        productsQuery,
        createProduct,
        updateProduct,
        deleteProduct,
        deleteProductImage
    }

}