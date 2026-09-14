import { Minus, Plus, X } from 'lucide-react'
import { useOrderStore } from '@/features/orders/useOrderStore'
import {
  formatOrderCurrency,
  parseOrderQuantity,
} from '@/features/orders/order.utils'

export default function OrderCartList() {
  const {
    carts,
    removeFromCart,
    increaseItem,
    decreaseItem,
    setItemQuantity,
  } = useOrderStore()

  return (
    <div className="divide-y divide-[#edf1f0] dark:divide-[#1e322f]">
      {carts.map((cartItem) => {
        const quantity = cartItem.quantity ?? 0

        return (
          <div key={cartItem.id} className="space-y-2.5 px-5 py-3">
            <div className="flex items-start gap-2.5">
              <p className="min-w-0 flex-1 text-[12.5px] font-semibold leading-snug text-[#16292b] dark:text-[#eaf3f1]">
                {cartItem.title}
              </p>
              <button
                type="button"
                onClick={() => removeFromCart(cartItem.id)}
                aria-label={`Remove ${cartItem.title} from order`}
                className="grid size-6 shrink-0 place-items-center rounded-[7px] border border-[#e3e9e8] bg-white text-[#7c8e8e] transition-colors hover:border-[#dc2626] hover:bg-[#fdecec] hover:text-[#b01c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f]"
              >
                <X className="size-3" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center overflow-hidden rounded-[9px] border border-[#e3e9e8] dark:border-[#2b4340]">
                <button
                  type="button"
                  onClick={() => decreaseItem(cartItem.id)}
                  aria-label={`Decrease ${cartItem.title} quantity`}
                  className="grid size-[27px] place-items-center bg-[#f8fafa] text-[#3f5254] transition-colors hover:bg-[#edf1f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#12cdbe] dark:bg-[#16292b] dark:text-[#c3d4d1]"
                >
                  <Minus className="size-3" />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[1-9][0-9]*"
                  value={quantity}
                  onFocus={(event) => event.currentTarget.select()}
                  onChange={(event) => {
                    const nextQuantity = parseOrderQuantity(
                      event.currentTarget.value,
                    )

                    if (nextQuantity === null) return

                    setItemQuantity(cartItem.id, nextQuantity)
                  }}
                  aria-label={`${cartItem.title} quantity`}
                  className="h-[27px] w-10 border-x border-[#e3e9e8] bg-white text-center font-mono text-[12.5px] text-[#16292b] outline-none focus:ring-2 focus:ring-inset focus:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#eaf3f1]"
                />
                <button
                  type="button"
                  onClick={() => increaseItem(cartItem.id)}
                  disabled={quantity >= cartItem.stock}
                  aria-label={`Increase ${cartItem.title} quantity`}
                  className="grid size-[27px] place-items-center bg-[#f8fafa] text-[#3f5254] transition-colors hover:bg-[#edf1f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#12cdbe] disabled:cursor-not-allowed disabled:opacity-35 dark:bg-[#16292b] dark:text-[#c3d4d1]"
                >
                  <Plus className="size-3" />
                </button>
              </div>
              <span className="text-[11.5px] text-[#93a5a5]">
                × {formatOrderCurrency(cartItem.price)}
              </span>
              <span className="ml-auto font-mono text-[13px] font-medium text-[#16292b] dark:text-[#eaf3f1]">
                {formatOrderCurrency(cartItem.price * quantity)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
