'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/molecules/SearchableSelect'
import { PRODUCT_CATEGORY } from '@/constants'
import { useNotify } from '@/hooks/useNotification'
import { useProductFormStore } from '@/features/products/store/useProductFormStore';
import { useProducts } from '../hooks/useProducts'
import { FormState } from '@/features/products/products.types'

const schema = z.object({
  id: z.preprocess(
    (val) => val === '' || val === undefined || val === null ? undefined : Number(val),
    z.number().optional()
  ),
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

export default function ProductForm() {
  const api = useApi()
  const notify = useNotify()
  const { formState, product, closeForm } = useProductFormStore()
  const { createProduct, updateProduct } = useProducts()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      id: 0,
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

  const id = Number(form.watch('id'))
  const price = Number(form.watch('price'))
  const amount = Number(form.watch('profit'))
  const percentage = Number(form.watch('profitPercentage'))

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true)

    if (formState === FormState.ADD) {
      await createProduct.mutateAsync(values)
    } else if (formState === FormState.EDIT && values.id) {
      await updateProduct.mutateAsync({ id, values })
    } 

    setIsLoading(false)
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
          readOnly={formState === FormState.VIEW}
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
          readOnly={formState === FormState.VIEW}
          placeholder='Write product details...' 
        />
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div>
          <Label className='mb-1'>Category</Label>
          <SearchableSelect 
            value={form.watch('category')}
            items={PRODUCT_CATEGORY.map(c => ({ value: c.value, label: c.name }))}
            onChange={(val) => form.setValue('category', val)}
            readOnly={formState === FormState.VIEW}
            label='Category'
            placeholder='Choose category'
          />
        </div>

        <div>
          <Label className='mb-1'>Product Code / SKU</Label>
          <Input 
            {...form.register('sku')} 
            readOnly={formState === FormState.VIEW}
            placeholder='SKU code (optional)' 
          />
        </div>

        <div>
          <Label className='mb-1'>Supplier</Label>
          <Input 
            {...form.register('supplier')} 
            readOnly={formState === FormState.VIEW}
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
            readOnly={formState === FormState.VIEW}
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
            readOnly={formState === FormState.VIEW}
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
            readOnly={formState === FormState.VIEW}
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
            readOnly={formState === FormState.VIEW}
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

      { formState !== FormState.VIEW && (
        <div className='flex justify-end'>
          {formState === FormState.EDIT ? (
            <Button disabled={isLoading} className='bg-teal-600 hover:bg-teal-700 text-white px-6'>
              Update Product
            </Button>
          ) : (
            <Button disabled={isLoading} className='bg-teal-600 hover:bg-teal-700 text-white px-6'>
              Save Product
            </Button>
          )}
        </div>
      )}
    </form>
  )
}
