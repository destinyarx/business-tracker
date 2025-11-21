import { create } from 'zustand'
import { Product, FormState } from '@/features/products/products.types'




interface ProductFormState {
    showForm: boolean,
    formState: FormState|null,
    product: Product|null,
    setShowForm: (isOpen: boolean) => void,
    openForm: () => void,
    closeForm: () => void,
    viewForm: (product: Product) => void,
    editForm: (product: Product) => void
}

export const useProductFormStore = create<ProductFormState>((set) => ({
    showForm: false,
    product: null,
    formState: null,
    
    setShowForm: (isOpen: boolean) => set({ showForm: isOpen }),

    openForm: () => set({
        product: null, 
        showForm: true,
        formState: FormState.ADD
    }),

    closeForm: () => set({
        product: null, 
        showForm: false,
        formState: null
    }),

    viewForm: (product: Product) => set({
        product: product, 
        showForm: true,
        formState: FormState.VIEW
    }),

    editForm: (product: Product) => set({
        product: product, 
        showForm: true,
        formState: FormState.EDIT
    }),
}))