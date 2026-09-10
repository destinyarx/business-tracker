'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Customer } from '@/features/customers/customers.types'
import {
  orderFormSchema,
  type OrderFormValues,
} from '@/features/orders/order.schema'
import type { OrderForm as OrderFormData } from '@/features/orders/order.type'

interface OrderFormProps {
  customers: Customer[]
  onSubmit: (order: OrderFormValues) => void | Promise<void>
  formId?: string
  initialValues?: OrderFormData
  showSubmitButton?: boolean
  submitLabel?: string
  isSubmitting?: boolean
}

const guestCustomerValue = 'guest'

export default function OrderForm({
  customers,
  onSubmit,
  formId = 'order-details-form',
  initialValues,
  showSubmitButton = false,
  submitLabel = 'Save order',
  isSubmitting = false,
}: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: initialValues?.customerId ?? null,
      orderName: initialValues?.orderName ?? '',
      status: initialValues?.status ?? 'pending',
      notes: initialValues?.notes ?? '',
    },
  })

  const submitOrder = async (orderValues: OrderFormValues): Promise<void> => {
    form.clearErrors(['orderName', 'customerId'])

    if (!orderValues.customerId && !orderValues.orderName?.trim()) {
      const message = 'Enter an order name or attach a customer.'
      form.setError('orderName', { type: 'manual', message })
      form.setError('customerId', { type: 'manual', message })
      return
    }

    await onSubmit(orderValues)
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(submitOrder)}
        className="space-y-4"
      >
        <input type="hidden" {...form.register('status')} />
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="orderName"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="text-xs font-medium">Order name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Add an order name"
                    maxLength={50}
                    className="h-11 rounded-[11px] border-[#dce3e2] px-3.5 text-[13.5px] shadow-none dark:border-[#2b4340]"
                    {...field}
                  />
                </FormControl>
                <p className="text-[11px] text-[#93a5a5]">
                  Optional if a customer is attached.
                </p>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="text-xs font-medium">Customer</FormLabel>
                <Select
                  value={field.value ? String(field.value) : guestCustomerValue}
                  onValueChange={(customerId) =>
                    field.onChange(
                      customerId === guestCustomerValue ? null : Number(customerId),
                    )
                  }
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-[11px] border-[#dce3e2] px-3.5 text-[13.5px] shadow-none dark:border-[#2b4340]">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={guestCustomerValue}>
                      Guest customer (no record)
                    </SelectItem>
                    {customers.map((customer) =>
                      customer.id ? (
                        <SelectItem key={customer.id} value={String(customer.id)}>
                          {customer.name}
                        </SelectItem>
                      ) : null,
                    )}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-[#93a5a5]">
                  Leave as guest for walk-in sales.
                </p>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">Notes</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Delivery instructions, discounts agreed, or notes for staff."
                  className="resize-y rounded-[11px] border-[#dce3e2] px-3.5 py-3 text-[13.5px] shadow-none dark:border-[#2b4340]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {showSubmitButton && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-[#0c4b47] text-[13px] font-semibold text-white hover:bg-[#007f78]"
          >
            {submitLabel}
          </Button>
        )}
      </form>
    </Form>
  )
}
