'use client'

import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useOrderStore } from '@/features/orders/useOrderStore'
import { useToast } from '@/hooks/useToast'
import { toast }  from 'sonner'
import { useCustomers } from '@/features/customers/hooks/useCustomers'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useOrderMutation } from '@/features/orders/hooks/useOrderMutation'
import { useOrderQuery } from '@/features/orders/hooks/useOrderQuery'
import { ORDER_STATUS } from '@/constants'
import type { OrderStatus, OrderData } from '@/features/orders/order.type'
import type { Product } from '@/features/products/products.types'

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, ArrowLeft, Search, Filter, ArrowRight, ListFilter } from 'lucide-react'
import { Input } from '@/components/ui/input';
import Loading from '@/components/organisms/Loading'
import { Button } from '@/components/ui/button'
import OrderCard from '@/features/orders/components/OrderCard'
import Order from '@/features/orders/components/Order'
import { OrderParams } from '@/features/orders/order.type'
import NoItemFound from '@/components/organisms/NoItemFound'

export default function index() {
  const appToast = useToast()
  const confirmation = useConfirmation()
  const { productsQuery } = useProducts()
  const { customerQuery } = useCustomers()
  const { addOrder, deleteOrder, updateOrderStatus } = useOrderMutation()
  const { carts, resetCart, showForm, setShowForm, resetOrderForm, orderState, setOrderState } = useOrderStore()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filter, setFilter] = useState<string|undefined>('pending')
  const [params, setParams] = useState<OrderParams>({
    filter: filter,
    searchKey: undefined,
    offset: 0,
    limit: 6,
    sort: 'desc'
  })

  useEffect(() => {
    if (params.filter !== filter) {
      setCurrentPage(1)
    }

    if (params?.limit) {
      setParams((prev) => ({
        ...prev,
        filter: filter,
        offset: currentPage !== 1 ? ((currentPage * params.limit!) - params.limit! + 1) : 0,
        searchKey: debouncedSearch || undefined
      }))
    }

    console.log(params)
  }, [currentPage, filter, debouncedSearch])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    console.log("params updated:", params);
    console.log()
  }, [params]);

  // order list pagination
  const { ordersQuery } = useOrderQuery(params)
  const hasNext = ordersQuery.data?.hasNext ?? false

  const orders = ordersQuery.data?.orders ?? []
  
  const availableProducts = useMemo(() => {
    return (productsQuery.data ?? []).filter((product: Product) => product.stock > 0)
  }, [productsQuery.data])

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

  // TODO: add update function
  const handleUpdate = async (data: any) => {
    console.log('Update: ')
    console.log(data)
  }

  const handleDelete = async (id: number) => {
    const confirm = await confirmation('Are you sure?', 'Delete this order?')
    if (!confirm) return

    await deleteOrder.mutateAsync(id)
  }

  const handleUpdateStatus = async (data: OrderData, status: OrderStatus) => {
    const statusName =  ORDER_STATUS.find((item) => item.value === status)?.name ?? ''

    const confirm = await confirmation('Are you sure', `You want to update the order status to ${statusName}`)
    if (!confirm) return

    await updateOrderStatus.mutateAsync({data, status})

    setFilter(status)
  }

  const returnToMainPage = async () => {
    const confirm = await confirmation('Are you sure?', 'Unsaved data will be lost.')
    if (!confirm) return

    setOrderState('show_orders')
  }

  const cartsArray = carts.map((item) => {
    return {
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      profit: item.profit
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

    const confirm = await confirmation('Confirm Order', `Please review your order items and details before placing the order.`)
    if (!confirm) return
    
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
                    {!filter ? 'All Status' : ORDER_STATUS.find((item) => item.value === filter)?.name ?? ''}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked={!filter}
                  onCheckedChange={() => setFilter(undefined)}
                >
                  All
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                {ORDER_STATUS.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status.value}
                    checked={filter === status.value}
                    onCheckedChange={() => setFilter(status.value)}
                  >
                    {status.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='gap-2'>
                    <ListFilter className="h-4 w-4 text-amber-500" />
                    <span className='text-sm'>
                        {params.sort === 'asc' ? 'Oldest First' : 'Newest First'}
                    </span>
                  </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end' className='w-52'>
                    <DropdownMenuCheckboxItem
                        checked={params.sort == 'desc'}
                        onCheckedChange={() => setParams((prev) => ({ ...prev, sort: 'desc' }))}
                    >
                        Latest to oldest
                    </DropdownMenuCheckboxItem>

                    <DropdownMenuCheckboxItem
                        checked={params.sort == 'asc'}
                        onCheckedChange={() => setParams((prev) => ({ ...prev, sort: 'asc' }))}
                    >
                        Oldest to latest
                    </DropdownMenuCheckboxItem>
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
          <>
            {!orders.length && (
              <NoItemFound />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-3 mt-3">
              {orders.map((order: OrderData, index: number) => (
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


            {!!ordersQuery?.data?.orders?.length && (
              <div className="flex w-full items-center justify-end gap-2 px-4 py-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="bg-teal-600 text-white hover:bg-teal-700"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Previous
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNext}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="bg-teal-600 text-white hover:bg-teal-700"
                >
                    Next
                    <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Order 
            products={availableProducts ?? []}
            triggerCheckout={checkout}
          />
      )}
    </>
  );
}
  