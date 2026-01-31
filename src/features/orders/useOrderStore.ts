import { create } from 'zustand'
import type { CartItem, OrderForm, OrderState } from '@/features/orders/order.type'

interface OrderStore {
    orderState: OrderState,
    setOrderState: (mode: OrderState) => void,

    carts: CartItem[],
    addToCart: (item: CartItem) => void,
    resetCart: () => void,
    removeFromCart: (id: number | undefined) => void,
    increaseItem: (id: number | undefined) => void,
    decreaseItem: (id: number | undefined) => void

    // form
    orderForm: OrderForm,
    showForm: boolean,
    setShowForm: (show: boolean) => void,
    resetOrderForm: () => void,
}

export const useOrderStore = create<OrderStore>((set) => ({
    orderState: 'show_orders',
    setOrderState: (orderState) => set({ orderState: orderState }),

    carts: [],

    addToCart: (item) => set((state): Partial<OrderStore> => {
        const existing = state.carts.find(cart => cart.id === item.id)

        if (existing) {
            return {
                carts: state.carts.map((cart) =>
                    cart.id === item.id && cart.quantity ? { ...cart, quantity: cart.quantity + 1 } : cart
                )
            }
        }

        return { carts: [...state.carts, { ...item, quantity: 1 }] }
    }),

    resetCart: () => set({ carts: [] }),

    removeFromCart: (id) => 
        set((state) => ({
            carts: state.carts.filter(cart => cart.id !== id
        ) 
    })),

    increaseItem: (id) =>
        set((state) => ({
            carts: state.carts.map((cart) => cart.id === id && cart.quantity ? { ...cart, quantity: cart.quantity + 1 } : cart
        )
    })),

    decreaseItem: (id) =>
        set((state) => ({
            carts: state.carts.map((cart) =>
                cart.id === id && cart.quantity
                    ? { ...cart, quantity: cart.quantity - 1 }
                    : cart
                ).filter((cart) => !!cart.quantity)
    })),

    // form
    orderForm: {
        customerId: null,
        orderName: '',
        status: 'pending',
        notes: ''
    },
    showForm: false,

    setShowForm: (show: boolean) => set({ showForm: show }),
    resetOrderForm: () => set((): Partial<OrderStore> => {
        return {
            orderForm: {
                customerId: null,
                orderName: undefined,
                status: undefined,
                notes: undefined
            }
        }
    }),
      
    


}))