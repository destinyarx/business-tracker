// export interface Product {
//     id?: number|undefined
//     title: string
//     sku?: string|undefined
//     description?: string
//     price: number
//     stock: number
//     category?: string
//     image?: string
// }

export interface ProductInput {
    title: string
    description: string | null
    sku?: string | null
    barcode?: string | null
    supplier?: string | null
    price: number
    stock: number
    profitPercentage?: number | null
    profit?: number | null
    category?: string
    image?: string | null
    imageUrl?: string | null
    imageSource?: 'url' | 'upload'
}

export interface Product extends ProductInput {
    id?: number
}

export type CreateProductCommand = ProductInput
export type UpdateProductCommand = ProductInput

export type UpdateProductStockCommand = {
    stock: number
}

export type ProductImageSelection = {
    file: File
}

export enum FormState {
    ADD = 'ADD',
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
}
