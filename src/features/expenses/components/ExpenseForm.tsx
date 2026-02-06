import type { ExpensesFormData, ExpensesData } from '@/features/expenses/expenses.types'
import type { ExpensesSchema } from '@/features/expenses/expenses.schema'
import { expensesSchema } from '@/features/expenses/expenses.schema'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EXPENSE_CATEGORIES, PAYMENT_METHOD } from '@/constants'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { DatePicker } from '@/components/molecules/Datepicker'
import type { FormMode } from '@/types/global.types'

type Props = {
    formMode: FormMode,
    data: ExpensesFormData,
    updateId: number|null,
    onCreate: (data: ExpensesFormData) => void,
    onUpdate: (data: ExpensesData) => void
}

export default function ExpensesForm({ formMode, data, onCreate, onUpdate, updateId }: Props) {
    const confirmation = useConfirmation()

    const form = useForm<ExpensesSchema>({
        resolver: zodResolver(expensesSchema),
        defaultValues: {
            title: data?.title ?? '',
            description: data?.description ?? '',
            dateIncurred: data?.dateIncurred ? new Date(data.dateIncurred) : new Date(),
            referenceNumber: data?.referenceNumber ?? '',
            category: data?.category ?? undefined,
            categoryOther: data?.categoryOther ?? '',
            paymentMethod: data?.paymentMethod ?? 'cash',
            amount: data?.amount ? Number(data.amount) : undefined,
            paymentMethodOther: data?.paymentMethodOther ?? ''
        }
    })

    const category = form.watch('category')

    const submitOrder = async () => {
        const prompt = data?.id ? 'You want to update this expenses?' : 'You want to add this new expenses?'
        const confirm = await confirmation('Are you sure?', prompt)
        if(!confirm) return

        const { amount, ...rest } = form.getValues()

        const formData = {
            ...rest,
            id: data?.id ? data.id : null,
            amount: String(amount)
        }

        if (data?.id) {
            onUpdate(formData)
        } else {
            onCreate(formData)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitOrder)}>
                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input 
                                        maxLength={70} 
                                        readOnly={formMode === 'view'} 
                                        placeholder="Office rent for January" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => { 
                                const categoryField = field.value; 

                                return (
                                    <div className="flex flex-row items-center w-full gap-2">
                                        <FormItem className="flex-1 flex flex-col">
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                value={categoryField}
                                                onValueChange={(val) => field.onChange(val)}
                                                disabled={formMode === 'view'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {EXPENSE_CATEGORIES.map((item, index) => (
                                                        <SelectItem key={index} value={item.value}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                );
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => { 
                                const paymentMethodField = field.value; 

                                return (
                                    <div className="flex flex-row items-center w-full gap-2">
                                        <FormItem className="flex-1 flex flex-col">
                                            <FormLabel>Payment Method</FormLabel>
                                            <Select
                                                value={paymentMethodField}
                                                onValueChange={(val) => field.onChange(val)}
                                                disabled={formMode === 'view'}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {PAYMENT_METHOD.map((item, index) => (
                                                        <SelectItem key={index} value={item.value}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                );
                            }}
                        />
                    </div>

                    {category === 'other' && (
                        <FormField
                            control={form.control}
                            name="categoryOther"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Other category</FormLabel>
                                    <FormControl>
                                        <Input 
                                            readOnly={formMode === 'view'}
                                            maxLength={50} 
                                            placeholder="Input details about other category (required)" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
                        <FormField
                            control={form.control}
                            name="dateIncurred"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date Incurred</FormLabel>

                                    <FormControl>
                                        <DatePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="{placeholder}"
                                            disabled={formMode === 'view'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Amount</FormLabel>

                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            step="1"
                                            placeholder="Input exact amount"
                                            readOnly={formMode === 'view'}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                field.onChange(value === '' ? undefined : Number(value))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="referenceNumber"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Reference Number</FormLabel>
                                <FormControl>
                                    <Input 
                                        readOnly={formMode === 'view'}
                                        maxLength={50} 
                                        placeholder={formMode !== 'view' ? 'e.g. OR-102394, INV-7781' : 'N/A'} 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        readOnly={formMode === 'view'}
                                        maxLength={255} 
                                        placeholder={formMode !== 'view' ? 'Add additional details about this expense (optional)' : 'N/A'} 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-center">
                    {formMode !== 'view' && (
                        <Button
                            type="submit"
                            className="mt-4 rounded-lg bg-gray-900 px-8 py-3 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            {formMode === 'update' ? 'Update' : 'Submit'}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}