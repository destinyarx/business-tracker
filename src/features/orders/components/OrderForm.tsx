import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useOrderStore } from '@/features/orders/useOrderStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/features/customers/customers.types'
import { useToast } from '@/hooks/useToast'

interface Props {
    customers: Customer[],
    onSubmit: (data: any) => void
}

const orderFormSchema = z.object({
    customerId: z.coerce.number().int().nullable(),
    orderName: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'failed', 'completed', 'cancelled']),
    notes: z.string().optional()
})

type OrderForm = z.infer<typeof orderFormSchema>

export default function OrderForm({ customers, onSubmit }: Props ) {
    const { error } = useToast()
    const { orderForm, showForm } = useOrderStore()

    const form = useForm({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            customerId: orderForm?.customerId ?? null,
            orderName: orderForm?.orderName ?? '',
            status: orderForm?.status ?? 'pending',
            notes: orderForm?.notes ?? ''
        }
    })

    const customer = form.watch('customerId')
    const orderName = form.watch('orderName')

    const submitOrder = async () => {
        form.clearErrors(['orderName', 'customerId'])

        if (!customer && !orderName) {
            form.setError('orderName', { type: 'manual', message: 'Fill up order name or customer field' })
            form.setError('customerId', { type: 'manual', message: 'Fill up order name or customer field' })
            return
        }

        onSubmit(form.getValues())
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitOrder)}>
                <FormField
                    control={form.control}
                    name="orderName"
                    render={({field}) => (
                        <FormItem className="mb-5">
                            <FormLabel>Order Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Add order name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => { 
                        const customerId = field.value; 

                        return (
                            <div className="flex flex-row items-center w-full gap-2">
                                <FormItem className="mb-5 flex-1 flex flex-col">
                                    <FormLabel>Customer</FormLabel>
                                    <Select
                                        value={customerId?.toString() ?? ""}
                                        onValueChange={(val) => field.onChange(val === "" ? null : Number(val)) }
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select customer" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={String(customer.id)}>
                                                {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>

                                {customerId !== null && (
                                    <Button
                                        onClick={() => field.onChange(null)}
                                        size="sm"
                                        variant="outline"
                                        className="bg-rose-500"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        );
                    }}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({field}) => 
                        <FormItem className="mb-5">
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Add notes or remarks here.." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    }
                />

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="mt-4 rounded-lg bg-gray-900 px-8 py-3 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    )
}