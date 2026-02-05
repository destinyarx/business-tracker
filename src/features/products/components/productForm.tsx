'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/molecules/SearchableSelect'
import { PRODUCT_CATEGORY } from '@/constants'
import { useProductFormStore } from '@/features/products/store/useProductFormStore';
import { useProducts } from '../hooks/useProducts'
import { FormState } from '@/features/products/products.types'
import { Image, PhilippinePeso, Layers, Percent } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dropzone, DropZoneArea, DropzoneTrigger, DropzoneMessage, useDropzone } from "@/components/ui/dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useToast } from '@/hooks/useToast'

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
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional(),
})

type ProductFormValues = z.infer<typeof schema>

export default function ProductForm() {
  const { formState, product, closeForm } = useProductFormStore()
  const { createProduct, updateProduct } = useProducts()
  const confirmation = useConfirmation()
  const appToast = useToast()

  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [imageMode, setImageMode] = useState<string>('upload')

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      id: 0,
      title: 'test',
      description: '',
      category: 'snacks',
      sku: '',
      barcode: '',
      supplier: '',
      price: 20,
      stock: 0,
      profit: 0,
      profitPercentage: 0,
    }
  })

  const lastEdited = useRef<'amount' | 'percentage' | null>(null)

  const id = Number(form.watch('id'))
  const price = Number(form.watch('price'))
  const amount = Number(form.watch('profit'))
  const percentage = Number(form.watch('profitPercentage'))

  const handleAddProduct = async (values: ProductFormValues) => {
    const file = dropzone.fileStatuses.length ? dropzone.fileStatuses[0] : null  

    if (file) {
      const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
      const fileSize = file.file.size; 

      if (fileSize > MAX_SIZE) {
        appToast.error({
          title: "Image too large",
          description: "Please upload an image smaller than 2 MB."
        })

        return
      }
    }

    if (!amount) {
      const confirm = await confirmation('Profit not set', 'Without a profit amount, this product won’t be included correctly in profit calculations')
      if (!confirm) return
    }

    setIsLoading(true)
    await createProduct.mutateAsync({ values, file })
  }

  const onSubmit = async (values: ProductFormValues) => {
    if (formState === FormState.ADD) {
      await handleAddProduct(values)
    } else if (formState === FormState.EDIT && values.id) {
      setIsLoading(true)
      await updateProduct.mutateAsync({ id, values })
    } 

    setIsLoading(false)
  }

  // product image
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });
 
  const avatarSrc = dropzone.fileStatuses[0]?.result;
  const isPending = dropzone.fileStatuses[0]?.status === "pending";

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
        <Label className='mb-2'>Description</Label>
        <Textarea 
          {...form.register('description')} 
          rows={4} 
          readOnly={formState === FormState.VIEW}
          placeholder='Write product details...' 
        />
      </div>

      <div className='grid grid-cols-3 gap-7'>
        <div>
          <Label className='mb-2'>Category</Label>
          <SearchableSelect 
            value={form.watch('category')}
            items={PRODUCT_CATEGORY.map(c => ({ value: c.value, label: c.name }))}
            onChange={(val) =>
              form.setValue("category", val, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            readOnly={formState === FormState.VIEW}
            label='Category'
            placeholder='Choose category'
          />

          {form.formState.errors.category && (
            <p className="text-sm text-red-500">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-2'>Product Code / SKU</Label>
          <Input 
            {...form.register('sku')} 
            readOnly={formState === FormState.VIEW}
            placeholder='SKU code (optional)' 
          />
        </div>

        <div>
          <Label className='mb-2'>Supplier</Label>
          <Input 
            {...form.register('supplier')} 
            readOnly={formState === FormState.VIEW}
            placeholder='Supplier name (optional)' 
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        <div>
          <Label className='flex items-center gap-1 mb-2'>
            <span>Price</span>
            <span className='text-red-700 font-bold'>*</span>
          </Label>

          <div className='flex rounded-md shadow-xs'>
            <Input 
               type='number' 
               step='0.01' 
               {...form.register('price')} 
               readOnly={formState === FormState.VIEW}
               placeholder='0.00'
              className='-me-px rounded-r-none shadow-none' 
            />
            <span className='border-input bg-background text-muted-foreground -z-1 inline-flex items-center rounded-r-md border px-3 text-sm'>
              <PhilippinePeso className='size-4' />
            </span>
          </div>

          {form.formState.errors.price && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.price.message as string}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-2'>Stock / Qty</Label>
          <div className='flex rounded-md shadow-xs'>
            <Input 
               {...form.register('stock')} 
               readOnly={formState === FormState.VIEW}
               type='number' 
               placeholder='0'
              className='-me-px rounded-r-none shadow-none' 
            />
            <span className='border-input bg-background text-muted-foreground -z-1 inline-flex items-center rounded-r-md border px-3 text-sm'>
              <Layers className='size-4' />
            </span>
          </div>
          
          {form.formState.errors.stock && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.stock.message as string}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-2'>Profit</Label>
          <div className='flex rounded-md shadow-xs'>
            <Input 
              {...form.register('profitPercentage', {
                onChange: () => (lastEdited.current = 'percentage'),
              })}
              readOnly={formState === FormState.VIEW}
              disabled={!price}
              placeholder='0.00'
              type='number'
              step='0.01'
              className='-me-px rounded-r-none shadow-none' 
            />
            <span className='border-input bg-background text-muted-foreground -z-1 inline-flex items-center rounded-r-md border px-3 text-sm'>
              <Percent className='size-4' />
            </span>
          </div>

          {form.formState.errors.profitPercentage && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.profitPercentage.message as string}
            </p>
          )}
        </div>

        <div>
          <Label className='mb-2'>Profit Amount</Label>
            <div className='flex rounded-md shadow-xs'>
              <Input 
                {...form.register('profit', {
                  onChange: () => (lastEdited.current = 'amount'),
                })}
                readOnly={formState === FormState.VIEW}
                disabled={!price}
                placeholder='0.00'
                type='number'
                step='0.01' 
                className='-me-px rounded-r-none shadow-none' 
              />
              <span className='border-input bg-background text-muted-foreground -z-1 inline-flex items-center rounded-r-md border px-3 text-sm'>
                <PhilippinePeso className='size-4' />
              </span>
            </div>

          {form.formState.errors.profit && (
            <p className='text-red-500 text-sm mt-1'>
              {form.formState.errors.profit.message as string}
            </p>
          )}
        </div>
      </div>

      {/* ditoka */}
      <RadioGroup 
        value={imageMode}
        onValueChange={setImageMode}
        defaultValue='upload' 
        className="flex flex-row mt-5"
      >
        <div className='flex items-center gap-2'>
          <RadioGroupItem
            value='upload'
            id='upload'
            className='border-primary focus-visible:border-primary border-dashed'
          />
          <Label htmlFor='standard' className="flex-1">Upload Product Image</Label>
        </div>
        <div className='flex items-center gap-2'>
          <RadioGroupItem
            value='url'
            id='url'
            className='border-primary focus-visible:border-primary border-dashed'
          />
          <Label htmlFor='express' className="flex-1">URL Image</Label>
        </div>

        {!!(imageMode === 'url') && (
          <div className='flex-1 w-full px-2'>
            <div className='flex rounded-md shadow-xs'>
              <Input 
                {...form.register('imageUrl')}  
                type='text' 
                placeholder='Insert image link here...' 
                className='-me-px rounded-r-none shadow-none' 
              />
              <span className='border-input bg-background text-muted-foreground -z-1 inline-flex items-center rounded-r-md border px-3 text-sm'>
                <Image className='size-4' />
              </span>
            </div>
          </div>
        )}
      </RadioGroup>

      {!!(imageMode === 'upload') && (
        <div className="w-full">
          <Dropzone {...dropzone}>
            <div className="flex justify-between w-full -mt-7">
              <DropzoneMessage />
            </div>

            <DropZoneArea className="w-full">
              <DropzoneTrigger
                className={cn(
                  'w-full flex items-center gap-4 bg-transparent text-sm px-4 py-3',
                  'border border-dashed rounded-md hover:bg-muted/40 transition'
                )}
              >
                <Avatar className={cn('h-24 w-24', isPending && 'animate-pulse')}>
                  <AvatarImage className="object-cover" src={avatarSrc} />
                  <AvatarFallback>JG</AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1 font-semibold text-left ml-10">
                  <p>{avatarSrc ? 'Change product image' : 'Upload product image'}</p>
                  <p className="text-xs text-muted-foreground">
                    Please select an image smaller than 2MB
                  </p>
                </div>
              </DropzoneTrigger>
            </DropZoneArea>
          </Dropzone>
        </div>
      )}
      
      {formState !== FormState.VIEW && (
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
