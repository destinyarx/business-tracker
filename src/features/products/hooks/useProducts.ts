import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useProductService } from '../productService.service'
import type { CreateProductCommand, ProductImageSelection, UpdateProductCommand } from '../products.types'
import { businessKeys, useBusinessScope } from '@/lib/business-scope'

export function useProducts() {
    const qc = useQueryClient()
    const productService = useProductService()
    const { ready, userId } = useBusinessScope()

    const productsQuery = useQuery({
        queryKey: businessKeys.products(userId),
        queryFn: productService.getAll,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: ready,
    })

    const createProduct = useMutation({
        mutationFn: ({ values, file }: { values: CreateProductCommand, file: ProductImageSelection | null }) => productService.create(values, file),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const updateProduct = useMutation({
        mutationFn: ({ id, values }: { id: number, values: UpdateProductCommand }) => productService.update(id, values),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
            qc.invalidateQueries({ queryKey: ['sales'] })
        }
    })

    const deleteProduct = useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] })
            qc.invalidateQueries({ queryKey: ['sales'] })
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
