import { useOrderStore } from '../useOrderStore'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function OrderCartList() {
    const { carts, removeFromCart, increaseItem, decreaseItem } = useOrderStore()

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-md space-y-3">
            {carts.map((item) => (
                <div
                    key={item.id}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between rounded-lg border bg-white px-4 py-3 shadow-sm"
                >
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                            {item.title}
                        </span>
                        <span className="text-xs text-gray-500">
                            ₱{item.price.toFixed(2)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => decreaseItem(item.id)}
                            disabled={!item?.quantity}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                        </span>

                        <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            disabled={item.quantity === item.stock}
                            onClick={() => increaseItem(item.id)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => removeFromCart(item.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
            </div>
    )
}