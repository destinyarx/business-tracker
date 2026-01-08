"use client"

import { useState } from 'react'
import OrderProductCard from '@/features/orders/components/OrderProductCard'
import OrderCartList from '@/features/orders/components/OrderCartList'
import { useProducts } from '@/features/products/hooks/useProducts'
import Loading from '@/components/organisms/Loading'
import type { Product } from '@/features/products/products.types'
import type { CartItem } from '@/features/orders/order.type'
import { useOrderStore } from '@/features/orders/useOrderStore'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { toast } from 'sonner'
import { useApi } from '@/hooks/useApi'

export default function index() {
  const { productsQuery } = useProducts()
  const { carts, addToCart, resetCart } = useOrderStore()
  const api = useApi()
  const appToast = useToast()

  const checkout = async () => {
    const toastId = appToast.loading({
      title: "Checking out orders...",
      description: "Please wait..."
    })

    try {
      await api.post('/checkout', carts)
    } catch (error) {
      appToast.error({
        title: "Failed to proccess the orders",
        description: "Please try again."
      })
    } finally {
      toast.dismiss(toastId)
      resetCart()
    }
  }


  return (
    <div className="flex h-[87vh] w-full max-w-full flex-col md:flex-row bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
        {/* Products */}
        <div className="w-[70%] h-full overflow-y-auto px-3">
          {productsQuery.isLoading ? (
            <Loading/>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {productsQuery.data?.map((product: Product) => (
                  <OrderProductCard
                    key={product.id}
                    product={product}
                    onClick={() => addToCart(product)}
                  />
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="w-[30%] h-full overflow-y-auto border-l p-3">
          <div className="flex flex-row justify-center items-center gap-2 border-b pb-3 mb-2">
              <ShoppingCart className="h-5 w-5 text-amber-700" />

              <h2 className="text-base font-semibold text-gray-900 text-end">
                Shopping Cart
              </h2>
          </div>

          <OrderCartList/>

          {!!carts.length && (
            <Button 
              onClick={checkout}
              className="mt-4 w-full rounded-lg bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800">
              Checkout
            </Button>
          )}
        </div>
        
    </div>
  );
}
  