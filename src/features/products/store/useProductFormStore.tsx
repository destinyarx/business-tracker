import { create } from 'zustand'
import type { Product } from '@/features/products/products.types'

interface ProductFormState {
    showForm: boolean,
    viewMode: boolean,
    product: Product|null,
    setShowForm: (isOpen: boolean) => void,
    openForm: () => void,
    closeForm: () => void,
    viewForm: (product: Product) => void,
    editForm: (product: Product) => void
}

export const useProductFormStore = create<ProductFormState>((set) => ({
    showForm: false,
    viewMode: false,
    product: null,
    
    setShowForm: (isOpen: boolean) => set({ showForm: isOpen }),

    openForm: () => set({
        product: null, 
        showForm: true,
        viewMode: false,
    }),

    closeForm: () => set({
        product: null, 
        showForm: false,
        viewMode: false,
    }),

    viewForm: (product: Product) => set({
        product: product, 
        showForm: true,
        viewMode: true,
    }),

    editForm: (product: Product) => set({
        product: product, 
        showForm: true,
        viewMode: false,
    }),
}))