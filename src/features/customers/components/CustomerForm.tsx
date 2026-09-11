import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Customer } from '@/features/customers/customers.types'
import {
  customerFormSchema,
  type CustomerFormValues,
} from '@/features/customers/customers.schema'
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
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface CustomerFormProps {
  customer?: Customer
  onSubmit: (customer: CustomerFormValues) => Promise<void> | void
  onCancel: () => void
}

const customerTypes = ['normal', 'loyal', 'deluxe', 'premium', 'VIP'] as const

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    mode: 'onTouched',
    defaultValues: {
      name: customer?.name ?? '',
      phone: customer?.phone ?? '',
      customerType: customer?.customerType ?? 'normal',
      notes: customer?.notes ?? '',
      email: customer?.email ?? '',
    },
  })

  const nameLength = form.watch('name').length
  const notesLength = form.watch('notes')?.length ?? 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-[22px] py-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline gap-2">
                  <FormLabel className="text-[12.5px] font-medium">Name</FormLabel>
                  <span className="text-[12.5px] text-red-600">*</span>
                  <span className="ml-auto font-mono text-[10.5px] text-[#93a5a5]">{nameLength}/100</span>
                </div>
                <FormControl>
                  <Input
                    placeholder="e.g. Nena Ramirez"
                    className="h-11 rounded-xl border-[#dce3e2] px-3.5 text-[13.5px] shadow-none dark:border-[#2b4340]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12.5px] font-medium">Contact number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="09xxxxxxxxx"
                    inputMode="tel"
                    autoComplete="tel"
                    className="h-11 rounded-xl border-[#dce3e2] px-3.5 font-mono text-[13.5px] shadow-none dark:border-[#2b4340]"
                    {...field}
                  />
                </FormControl>
                <p className="text-[11px] text-[#93a5a5]">11 digits, optional.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12.5px] font-medium">Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@email.com"
                    type="email"
                    autoComplete="email"
                    className="h-11 rounded-xl border-[#dce3e2] px-3.5 text-[13.5px] shadow-none dark:border-[#2b4340]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12.5px] font-medium">Customer type</FormLabel>
                <div className="flex flex-wrap gap-1.5">
                  {customerTypes.map((customerType) => {
                    const selected = field.value === customerType
                    return (
                      <button
                        key={customerType}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => field.onChange(customerType)}
                        className={cn(
                          'rounded-full border border-[#e3e9e8] bg-white px-[15px] py-2 text-[12.5px] font-medium capitalize text-[#3f5254] transition-colors hover:border-[#00beaa] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]',
                          selected && 'border-[#16292b] bg-[#16292b] text-white hover:border-[#16292b] dark:border-[#eaf3f1] dark:bg-[#eaf3f1] dark:text-[#16292b]',
                        )}
                      >
                        {customerType}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-[#93a5a5]">Tier drives the badge on the customers table.</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline gap-2">
                  <FormLabel className="text-[12.5px] font-medium">Notes</FormLabel>
                  <span className="ml-auto font-mono text-[10.5px] text-[#93a5a5]">{notesLength}/500</span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Delivery address, payment habits, discounts agreed."
                    rows={4}
                    className="resize-y rounded-xl border-[#dce3e2] px-3.5 py-3 text-[13.5px] shadow-none dark:border-[#2b4340]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2.5 border-t border-[#edf1f0] bg-[#fbfcfc] px-[22px] py-3.5 dark:border-[#1e322f] dark:bg-[#16292b]">
          <Button type="button" variant="outline" onClick={onCancel} className="h-11 flex-1 rounded-xl border-[#dce3e2] bg-white text-[13px] dark:border-[#2b4340] dark:bg-[#12201f]">
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 flex-[1.4] rounded-xl bg-[#0c4b47] text-[13px] font-semibold text-white hover:bg-[#007f78]">
            {customer ? 'Update customer' : 'Save customer'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
