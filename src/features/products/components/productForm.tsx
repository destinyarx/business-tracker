"use client"

import { useEffect, useRef } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useApi } from '@/lib/api'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { PRODUCT_CATEGORY } from "@/constants"
import { useNotify } from '@/hooks/useNotification'

const schema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    supplier: z.string().optional(),
    price: z.preprocess(
        (val) => Number(val), 
        z.number().min(1, "Price must greater than 0")
    ),
    stock: z.preprocess(
        (val) => Number(val), 
        z.number().min(0, "Stock must be 0 or greater")
    ),
    profitPercentage: z.preprocess(
        (val) => Number(val), 
        z.number()
        .max(90, 'Profit must not be more than 90% of the price')
        .optional()
    ),
    profit: z.preprocess(
        (val) => Number(val), 
        z.number().optional()
    ),
    category: z.string().optional(),
})

export default function ProductForm() {
  const api = useApi()
  const notify = useNotify()

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      sku: '',
      barcode: '',
      supplier: '',
      price: 0,
      stock: 0,
      profit: 0,
      profitPercentage: 0,
    },
  })

  const lastEdited = useRef<'amount' | 'percentage' | null>(null);

  const price = Number(form.watch('price'));
  const amount = Number(form.watch('profit'));
  const percentage = Number(form.watch('profitPercentage'));

  useEffect(() => {
    if (!price) return;

    if (lastEdited.current === 'percentage') {
      const newAmount = (price * percentage) / 100;
      form.setValue('profit', newAmount.toFixed(2));
    }

    if (lastEdited.current === 'amount') {
      const newPercentage = (amount / price) * 100;
      form.setValue('profitPercentage', newPercentage.toFixed(2));
    }
  }, [price, amount, percentage]);


  async function onSubmit(form: any) {
    console.log(form)

    try {
      const response = api.post('/products', form)
      await notify.loading(response, 'Processing...');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="grid gap-1">
        <Label className="mb-1 flex items-center gap-1">
          <span>Product Title</span>
          <span className="text-red-700 font-bold">*</span>
        </Label>
        <Input placeholder="Enter product name" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.title.message as string}
          </p>
        )}
      </div>

      <div className="grid gap-1">
        <Label className="mb-1">Description</Label>
        <Textarea
          placeholder="Write product details..."
          rows={4}
          {...form.register("description")}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
            <Label className="mb-1 flex items-center gap-1">
              <span>Category</span>
            </Label>
            <Select onValueChange={(val) => form.setValue("category", val)}>
              <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose category"/>
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORY.map((product, index) => (
                  <SelectItem key={index} value={product.value}>{product.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <div>
            <Label className="mb-1">Product Code /  SKU</Label>
            <Input placeholder="SKU code (optional)" {...form.register("sku")} />
        </div>

        <div>
            <Label className="mb-1">Supplier</Label>
            <Input placeholder="Supplier name (optional)" {...form.register("supplier")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label className="mb-1 flex items-center gap-1">
            <span>Price</span>
            <span className="text-red-700 font-bold">*</span>
          </Label>
          <Input placeholder="0.00" type="number" step="0.01" {...form.register("price")} />
          {form.formState.errors.price && (
            <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.price.message as string}
            </p>
          )}
        </div>

        <div>
            <Label className="mb-1">Stock / Qty</Label>
            <Input placeholder="0" type="number" {...form.register("stock")} />
            {form.formState.errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.stock.message as string}
                </p>
            )}
        </div>

        <div>
            <Label className="mb-1">Profit %</Label>
            <Input 
              {...form.register('profitPercentage', {
                onChange: () => (lastEdited.current = 'percentage')
              })}
              disabled={!price}
              placeholder="0.00" 
              type="number" 
              step="0.01" 
            />

            {form.formState.errors.profitPercentage && (
                <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.profitPercentage.message as string}
                </p>
            )}
        </div>

        <div>
            <Label className="mb-1">Profit Amount</Label>
            <Input 
              {...form.register('profit', {
                onChange: () => (lastEdited.current = 'amount')
              })}
              disabled={!price}
              placeholder="0.00" 
              type="number" 
              step="0.01" 
            />

            {form.formState.errors.profit && (
                <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.profit.message as string}
                </p>
            )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6">
          Save Product
        </Button>
      </div>
    </form>
  )
}
