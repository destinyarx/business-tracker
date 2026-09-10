'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, PackagePlus, Search } from 'lucide-react'
import { PRODUCT_CATEGORY } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import OrderCartList from '@/features/orders/components/OrderCartList'
import OrderForm from '@/features/orders/components/OrderForm'
import OrderProductCard from '@/features/orders/components/OrderProductCard'
import { formatOrderCurrency } from '@/features/orders/order.utils'
import { useOrderStore } from '@/features/orders/useOrderStore'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import type { OrderForm as OrderFormData } from '@/features/orders/order.type'
import type { Product } from '@/features/products/products.types'

interface OrderProps {
  products: Product[]
  triggerCheckout: (order: OrderFormData) => void | Promise<void>
  onBack: () => void
  isSubmitting?: boolean
}

const orderFormId = 'create-order-details'

export default function Order({
  products,
  triggerCheckout,
  onBack,
  isSubmitting = false,
}: OrderProps) {
  const { customerQuery } = useCustomers()
  const { carts, addToCart } = useOrderStore()
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const pickerCategories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category)
            .filter((category): category is string => Boolean(category)),
        ),
      ),
    [products],
  )

  const filteredProducts = useMemo(() => {
    const normalizedSearch = productSearch.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch =
        !normalizedSearch ||
        [product.title, product.sku, product.category]
          .filter((field): field is string => Boolean(field))
          .some((field) => field.toLowerCase().includes(normalizedSearch))

      return matchesCategory && matchesSearch
    })
  }, [productSearch, products, selectedCategory])

  const cartQuantity = carts.reduce(
    (quantity, cartItem) => quantity + (cartItem.quantity ?? 0),
    0,
  )
  const total = carts.reduce(
    (amount, cartItem) => amount + cartItem.price * (cartItem.quantity ?? 0),
    0,
  )

  return (
    <div className="mx-auto w-full max-w-[1480px] text-[#16292b] dark:text-[#eaf3f1]">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="mb-3 h-9 rounded-full border-[#dce3e2] bg-white px-3 text-[12.5px] font-semibold text-[#007f78] shadow-sm transition-transform hover:-translate-x-0.5 hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#55ddd0]"
      >
        <ArrowLeft className="size-4" />
        Back to orders
      </Button>

      <div className="mb-4">
        <h1 className="text-[21px] font-semibold leading-tight tracking-[-0.025em]">
          Create order
        </h1>
        <p className="mt-1 text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0]">
          Give it a name or attach a customer, then add products from stock.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.78fr)]">
        <div className="space-y-4">
          <section className="rounded-[20px] border border-[#e3e9e8] bg-white px-[22px] pb-[22px] pt-5 dark:border-[#243936] dark:bg-[#12201f]">
            <div className="mb-[18px] flex items-center gap-2.5">
              <span className="grid size-6 place-items-center rounded-full bg-[#16292b] text-[11px] font-bold text-white dark:bg-[#eaf3f1] dark:text-[#16292b]">
                1
              </span>
              <h2 className="text-[15.5px] font-semibold">Order details</h2>
            </div>
            <OrderForm
              customers={customerQuery.data ?? []}
              onSubmit={triggerCheckout}
              formId={orderFormId}
            />
          </section>

          <section className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]">
            <div className="flex flex-wrap items-center gap-3 px-[22px] pb-4 pt-[18px]">
              <span className="grid size-6 place-items-center rounded-full bg-[#16292b] text-[11px] font-bold text-white dark:bg-[#eaf3f1] dark:text-[#16292b]">
                2
              </span>
              <h2 className="text-[15.5px] font-semibold">Add products</h2>

              <div className="ml-auto flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-none">
                <select
                  aria-label="Filter products by category"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-10 min-w-40 rounded-[10px] border border-[#e3e9e8] bg-white px-3 text-[12.5px] text-[#3f5254] outline-none focus:border-[#00beaa] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]"
                >
                  <option value="all">All categories</option>
                  {pickerCategories.map((category) => (
                    <option key={category} value={category}>
                      {PRODUCT_CATEGORY.find((option) => option.value === category)
                        ?.name ?? category}
                    </option>
                  ))}
                </select>
                <div className="relative min-w-48 flex-1 sm:w-[220px] sm:flex-none">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#93a5a5]" />
                  <Input
                    aria-label="Search products for order"
                    placeholder="Search products"
                    value={productSearch}
                    onChange={(event) => setProductSearch(event.target.value)}
                    className="h-10 rounded-[10px] border-[#e3e9e8] bg-[#f8fafa] pl-9 text-[13px] shadow-none dark:border-[#2b4340] dark:bg-[#16292b]"
                  />
                </div>
              </div>
            </div>

            {filteredProducts.length ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,216px),1fr))] gap-3 px-[22px] pb-[22px]">
                {filteredProducts.map((product) => (
                  <OrderProductCard
                    key={product.id ?? product.title}
                    product={product}
                    isSelected={carts.some((cartItem) => cartItem.id === product.id)}
                    onClick={() => addToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="px-6 pb-10 pt-7 text-center">
                <p className="text-[13.5px] font-semibold">No products found</p>
                <p className="mt-1 text-xs text-[#93a5a5]">
                  Try another search or category.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f] lg:sticky lg:top-[84px]">
          <div className="bg-gradient-to-br from-[#0c4b47] via-[#0e8a80] to-[#12cdbe] px-5 py-[17px] text-white">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[14.5px] font-semibold">Order summary</h2>
              <span className="ml-auto rounded-full bg-white/20 px-2.5 py-1 font-mono text-[11px]">
                {cartQuantity} pcs
              </span>
            </div>
            <p className="mt-1 text-[11.5px] text-white/75">
              {carts.length} line {carts.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {carts.length ? (
            <OrderCartList />
          ) : (
            <div className="px-[22px] py-10 text-center">
              <span className="mx-auto mb-3 grid size-11 place-items-center rounded-[13px] bg-[#f2f5f4] text-[#93a5a5] dark:bg-[#16292b]">
                <PackagePlus className="size-5" strokeWidth={1.7} />
              </span>
              <p className="text-[13.5px] font-semibold">No items yet</p>
              <p className="mt-1 text-xs leading-relaxed text-[#93a5a5]">
                Add products from the picker to build this order.
              </p>
            </div>
          )}

          <div className="border-t border-[#edf1f0] bg-[#fbfcfc] px-5 pb-5 pt-4 dark:border-[#1e322f] dark:bg-[#16292b]">
            <div className="mb-2 flex items-center gap-2 text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0]">
              <span>Subtotal</span>
              <span className="ml-auto font-mono">{formatOrderCurrency(total)}</span>
            </div>
            <div className="mb-3.5 flex items-center gap-2 text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0]">
              <span>Discount</span>
              <span className="ml-auto font-mono">{formatOrderCurrency(0)}</span>
            </div>
            <div className="flex items-baseline gap-2 border-t border-[#e3e9e8] pt-3 dark:border-[#2b4340]">
              <span className="text-[13px] font-semibold">Total</span>
              <span className="ml-auto text-[22px] font-semibold tracking-[-0.03em]">
                {formatOrderCurrency(total)}
              </span>
            </div>
            <Button
              type="submit"
              form={orderFormId}
              disabled={!carts.length || isSubmitting}
              className="mt-4 h-[46px] w-full rounded-xl bg-[#0c4b47] text-sm font-semibold text-white hover:bg-[#007f78]"
            >
              {isSubmitting ? 'Placing order…' : 'Place order'}
            </Button>
            <p className="mt-2.5 text-center text-[11px] text-[#93a5a5]">
              Saved as pending — stock moves on completion.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
