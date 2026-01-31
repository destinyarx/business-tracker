import OrderProductCard from '@/features/orders/components/OrderProductCard'
import OrderCartList from '@/features/orders/components/OrderCartList'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { Product } from '@/features/products/products.types'
import { useOrderStore } from '@/features/orders/useOrderStore'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { useApi } from '@/hooks/useApi'
import { Modal } from '@/components/molecules/Modal'
import OrderForm from '@/features/orders/components/OrderForm'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

interface Props {
    products: Product[]
    triggerCheckout: (data: any) => void
}

export default function Order({ products, triggerCheckout }: Props) {
    const { customerQuery } = useCustomers()
    const { carts, addToCart, showForm, setShowForm } = useOrderStore()

    const total = carts.reduce<number>((sum, item) => sum + item.price * (item.quantity ?? 0), 0);

    return (
        <div className="flex h-[87vh] w-full max-w-full flex-col md:flex-row bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
            {/* Products */}
            <div className="w0full md:w-[70%] h-full overflow-y-auto px-3">
                <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {products.map((product: Product) => (
                        <OrderProductCard
                            key={product.id}
                            product={product}
                            onClick={() => addToCart(product)}
                        />
                    ))}
                </div>
            </div>

            {/* Cart */}
            <div className="w-full md:w-[30%] h-full overflow-y-auto border-l p-3">
                <div className="flex flex-row justify-center items-center gap-2 border-b pb-3 mb-2">
                    <ShoppingCart className="h-5 w-5 text-amber-700" />

                    <h2 className="text-base font-semibold text-gray-900 text-end">
                        Order Items
                    </h2>
                </div>

                <OrderCartList/>

                {!!carts.length && (
                    <div className="mt-3">
                        <div className="text-center mb-2">
                            <span className="text-xl">Total: </span>
                            <span className="text-2xl text-amber-400 ml-2">₱</span>
                            <span className="text-semibold text-xl"> {total}</span>
                        </div>

                        <Button 
                            onClick={() => setShowForm(true)}
                            className="mt-4 w-full rounded-lg bg-teal-400 py-3 text-sm font-medium text-white hover:bg-teal-200"
                        >
                            Checkout
                        </Button>
                    </div>
                )}
            </div>

            <Modal 
                open={showForm} 
                onOpenChange={setShowForm} 
                title="Order Details"
                className="lg:max-w-4xl"
            >
                <OrderForm 
                    onSubmit={triggerCheckout}
                    customers={customerQuery.isLoading ? [] : customerQuery.data} 
                />
            </Modal>
        </div> 
    )
}