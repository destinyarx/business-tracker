'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  Filter,
  ListFilter,
  PackageOpen,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { ORDER_STATUS } from '@/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Loading from '@/components/organisms/Loading'
import Order from '@/features/orders/components/Order'
import OrderCard from '@/features/orders/components/OrderCard'
import OrderForm from '@/features/orders/components/OrderForm'
import OrderReversalDialog from '@/features/orders/components/OrderReversalDialog'
import { useOrderMutation } from '@/features/orders/hooks/useOrderMutation'
import { useOrderQuery } from '@/features/orders/hooks/useOrderQuery'
import type { OrderFormValues } from '@/features/orders/order.schema'
import type {
  CreateOrderCommand,
  OrderData,
  OrderDateRange,
  OrderParams,
  OrderStatus,
  UpdateOrderCommand,
} from '@/features/orders/order.type'
import { useOrderStore } from '@/features/orders/useOrderStore'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useToast } from '@/hooks/useToast'

const ordersPerPage = 6

const filterTriggerClassName =
  "h-[38px] w-fit rounded-full border-[#e3e9e8] bg-white px-3 text-[12.5px] font-medium text-[#3f5254] shadow-none transition-colors hover:bg-white focus-visible:border-[#00beaa] focus-visible:ring-0 dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1] dark:hover:bg-[#12201f] [&>svg:last-child]:size-3.5 [&>svg:last-child]:opacity-100"
const filterContentClassName =
  "min-w-[168px] rounded-xl border-[#dce3e2] bg-white p-1.5 shadow-[0_12px_32px_-12px_rgba(22,41,43,0.28)] dark:border-[#2b4340] dark:bg-[#12201f] [&_[data-radix-select-viewport]]:h-auto [&_[data-radix-select-viewport]]:p-0"
const filterItemClassName =
  "min-h-10 cursor-pointer rounded-lg py-2.5 pl-3 pr-9 text-[12.5px] font-medium text-[#3f5254] focus:bg-[#edf8f6] focus:text-[#075c57] dark:text-[#c3d4d1] dark:focus:bg-[#1b3532] dark:focus:text-[#eaf3f1]"

const orderDateRanges: { label: string; value: OrderDateRange }[] = [
  { label: 'All dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This week', value: 'this_week' },
]

type PendingReversal = {
  order: OrderData
  status: OrderStatus
}

const isOrderStatus = (status: string): status is OrderStatus =>
  status === 'pending' ||
  status === 'in_progress' ||
  status === 'completed' ||
  status === 'cancelled' ||
  status === 'failed'

const isOrderDateRange = (range: string): range is OrderDateRange =>
  range === 'all' ||
  range === 'today' ||
  range === 'yesterday' ||
  range === 'this_week'

