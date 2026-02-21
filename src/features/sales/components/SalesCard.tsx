import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import type { OrderData } from '@/features/orders/order.type'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from "@/components/ui/separator"
import { CircleUserRound } from 'lucide-react'
import { CartItem } from '@/features/orders/order.type'

export default function OrderCard({ order }: { order: Partial<OrderData> | undefined }) {
    const computeSubTotal = (orderItems: CartItem[]) => {
        return orderItems.reduce((sum, item) => sum + ((item.priceAtPurchase ?? 0) * (item.quantity ?? 0)), 0)
    }

    return (
        <Card className="flex h-full flex-col pt-3">
            <CardHeader>
                <div className="flex flex-row items-start justify-between gap-3">
                    <div className="flex flex-row items-start gap-3">
                        {order?.orderName?.trim() ? (
                            <div className="font-semibold leading-snug line-clamp-1 text-[1rem]">
                                {order?.orderName?.trim() ? order.orderName : ''}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-lg font-semibold">
                                N/A
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div>
                        {order?.customer?.name?.trim() && (
                            <div className="flex flex-row items-center gap-1 text-[0.75rem] font-semibold">
                                <CircleUserRound className="w-4 h-4 text-sky-600" />
                                <p>{order?.customer?.name ?? ''}</p>
                            </div>
                        )}
                    </div>

                    <p className="text-right text-light text-[0.7rem] text-gray-400 -mt-1">
                        {order?.createdAt && (
                            <>
                                {format(new Date(order.createdAt), 'MMMM d, yyyy')} • {' '}
                                {format(new Date(order.createdAt), 'hh:mm a')}
                            </>
                        )}
                    </p>
                </div>

                <Separator />

                {!!order?.notes && (
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
                                <th className='text-left w-[5%]'>Qty</th>
                                <th className='text-left'>Title</th>
                                <th className='text-right'>Price</th>
                                <th className='text-right'>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items!.map((item: CartItem, index) => (
                                <tr key={index} className='border-b last:border-0 [&_td]:px-3 [&_td]:py-2'>
                                    <td className="w-[5%]">{item.quantity}</td>
                                    <td>{item?.product?.title}</td>
                                    <td className='text-right min-w-[60px]'>₱ {item.priceAtPurchase}</td>
                                    <td className='text-right min-w-[60px]'>₱ {item.priceAtPurchase! * item.quantity!}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-[1.1rem] mt-3">
                    <div>Subtotal</div>
                    <div>₱ {computeSubTotal(order?.items!)}</div>
                </div>

                <div className="flex justify-between font-semibold text-[1.1rem] mt-3">
                    <div>Profit</div>
                    <div className="text-green-400">+ ₱ {order?.totalProfit}</div>
                </div>
            </CardContent>
        </Card>
    )
}