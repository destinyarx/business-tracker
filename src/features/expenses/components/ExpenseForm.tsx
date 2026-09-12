'use client'

import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { FormMode } from '@/types/global.types'
import type { ExpensesData, ExpensesFormData } from '@/features/expenses/expenses.types'
import { expensesSchema, type ExpensesSchema } from '@/features/expenses/expenses.schema'
import { EXPENSE_CATEGORIES, PAYMENT_METHOD } from '@/constants'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { formatExpenseAmount } from '../expense-summary'
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

type ExpenseFormProps = {
  formMode: FormMode
  data: ExpensesFormData
  updateId: number | null
  onCreate: (expense: ExpensesFormData) => Promise<void>
  onUpdate: (expense: ExpensesData) => Promise<void>
  onCancel: () => void
}

const fieldClassName =
  'h-11 rounded-xl border-[#dce3e2] px-3.5 text-[13px] shadow-none dark:border-[#2b4340] dark:bg-[#12201f]'
const labelClassName = 'text-[12.5px] font-medium text-[#16292b] dark:text-[#eaf3f1]'

export default function ExpenseForm({
  formMode,
  data,
  updateId,
  onCreate,
  onUpdate,
  onCancel,
}: ExpenseFormProps) {
  const confirmation = useConfirmation()
  const isReadOnly = formMode === 'view'
  const form = useForm<ExpensesSchema>({
    resolver: zodResolver(expensesSchema),
    defaultValues: {
      title: data.title ?? '',
      description: data.description ?? '',
      dateIncurred: data.dateIncurred ? new Date(data.dateIncurred) : new Date(),
      referenceNumber: data.referenceNumber ?? '',
      category: data.category ?? 'rent',
      categoryOther: data.categoryOther ?? '',
      paymentMethod: data.paymentMethod ?? 'cash',
      amount: data.amount ? Number(data.amount) : undefined,
      paymentMethodOther: data.paymentMethodOther ?? '',
    },
  })
  const category = form.watch('category')
  const amount = Number(form.watch('amount')) || 0
  const titleLength = form.watch('title')?.length ?? 0

  const submitExpense = async (expenseValues: ExpensesSchema): Promise<void> => {
    const isUpdate = formMode === 'update'
    const confirmed = await confirmation(
      isUpdate ? 'Update this expense?' : 'Save this expense?',
      isUpdate
        ? `${expenseValues.title} will be updated with the details you entered.`
        : `${expenseValues.title} will be added to your expense records.`,
      { confirmText: isUpdate ? 'Update expense' : 'Save expense' },
    )
    if (!confirmed) return

    const expensePayload: ExpensesFormData = {
      ...expenseValues,
      amount: String(expenseValues.amount),
    }

    if (isUpdate) {
      const expenseId = data.id ?? updateId
      if (!expenseId) return
      await onUpdate({ ...expensePayload, id: expenseId })
      return
    }

    await onCreate(expensePayload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitExpense)} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-[22px] py-5">
          <div className="rounded-2xl bg-gradient-to-br from-[#0c4b47] via-[#0e8a80] to-[#12cdbe] px-[17px] py-[15px] text-white shadow-[0_18px_38px_-28px_rgba(12,75,71,0.9)]">
            <p className="mb-1 text-[11px] text-white/75">{isReadOnly ? 'Recorded amount' : 'Amount to record'}</p>
            <p className="font-mono text-[25px] font-medium leading-none tracking-[-0.02em] tabular-nums">
              {formatExpenseAmount(amount)}
            </p>
          </div>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-baseline gap-1.5">
                  <FormLabel className={labelClassName}>Name <span className="text-red-600">*</span></FormLabel>
                  <span className="ml-auto font-mono text-[10.5px] text-[#93a5a5]">{titleLength}/50</span>
                </div>
                <FormControl>
                  <Input {...field} maxLength={50} readOnly={isReadOnly} placeholder="e.g. August electricity" className={fieldClassName} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="dateIncurred"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Date incurred</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                      onChange={(event) => {
                        const selectedDate = event.target.value
                        field.onChange(selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined)
                      }}
                      disabled={isReadOnly}
                      className={fieldClassName}
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
                <FormItem>
                  <FormLabel className={labelClassName}>Amount <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      readOnly={isReadOnly}
                      value={field.value ?? ''}
                      onChange={(event) => field.onChange(event.target.value === '' ? undefined : Number(event.target.value))}
                      className={`${fieldClassName} font-mono`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                  <FormControl><SelectTrigger className={`${fieldClassName} w-full`}><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((expenseCategory) => <SelectItem key={expenseCategory.value} value={expenseCategory.value}>{expenseCategory.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {category === 'other' && (
            <FormField
              control={form.control}
              name="categoryOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Specify the category</FormLabel>
                  <FormControl><Input {...field} maxLength={30} readOnly={isReadOnly} placeholder="Custom expense category" className={fieldClassName} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>Payment method</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={isReadOnly}>
                  <FormControl><SelectTrigger className={`${fieldClassName} w-full`}><SelectValue placeholder="Select payment method" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {PAYMENT_METHOD.map((paymentMethod) => <SelectItem key={paymentMethod.value} value={paymentMethod.value}>{paymentMethod.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>Reference number</FormLabel>
                <FormControl><Input {...field} maxLength={50} readOnly={isReadOnly} placeholder={isReadOnly ? 'N/A' : 'Receipt or transaction no.'} className={`${fieldClassName} font-mono`} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}>Description</FormLabel>
                <FormControl><Textarea {...field} maxLength={255} readOnly={isReadOnly} rows={3} placeholder={isReadOnly ? 'N/A' : 'What was this for?'} className="resize-y rounded-xl border-[#dce3e2] px-3.5 py-3 text-[13px] shadow-none dark:border-[#2b4340] dark:bg-[#12201f]" /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2.5 border-t border-[#edf1f0] bg-[#fbfcfc] px-[22px] py-3.5 dark:border-[#1e322f] dark:bg-[#16292b]">
          <Button type="button" variant="outline" onClick={onCancel} className="h-11 flex-1 rounded-xl border-[#dce3e2] bg-white text-[13px] dark:border-[#2b4340] dark:bg-[#12201f]">
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button type="submit" disabled={form.formState.isSubmitting} className="h-11 flex-[1.4] rounded-xl bg-[#0c4b47] text-[13px] font-semibold text-white hover:bg-[#007f78]">
              {formMode === 'update' ? 'Update expense' : 'Save expense'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
