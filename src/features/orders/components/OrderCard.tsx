import { format } from 'date-fns'
import { ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { ORDER_STATUS } from '@/constants'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type {
  OrderData,
  OrderLineItem,
  OrderStatus,
} from '@/features/orders/order.type'
import { formatOrderCurrency } from '@/features/orders/order.utils'

interface OrderCardProps {
  order: OrderData
  onDelete: (orderId: number) => void | Promise<void>
  onUpdate: (order: OrderData) => void
  updateStatus: (order: OrderData, status: OrderStatus) => void | Promise<void>
}

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-[#fff7e0] text-[#8a6100] dark:bg-[#4a3818] dark:text-[#ffd66b]',
  in_progress: 'bg-[#e6f0fe] text-[#1d4ed8] dark:bg-[#17315a] dark:text-[#8cb8ff]',
  completed: 'bg-[#e4f7f4] text-[#00706a] dark:bg-[#173d39] dark:text-[#55ddd0]',
  cancelled: 'bg-[#fdecec] text-[#b01c1c] dark:bg-[#4a2020] dark:text-[#ff9999]',
  failed: 'bg-[#f4e9ea] text-[#8f2630] dark:bg-[#422126] dark:text-[#ff9ca5]',
}

const getOrderTotal = (orderItems: OrderLineItem[]): number =>
  orderItems.reduce(
    (total, orderItem) =>
      total + orderItem.priceAtPurchase * orderItem.quantity,
    0,
  )

const getInitials = (label: string): string =>
  label
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export default function OrderCard({
  order,
  onDelete,
  onUpdate,
  updateStatus,
}: OrderCardProps) {
  const status = order.status ?? 'pending'
  const customerName = order.customer?.name?.trim() || 'Guest customer'
  const displayName = order.orderName?.trim() || customerName
  const totalQuantity = order.items.reduce(
    (quantity, orderItem) => quantity + orderItem.quantity,
    0,
  )
  const orderTotal = order.totalAmount ?? getOrderTotal(order.items)
  const statusLabel =
    ORDER_STATUS.find((statusOption) => statusOption.value === status)?.name ??
    (status === 'failed' ? 'Failed' : 'Pending')

  return (
    <article className="flex min-h-[280px] flex-col gap-3.5 rounded-[18px] border border-[#e3e9e8] bg-white px-[18px] pb-[15px] pt-[17px] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#c2e7e2] hover:shadow-[0_18px_34px_-28px_rgba(12,75,71,0.5)] dark:border-[#243936] dark:bg-[#12201f] dark:hover:border-[#2f625d]">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-[#f2f5f4] text-xs font-bold text-[#3f5254] dark:bg-[#16292b] dark:text-[#c3d4d1]">
          {getInitials(customerName) || 'G'}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-mono text-[11px] text-[#7c8e8e]">
              #{order.id ?? '—'}
            </span>
            <span className="text-[11px] text-[#b7c3c3]">
              {format(new Date(order.createdAt), 'MMM d, yyyy · h:mm a')}
            </span>
          </div>
          <h2 className="mt-0.5 truncate text-[14.5px] font-semibold tracking-[-0.01em]">
            {displayName}
          </h2>
          <p className="mt-0.5 truncate text-xs text-[#5f7273] dark:text-[#9fb3b0]">
            {customerName}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${statusStyles[status]}`}
        >
          {statusLabel}
        </span>
      </div>

      {order.notes && (
        <p className="line-clamp-2 text-[11.5px] leading-relaxed text-[#7c8e8e] dark:text-[#9fb3b0]">
          {order.notes}
        </p>
      )}

      <div className="flex-1 border-t border-dashed border-[#e3e9e8] pt-3 dark:border-[#2b4340]">
        <div className="max-h-[78px] space-y-[7px] overflow-y-auto pr-1">
          {order.items.map((orderItem, index) => (
            <div
              key={orderItem.id ?? `${orderItem.product?.id ?? 'item'}-${index}`}
              className="flex items-center gap-2.5 text-[12.5px]"
            >
              <span className="min-w-[26px] font-mono text-[#007f78] dark:text-[#55ddd0]">
                {orderItem.quantity}×
              </span>
              <span className="min-w-0 flex-1 truncate text-[#3f5254] dark:text-[#c3d4d1]">
                {orderItem.product?.title ?? 'Unavailable product'}
              </span>
              <span className="font-mono text-[11.5px] text-[#5f7273] dark:text-[#9fb3b0]">
                {formatOrderCurrency(orderItem.priceAtPurchase * orderItem.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-end gap-2 border-t border-[#edf1f0] pt-3 dark:border-[#1e322f]">
        <div className="mr-auto">
          <p className="text-[10.5px] text-[#7c8e8e]">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
          </p>
          <p className="text-[17px] font-semibold tracking-[-0.02em]">
            {formatOrderCurrency(orderTotal)}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onUpdate(order)}
          className="h-8 rounded-[10px] border-[#dce3e2] px-3 text-xs font-medium dark:border-[#2b4340] dark:bg-[#12201f]"
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!order.id}
          onClick={() => order.id && onDelete(order.id)}
          className="h-8 rounded-[10px] border-[#f1cccc] px-3 text-xs font-medium text-[#b01c1c] hover:bg-[#fdecec] hover:text-[#b01c1c] dark:border-[#663535] dark:bg-[#12201f]"
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-[10px] bg-[#e4f7f4] px-3 text-xs font-semibold text-[#00706a] hover:bg-[#12cdbe] hover:text-white dark:bg-[#173d39] dark:text-[#55ddd0]"
            >
              Update status
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {ORDER_STATUS.filter(
              (statusOption) => statusOption.value !== status,
            ).map((statusOption) => (
              <DropdownMenuItem
                key={statusOption.value}
                onClick={() => updateStatus(order, statusOption.value)}
                className="cursor-pointer text-[13px]"
              >
                {statusOption.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  )
}