export default function OrdersPage() {
  const appToast = useToast()
  const confirmation = useConfirmation()
  const { productsQuery } = useProducts()
  const { customerQuery } = useCustomers()
  const { addOrder, deleteOrder, updateOrder, updateOrderStatus } =
    useOrderMutation()
  const {
    carts,
    resetCart,
    resetOrderForm,
    orderState,
    setOrderState,
  } = useOrderStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(
    'pending',
  )
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [dateRange, setDateRange] = useState<OrderDateRange>('all')
  const [editingOrder, setEditingOrder] = useState<OrderData | null>(null)
  const [pendingReversal, setPendingReversal] =
    useState<PendingReversal | null>(null)

  useEffect(() => {
    const searchDelay = window.setTimeout(() => {
      setCurrentPage(1)
      setDebouncedSearch(searchQuery.trim())
    }, 500)

    return () => window.clearTimeout(searchDelay)
  }, [searchQuery])

  const orderParams: OrderParams = {
    filter: statusFilter,
    searchKey: debouncedSearch || undefined,
    offset: (currentPage - 1) * ordersPerPage,
    limit: ordersPerPage,
    sort,
    timePeriod: dateRange,
  }
  const { ordersQuery } = useOrderQuery(orderParams)
  const orders = ordersQuery.data?.orders ?? []
  const availableProducts = useMemo(
    () => (productsQuery.data ?? []).filter((product) => product.stock > 0),
    [productsQuery.data],
  )
  const total = carts.reduce(
    (amount, cartItem) => amount + cartItem.price * (cartItem.quantity ?? 0),
    0,
  )

  const selectStatusFilter = (status?: OrderStatus): void => {
    setCurrentPage(1)
    setStatusFilter(status)
  }

  const handleDelete = async (orderId: number): Promise<void> => {
    const confirmed = await confirmation(
      'Delete this order?',
      'This order will be permanently removed. This action cannot be undone.',
      {
        confirmText: 'Delete order',
        destructive: true,
      },
    )
    if (!confirmed) return

    try {
      await appToast.loadingPromise(deleteOrder.mutateAsync(orderId), {
        loadingTitle: 'Deleting order...',
        successTitle: 'Order deleted',
        errorTitle: 'Failed to delete order',
        errorDescription: (error) => error.message,
      })
    } catch {
      return
    }
  }

  const commitStatusUpdate = async (
    order: OrderData,
    status: OrderStatus,
    reversalReason?: string,
  ): Promise<void> => {
    await appToast.loadingPromise(
      updateOrderStatus.mutateAsync({ data: order, status, reversalReason }),
      {
        loadingTitle: 'Updating order status...',
        successTitle: 'Order status updated',
        errorTitle: 'Failed to update order status',
        errorDescription: (error) => error.message,
      },
    )
    selectStatusFilter(status)
  }

  const handleUpdateStatus = async (
    order: OrderData,
    status: OrderStatus,
  ): Promise<void> => {
    if (order.status === 'completed' && status !== 'completed') {
      setPendingReversal({ order, status })
      return
    }

    const statusName =
      ORDER_STATUS.find((statusOption) => statusOption.value === status)?.name ??
      status
    const confirmed = await confirmation(
      'Update order status?',
      `Move this order to ${statusName}?`,
      { confirmText: 'Update status' },
    )
    if (!confirmed) return

    try {
      await commitStatusUpdate(order, status)
    } catch {
      return
    }
  }

  const submitReversal = async (reversalReason: string): Promise<void> => {
    if (!pendingReversal) return

    try {
      await commitStatusUpdate(
        pendingReversal.order,
        pendingReversal.status,
        reversalReason,
      )
      setPendingReversal(null)
    } catch {
      return
    }
  }

  const returnToOrders = async (): Promise<void> => {
    if (carts.length) {
      const confirmed = await confirmation(
        'Leave this order?',
        'The items currently in the order will be cleared.',
        { confirmText: 'Leave order', destructive: true },
      )
      if (!confirmed) return
    }

    resetCart()
    resetOrderForm()
    setOrderState('show_orders')
  }

  const checkout = async (orderValues: OrderFormValues): Promise<void> => {
    if (!carts.length) return

    const orderItems = carts.map((cartItem) => ({
      id: cartItem.id,
      price: cartItem.price,
      quantity: cartItem.quantity ?? 0,
      profit: cartItem.profit,
    }))
    const command: CreateOrderCommand = {
      orderName: orderValues.orderName?.trim() || null,
      customerId: orderValues.customerId,
      notes: orderValues.notes?.trim() || null,
      orderItems,
      totalAmount: String(total),
      status: 'pending',
    }
    const confirmed = await confirmation(
      'Place this order?',
      'Review the order details and products before placing it in the pending queue.',
      { confirmText: 'Place order' },
    )
    if (!confirmed) return

    try {
      await appToast.loadingPromise(addOrder.mutateAsync(command), {
        loadingTitle: 'Placing order...',
        successTitle: 'Order created',
        successDescription: 'The order was added to the pending queue.',
        errorTitle: 'Failed to create order',
        errorDescription: 'Please check the order and try again.',
      })
      resetOrderForm()
      resetCart()
      selectStatusFilter('pending')
      setOrderState('show_orders')
    } catch {
      return
    }
  }

  const saveOrderChanges = async (
    orderValues: OrderFormValues,
  ): Promise<void> => {
    if (!editingOrder?.id) return
    if (editingOrder.status === 'completed') {
      appToast.error({
        title: 'Completed orders cannot be edited',
        description: 'Move the order out of completed before changing its details.',
      })
      setEditingOrder(null)
      return
    }

    const command: UpdateOrderCommand = {
      orderName: orderValues.orderName?.trim() || undefined,
      customerId: orderValues.customerId,
      notes: orderValues.notes?.trim() || undefined,
    }

    try {
      await appToast.loadingPromise(
        updateOrder.mutateAsync({ id: editingOrder.id, data: command }),
        {
          loadingTitle: 'Updating order...',
          successTitle: 'Order updated',
          successDescription: 'The order details have been saved.',
          errorTitle: 'Failed to update order',
          errorDescription: (error) => error.message,
        },
      )
      setEditingOrder(null)
    } catch {
      return
    }
  }

  const isLoading =
    ordersQuery.isLoading || productsQuery.isLoading || customerQuery.isLoading
  const isError =
    ordersQuery.isError || productsQuery.isError || customerQuery.isError

  if (isLoading) return <Loading />

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[420px] w-full max-w-[1480px] items-center justify-center rounded-[20px] border border-[#e3e9e8] bg-white p-8 text-center dark:border-[#243936] dark:bg-[#12201f]">
        <div>
          <p className="text-[15px] font-semibold">Orders could not be loaded</p>
          <p className="mt-1 text-xs text-[#93a5a5]">
            Check your connection, then try again.
          </p>
          <Button
            type="button"
            onClick={() => {
              ordersQuery.refetch()
              productsQuery.refetch()
              customerQuery.refetch()
            }}
            className="mt-4 rounded-[10px] bg-[#0c4b47] text-white hover:bg-[#007f78]"
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  if (orderState !== 'show_orders') {
    return (
      <Order
        products={availableProducts}
        triggerCheckout={checkout}
        onBack={returnToOrders}
        isSubmitting={addOrder.isPending}
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] text-[#16292b] dark:text-[#eaf3f1]">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
          <div className="flex min-w-52 max-w-[320px] flex-1 items-center overflow-hidden rounded-full border border-[#e3e9e8] bg-[#f6f8f8] dark:border-[#243936] dark:bg-[#16292b]">
            <Input
              aria-label="Search orders"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 flex-1 border-0 bg-transparent px-4 text-[13px] shadow-none focus-visible:ring-0"
            />
            <Search className="mr-4 size-4 text-[#7c8e8e]" />
          </div>

          <Select
            value={statusFilter ?? 'all'}
            onValueChange={(selectedStatus) => {
              selectStatusFilter(
                isOrderStatus(selectedStatus) ? selectedStatus : undefined,
              )
            }}
          >
            <SelectTrigger
              aria-label="Filter orders by status"
              className={filterTriggerClassName}
            >
              <Filter className="size-3.5 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className={filterContentClassName}>
              <SelectItem value="all" className={filterItemClassName}>
                All statuses
              </SelectItem>
              {ORDER_STATUS.map((statusOption) => (
                <SelectItem
                  key={statusOption.value}
                  value={statusOption.value}
                  className={filterItemClassName}
                >
                  {statusOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(selectedSort) => {
              setCurrentPage(1)
              setSort(selectedSort === 'asc' ? 'asc' : 'desc')
            }}
          >
            <SelectTrigger
              aria-label="Sort orders by date"
              className={filterTriggerClassName}
            >
              <ListFilter className="size-3.5 shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className={filterContentClassName}>
              <SelectItem value="desc" className={filterItemClassName}>
                Newest first
              </SelectItem>
              <SelectItem value="asc" className={filterItemClassName}>
                Oldest first
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={dateRange}
            onValueChange={(selectedRange) => {
              if (!isOrderDateRange(selectedRange)) return

              setCurrentPage(1)
              setDateRange(selectedRange)
            }}
          >
            <SelectTrigger
              aria-label="Filter orders by order date"
              className={filterTriggerClassName}
            >
              <CalendarRange className="size-3.5 shrink-0 text-[#007f78] dark:text-[#7fe0da]" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className={filterContentClassName}>
              {orderDateRanges.map((range) => (
                <SelectItem
                  key={range.value}
                  value={range.value}
                  className={filterItemClassName}
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={() => setOrderState('add_order')}
          className="h-10 rounded-[11px] bg-[#0c4b47] px-[18px] text-[13px] font-semibold text-white hover:bg-[#007f78]"
        >
          <Plus className="size-4" />
          New order
        </Button>
      </div>

      {orders.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-3.5">
          {orders.map((order) => (
            <OrderCard
              key={order.id ?? `${order.createdAt}-${order.orderName}`}
              order={order}
              onUpdate={(selectedOrder) => {
                if (selectedOrder.status !== 'completed') {
                  setEditingOrder(selectedOrder)
                }
              }}
              onDelete={handleDelete}
              updateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-[#e3e9e8] bg-white px-6 py-16 text-center dark:border-[#243936] dark:bg-[#12201f]">
          <span className="mx-auto mb-3 grid size-12 place-items-center rounded-[14px] bg-[#f2f5f4] text-[#7c8e8e] dark:bg-[#16292b]">
            <PackageOpen className="size-5" />
          </span>
          <p className="text-[14px] font-semibold">No orders found</p>
          <p className="mt-1 text-xs text-[#93a5a5]">
            Try another search or status, or create a new order.
          </p>
        </div>
      )}

      {!!orders.length && (
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="h-9 rounded-[9px] border-[#dce3e2] bg-white text-xs dark:border-[#2b4340] dark:bg-[#12201f]"
          >
            <ArrowLeft className="size-3.5" />
            Previous
          </Button>
          <span className="grid size-[30px] place-items-center rounded-[9px] bg-slate-800 text-xs font-semibold text-white">
            {currentPage}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!ordersQuery.data?.hasNext}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="h-9 rounded-[9px] border-[#dce3e2] bg-white text-xs dark:border-[#2b4340] dark:bg-[#12201f]"
          >
            Next
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}

      <Sheet
        open={Boolean(editingOrder)}
        onOpenChange={(open) => !open && setEditingOrder(null)}
      >
        <SheetContent className="w-[470px] max-w-[94vw] gap-0 border-l-0 bg-white p-0 shadow-[-30px_0_60px_-30px_rgba(11,32,33,0.5)] dark:bg-[#12201f] sm:max-w-[470px] [&>button]:hidden">
          <SheetHeader className="flex-row items-start gap-3 border-b border-[#edf1f0] px-[22px] py-4 text-left dark:border-[#1e322f]">
            <span className="w-1 shrink-0 self-stretch rounded-full bg-gradient-to-b from-[#12cdbe] to-[#0c4b47]" />
            <div className="min-w-0 flex-1">
              <SheetDescription className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#93a5a5]">
                Orders / Edit details
              </SheetDescription>
              <SheetTitle className="text-[19px] font-semibold tracking-[-0.02em]">
                Edit order
              </SheetTitle>
              <p className="mt-1 truncate text-[11.5px] text-[#7c8e8e]">
                Order #{editingOrder?.id}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingOrder(null)}
              aria-label="Close order form"
              className="grid size-8 place-items-center rounded-[10px] border border-[#e3e9e8] bg-white transition-colors hover:border-[#16292b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f]"
            >
              <X className="size-4" />
            </button>
          </SheetHeader>
          {editingOrder && (
            <div className="flex-1 overflow-y-auto px-[22px] py-5">
              <OrderForm
                key={editingOrder.id}
                customers={customerQuery.data ?? []}
                initialValues={editingOrder}
                onSubmit={saveOrderChanges}
                formId="edit-order-details"
                showSubmitButton
                submitLabel="Update order"
                isSubmitting={updateOrder.isPending}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <OrderReversalDialog
        open={Boolean(pendingReversal)}
        targetStatus={pendingReversal?.status}
        isSubmitting={updateOrderStatus.isPending}
        onCancel={() => setPendingReversal(null)}
        onSubmit={submitReversal}
      />
    </div>
  )
}
