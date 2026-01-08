import { create } from 'zustand'
import type { CartItem } from '@/features/orders/order.type'

interface OrderStore {
    carts: CartItem[],
    addToCart: (item: CartItem) => void,
    resetCart: () => void,
    removeFromCart: (id: number | undefined) => void,
    increaseItem: (id: number | undefined) => void,
    decreaseItem: (id: number | undefined) => void
}

export const useOrderStore = create<OrderStore>((set) => ({
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

    resetCart: () => set((state) => ({ carts: [] })),

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
            carts: state.carts.map((cart) => cart.id === id && cart.quantity ? { ...cart, quantity: cart.quantity - 1 } : cart
        )
    })),
      
}))