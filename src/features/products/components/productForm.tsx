'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { PRODUCT_CATEGORY } from '@/constants'
import { useNotify } from '@/hooks/useNotification'
import { useProductFormStore } from '@/features/products/store/useProductFormStore';

interface Props {
  handleSuccess: () => void
}

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  supplier: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(1, 'Price must greater than 0')),
  stock: z.preprocess((val) => Number(val), z.number().min(0, 'Stock must be 0 or greater')),
  profitPercentage: z.preprocess(
    (val) => Number(val),
    z.number().max(90, 'Profit must not be more than 90% of the price').optional()
  ),
  profit: z.preprocess((val) => Number(val), z.number().optional()),
  category: z.string().optional(),
})

type ProductFormValues = z.infer<typeof schema>

export default function ProductForm({ handleSuccess }: Props) {
  const { viewMode, product } = useProductFormStore()
  const api = useApi()
  const notify = useNotify()


  const form = useForm<ProductFormValues>({
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
      profitPercentage: 0
    }
  })

  const lastEdited = useRef<'amount' | 'percentage' | null>(null)

  const price = Number(form.watch('price'))
  const amount = Number(form.watch('profit'))
  const percentage = Number(form.watch('profitPercentage'))

  async function onSubmit(values: ProductFormValues) {
    try {
      const request = api.post('/products', values)
      await notify.loading(request, 'Products successfully saved!', 'Processing...')
      handleSuccess()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!price) return

    if (lastEdited.current === 'percentage') {
      const newAmount = (price * percentage) / 100
      form.setValue('profit', Number(newAmount.toFixed(2)))
    }

    if (lastEdited.current === 'amount') {
      const newPercentage = (amount / price) * 100
      form.setValue('profitPercentage', Number(newPercentage.toFixed(2)))
    }
  }, [price, amount, percentage, form])

  useEffect(() => {
    if (product) {
      form.reset(product)
    } else {
      form.reset()
    }
  }, [product])

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 w-full'>
      <div className='grid gap-1'>
        <Label className='mb-1 flex items-center gap-1'>
          <span>Product Title</span>
          <span className='text-red-700 font-bold'>*</span>
        </Label>

        <Input 
          {...form.register('title')} 
          readOnly={viewMode}
          placeholder='Enter product name' 
        />

        {form.formState.errors.title && (
          <p className='text-red-500 text-sm mt-1'>
            {form.formState.errors.title.message as string}
          </p>
        )}
      </div>

      <div className='grid gap-1'>
        <Label className='mb-1'>Description</Label>
        <Textarea 
          {...form.register('description')} 
          rows={4} 
          readOnly={viewMode}
          placeholder='Write product details...' 
        />
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div>
          <Label className='mb-1'>Category</Label>
          <Select 
            onValueChange={(val) => form.setValue('category', val)}
            disabled={viewMode}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Choose category' />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORY.map((product, index) => (
                <SelectItem key={index} value={product.value}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className='mb-1'>Product Code / SKU</Label>
          <Input 
            {...form.register('sku')} 
            readOnly={viewMode}
            placeholder='SKU code (optional)' 
          />
        </div>

        <div>
          <Label className='mb-1'>Supplier</Label>
          <Input 
            {...form.register('supplier')} 
            readOnly={viewMode}
            placeholder='Supplier name (optional)' 
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        <div>
          <Label className='mb-1 flex items-center gap-1'>
            <span>Price</span>
            <span className='text-red-700 font-bold'>*</span>
          </Label>
          <Input 
            type='number' 
            step='0.01' 
            {...form.register('price')} 
            readOnly={viewMode}
            placeholder='0.00' 
          />

          {form.formState.errors.price && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.price.message as string}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-1'>Stock / Qty</Label>
          <Input 
            {...form.register('stock')} 
            readOnly={viewMode}
            type='number' 
            placeholder='0' 
          />
          
          {form.formState.errors.stock && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.stock.message as string}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-1'>Profit %</Label>
          <Input
            {...form.register('profitPercentage', {
              onChange: () => (lastEdited.current = 'percentage'),
            })}
            readOnly={viewMode}
            disabled={!price}
            placeholder='0.00'
            type='number'
            step='0.01'
          />

          {form.formState.errors.profitPercentage && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.profitPercentage.message as string}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-1'>Profit Amount</Label>
          <Input
            {...form.register('profit', {
              onChange: () => (lastEdited.current = 'amount'),
            })}
            readOnly={viewMode}
            disabled={!price}
            placeholder='0.00'
            type='number'
            step='0.01'
          />

          {form.formState.errors.profit && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.profit.message as string}
            </p>
          )}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button className='bg-teal-600 hover:bg-teal-700 text-white px-6'>
          Save Product
        </Button>
      </div>
    </form>
  )
}
