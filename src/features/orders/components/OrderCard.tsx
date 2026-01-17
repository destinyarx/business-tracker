import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { OrderData } from '@/features/orders/order.type'
import { ORDER_STATUS } from '@/constants'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button'
import { Pencil, Trash, CircleUserRound } from 'lucide-react'
import { CartItem } from '@/features/orders/order.type'

type Props = {
    order: OrderData,
    orderNumber: number,
    onDelete: (id: number) => void,
    onUpdate: (data: OrderData) => void,
    updateStatus: (id: number, status: string) => void
}

export default function OrderCard({ order, orderNumber, onDelete, onUpdate, updateStatus }: Props) {
    const computeSubTotal = (orderItems: CartItem[]) => {
        return orderItems.reduce((sum, item) => sum + ((item.priceAtPurchase ?? 0) * (item.quantity ?? 0)), 0)
    }

    const statusConfig = ORDER_STATUS.find((item) => item.value === (order.status ?? 'pending'))

    return (
        <Card className="flex h-full flex-col pt-3">
            <CardHeader>
                <div className="flex flex-row justify-between gap-3">
                    <div className="flex flex-row gap-3">
                        <div className="bg-amber-400 text-white text-[0.8rem] rounded-lg font-semibold py-1 px-2">
                            #{orderNumber}
                        </div>

                        <div className="font-semibold text-[1.1rem]">
                            {order?.orderName?.trim() ? order.orderName : `${order?.customer?.name}'s Order`}
                        </div>
                    </div>

                    <div className={cn(statusConfig?.color, 'text-white text-[0.8rem] font-semibold py-1 px-3 rounded-lg')}>
                        {order.status ? statusConfig?.name : 'Pending'}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div>
                        {Boolean(order.orderName?.trim() && order.customer?.name?.trim()) && (
                            <div className="flex flex-row items-center gap-1 text-[0.75rem] font-semibold">
                                <CircleUserRound className="w-4 h-4 text-sky-600" />
                                <p>{order.customer.name}</p>
                            </div>
                        )}
                    </div>

                    <p className="text-right text-light text-[0.7rem] text-gray-400 -mt-1">
                        {format(new Date(order.createdAt), 'MMMM d, yyyy')} • {format(new Date(order.createdAt), 'hh:mm a')}
                    </p>
                </div>

                <Separator />

                {!!order.notes && (
                    <>
                        <p className="text-gray-600 text-[0.7rem]">
                            Notes: {order.notes}
                        </p>
                        <Separator />
                    </>
                )}
            </CardHeader>

            <CardContent className="flex-1 -mt-5">
                <div className="max-h-[200px] overflow-y-auto">
                    <table className='w-full border-collapse text-xs mt-2'>
                        <thead>
                            <tr className='border-b bg-muted font-semibold [&_th]:px-3 [&_th]:py-2'>
                                <th className='text-left w-[10%]'>Qty</th>
                                <th className='text-left'>Title</th>
                                <th className='text-right'>Price</th>
                                <th className='text-right'>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item: CartItem) => (
                                <tr key={item.id} className='border-b last:border-0 [&_td]:px-3 [&_td]:py-2'>
                                    <td>{item.quantity}</td>
                                    <td>{item?.product?.title}</td>
                                    <td className='text-right'>₱ {item.priceAtPurchase}</td>
                                    <td className='text-right'>₱ {item.priceAtPurchase * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-[1.1rem] mt-3">
                    <div>Subtotal</div>
                    <div>₱ {computeSubTotal(order.items)}</div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-row justify-end gap-2">
                <Button
                    onClick={() => onUpdate(order)}
                    size="sm"
                    variant="outline"
                    className="flex-1 dark:text-white hover:text-white hover:bg-amber-400"
                >
                    <Pencil className="w-6 h-6 text-amber-500" />
                    Update
                </Button>

                <Button
                    onClick={() => onDelete(order.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 dark:text-white hover:text-white hover:bg-rose-400"
                >
                    <Trash className="w-6 h-6 text-rose-600" />
                    Delete
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            onClick={() => undefined}
                            size="sm"
                            variant="outline"
                            className="flex-1 text-white bg-green-500 hover:bg-green-300"
                        >
                            Update Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44">
                        {ORDER_STATUS.map((status) => (
                            <DropdownMenuItem
                                key={status.name}
                                onClick={() => updateStatus(order.id, status.value)}
                                className="cursor-pointer"
                            >
                                {status.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}