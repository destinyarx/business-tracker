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

export interface Product {
    id?: number
    title: string
    description?: string
    sku?: string
    barcode?: string
    supplier?: string
    price: number
    stock: number
    profitPercentage?: number
    profit?: number
    category?: string
    image?: string
}

export enum FormState {
    ADD = 'ADD',
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
}