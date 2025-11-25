export interface Product {
    id: number
    title: string
    sku: string
    description: string
    price: number
    stock: number
    category: string
    image: string
}

export enum FormState {
    ADD = 'ADD',
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
}