'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useOrderStore } from '@/features/orders/useOrderStore'
import { useToast } from '@/hooks/useToast'
import { toast } 
from 'sonner'
import { useApi } from '@/hooks/useApi'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useOrders } from '@/features/orders/hooks/useOrders'
import { ORDER_STATUS } from '@/constants'
import type { OrderStatus, OrderData } from '@/features/orders/order.type'

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, ArrowLeft, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input';
import Loading from '@/components/organisms/Loading'
import { Button } from '@/components/ui/button'
import OrderCard from '@/features/orders/components/OrderCard'
import Order from '@/features/orders/components/Order'

export default function index() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('pending')

  const { productsQuery } = useProducts()
  const { customerQuery } = useCustomers()
  const { ordersQuery, addOrder, deleteOrder, updateOrderStatus } = useOrders()

  const api = useApi()
  const appToast = useToast()
  const confirmation = useConfirmation()
  const { carts, resetCart, showForm, setShowForm, resetOrderForm, orderState, setOrderState } = useOrderStore()

  const orders = ordersQuery.data ?? []

  const filteredOrders = useMemo(() => {
    const searchKey = searchQuery.trim().toLowerCase()

    return orders.filter((order: OrderData) => {
      const matchStatus = filterStatus === 'all' || order.status === filterStatus
  
      const orderName = order?.orderName?.toLowerCase() ?? ''
      const customerName = order?.customer?.name?.toLowerCase() ?? ''
  
      const matchSearch = orderName.includes(searchKey) || customerName.includes(searchKey)
  
      return matchStatus && matchSearch
    })

  }, [orders, searchQuery, filterStatus])

  const total = carts.reduce<number>((sum, item) => sum + item.price * (item.quantity ?? 0), 0);

  // wait to fetch all data
  const isLoading = productsQuery.isLoading || customerQuery.isLoading || ordersQuery.isLoading
  const isError = productsQuery.isError || customerQuery.isError || ordersQuery.isError

  if (isLoading) return <Loading />

  if (isError) {
    return (
      <div className='p-4'>
        Something went wrong loading data.
      </div>
    )
  }

  const handleUpdate = async (data: any) => {
    console.log('Update: ')
    console.log(data)
  }

  const handleDelete = async (id: number) => {
    const confirm = await confirmation('Are you sure?', 'Delete this order?')
    if (!confirm) return

    await deleteOrder.mutateAsync(id)
  }

  const handleUpdateStatus = async (id: number, status: OrderStatus) => {
    const statusName =  ORDER_STATUS.find((item) => item.value === status)?.name ?? ''

    const confirm = await confirmation('Are you sure', `You want to update the order status to ${statusName}`)
    if (!confirm) return

    await updateOrderStatus.mutateAsync({id, status})

    setFilterStatus(status)
  }

  const returnToMainPage = async () => {
    const confirm = await confirmation('Are you sure?', 'Unsaved data will be lost.')
    if (!confirm) return

    setOrderState('show_orders')
  }

  const cartsArray = carts.map((item) => {
    return {
      productId: item.id,
      price: item.price,
      quantity: item.quantity,
    }
  })

  const checkout = async (data: any) => {
    const form = {
      orderName: data.orderName ?? null,
      customerId: data.customerId ?? null,
      notes: data.notes ?? null,
      orderItems: cartsArray,
      totalAmount: String(total),
      status: 'pending'
    }
    
    const toastId = appToast.loading({
      title: "Checking out orders...",
      description: "Please wait..."
    })

    try {
      addOrder.mutateAsync(form)

      resetOrderForm()
      setShowForm(false)
      resetCart()
      setOrderState('show_orders')

      appToast.success({
        title: 'Orders sucessfully created',
        description: 'The new record has been saved.'
      })
    } catch (error) {
      appToast.error({
        title: 'Failed to proccess the orders',
        description: 'Please try again.'
      })
    } finally {
      toast.dismiss(toastId)
    }
  }

  return (
    <>
      <div className={cn('flex items-center mx-3', orderState === 'show_orders' ? 'justify-between' : 'justify-end')}>
        { orderState === 'show_orders' && (
          <div className="flex flex-row w-full lg:w-1/3 gap-3">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='gap-2'>
                  <Filter className='h-4 w-4' />
                  <span className='text-sm'>
                    {filterStatus === 'all' ? 'All Status' : ORDER_STATUS.find((item) => item.value === filterStatus)?.name ?? ''}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked={filterStatus === 'all'}
                  onCheckedChange={() => setFilterStatus('all')}
                >
                  All
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                {ORDER_STATUS.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status.value}
                    checked={filterStatus === status.value}
                    onCheckedChange={() => setFilterStatus(status.value)}
                  >
                    {status.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <Button
          onClick={() =>  orderState === 'show_orders' ? setOrderState('add_order') : returnToMainPage()}
          variant="outline"
          className={cn(
            "text-white flex items-center gap-2 mb-2",
            orderState === 'show_orders' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-sky-600 hover:bg-sky-700'
          )}
        >
          {orderState === 'show_orders' ? <Plus className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" /> }
          {orderState === 'show_orders' ? 'Create Order' : 'Go Back'}
        </Button>
      </div>

      {orderState === 'show_orders' 
        ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 mt-3">
            {/* TODO:  add strict type here.. */}
            {filteredOrders.map((order: any, index: number) => (
              <OrderCard 
                key={order.id}
                order={order}
                orderNumber={index + 1}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                updateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        ) : (
          <Order 
            products={productsQuery.data}
            triggerCheckout={checkout}
          />
      )}
    </>
  );
}
  