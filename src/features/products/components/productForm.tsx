'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/molecules/SearchableSelect'
import { PRODUCT_CATEGORY } from '@/constants'
import { useProductFormStore } from '@/features/products/store/useProductFormStore'
import { useProducts } from '../hooks/useProducts'
import { FormState } from '@/features/products/products.types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dropzone,
  DropZoneArea,
  DropzoneTrigger,
  DropzoneMessage,
  useDropzone,
} from '@/components/ui/dropzone'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useToast } from '@/hooks/useToast'
import {
  productFormSchema,
  type ProductFormInput,
  type ProductFormValues,
} from '../products.schema'

type ImageMode = 'current' | 'upload' | 'url'

export default function ProductForm() {
  const { formState, product, closeForm } = useProductFormStore()
  const { createProduct, updateProduct } = useProducts()
  const confirmation = useConfirmation()
  const appToast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imageMode, setImageMode] = useState<ImageMode>('upload')
  const isReadOnly = formState === FormState.VIEW

  const form = useForm<ProductFormInput, undefined, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: undefined,
      title: '',
      description: '',
      category: '',
      sku: '',
      barcode: '',
      supplier: '',
      price: undefined,
      stock: undefined,
      profit: undefined,
      profitPercentage: undefined,
      image: null,
      imageUrl: null,
    },
  })

  const lastEdited = useRef<'amount' | 'percentage' | null>(null)
  const price = Number(form.watch('price'))
  const amount = Number(form.watch('profit'))
  const percentage = Number(form.watch('profitPercentage'))

  const dropzone = useDropzone({
    onDropFile: async (file: File) => ({
      status: 'success',
      result: URL.createObjectURL(file),
    }),
    validation: {
      accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  })

  const avatarSrc = dropzone.fileStatuses[0]?.result
  const isPending = dropzone.fileStatuses[0]?.status === 'pending'

  const handleAddProduct = async (productValues: ProductFormValues): Promise<boolean> => {
    const selectedImage = dropzone.fileStatuses[0] ?? null

    if (selectedImage && selectedImage.file.size > 2 * 1024 * 1024) {
      appToast.error({
        title: 'Image too large',
        description: 'Please upload an image smaller than 2 MB.',
      })
      return false
    }

    if (!amount) {
      const confirmed = await confirmation(
        'Profit not set',
        'Without a profit amount, this product will not be included correctly in profit calculations.',
        { confirmText: 'Continue without profit' },
      )
      if (!confirmed) return false
    }

    await appToast.loadingPromise(
      createProduct.mutateAsync({ values: productValues, file: selectedImage }),
      {
        loadingTitle: 'Adding product...',
        successTitle: 'Product added',
        successDescription: 'The new product has been saved.',
        errorTitle: 'Failed to create product',
        errorDescription: 'Please check the form and try again.',
      },
    )

    return true
  }

  const onSubmit = async (productValues: ProductFormValues) => {
    const updateId = productValues.id ?? product?.id
    setIsLoading(true)

    try {
      if (formState === FormState.ADD) {
        const wasCreated = await handleAddProduct(productValues)
        if (!wasCreated) return
      } else if (formState === FormState.EDIT && updateId) {
        await appToast.loadingPromise(
          updateProduct.mutateAsync({ id: updateId, values: productValues }),
          {
            loadingTitle: 'Updating product...',
            successTitle: 'Product updated',
            successDescription: 'The product details have been updated.',
            errorTitle: 'Failed to update product',
            errorDescription: 'Please check the form and try again.',
          },
        )
      }

      closeForm()
    } catch {
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!price) return

    if (lastEdited.current === 'percentage') {
      form.setValue('profit', Number(((price * percentage) / 100).toFixed(2)))
    }

    if (lastEdited.current === 'amount') {
      form.setValue('profitPercentage', Number(((amount / price) * 100).toFixed(2)))
    }
  }, [price, amount, percentage, form])

  useEffect(() => {
    if (!product) {
      form.reset()
      setImageMode('upload')
      return
    }

    form.reset(product)
    setImageMode(product.imageSource === 'url' ? 'url' : 'current')
  }, [product, form])

  const setValidatedImageMode = (mode: string) => {
    if (mode === 'current' || mode === 'upload' || mode === 'url') {
      setImageMode(mode)
    }
  }

  const fieldClassName =
    'h-11 rounded-xl border-[#dce3e2] px-3.5 text-[13px] shadow-none dark:border-[#2b4340]'
  const labelClassName = 'mb-1.5 text-[12.5px] font-medium'

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-[22px] py-5">
        <div className="rounded-2xl border border-dashed border-[#dce3e2] bg-[#fbfcfc] p-3.5 dark:border-[#2b4340] dark:bg-[#16292b]">
          <div className="mb-3 flex items-center gap-2">
            <ImageIcon className="size-4 text-[#007f78]" />
            <div>
              <p className="text-[12.5px] font-semibold">Product photo</p>
              <p className="text-[11px] text-[#93a5a5]">Upload an image or paste a URL. Optional.</p>
            </div>
          </div>

          <RadioGroup value={imageMode} onValueChange={setValidatedImageMode} className="mb-3 flex flex-wrap gap-3" disabled={isReadOnly}>
            {product?.id && (
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current" className="text-[11.5px]">Current</Label>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="upload" id="upload" />
              <Label htmlFor="upload" className="text-[11.5px]">Upload</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <RadioGroupItem value="url" id="url" />
              <Label htmlFor="url" className="text-[11.5px]">Image URL</Label>
            </div>
          </RadioGroup>

          {imageMode === 'current' && (
            <div className="flex items-center gap-3">
              <Avatar className="size-[66px] rounded-xl">
                <AvatarImage className="object-cover" src={product?.imageUrl ?? undefined} />
                <AvatarFallback className="rounded-xl"><ImageIcon className="size-5" /></AvatarFallback>
              </Avatar>
              <p className="text-xs text-[#5f7273] dark:text-[#9fb3b0]">Using the saved product image.</p>
            </div>
          )}

          {imageMode === 'url' && (
            <Input
              {...form.register('imageUrl')}
              readOnly={isReadOnly}
              placeholder="Paste image link"
              className={fieldClassName}
            />
          )}

          {imageMode === 'upload' && !isReadOnly && (
            <Dropzone {...dropzone}>
              <DropzoneMessage />
              <DropZoneArea>
                <DropzoneTrigger className="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#dce3e2] bg-white p-3 text-left hover:bg-[#f8fafa] dark:border-[#2b4340] dark:bg-[#12201f]">
                  <Avatar className={cn('size-[58px] rounded-xl', isPending && 'animate-pulse')}>
                    <AvatarImage className="object-cover" src={avatarSrc} />
                    <AvatarFallback className="rounded-xl"><Upload className="size-5" /></AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[12.5px] font-semibold">{avatarSrc ? 'Change product image' : 'Choose product image'}</p>
                    <p className="mt-0.5 text-[11px] text-[#93a5a5]">PNG or JPG, smaller than 2 MB</p>
                  </div>
                </DropzoneTrigger>
              </DropZoneArea>
            </Dropzone>
          )}
        </div>

        <div>
          <Label className={labelClassName}>Title <span className="text-red-600">*</span></Label>
          <Input {...form.register('title')} readOnly={isReadOnly} placeholder="Enter product name" className={fieldClassName} />
          {form.formState.errors.title && <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={labelClassName}>SKU</Label>
            <Input {...form.register('sku')} readOnly={isReadOnly} placeholder="SKU code" className={cn(fieldClassName, 'font-mono')} />
          </div>
          <div>
            <Label className={labelClassName}>Barcode</Label>
            <Input {...form.register('barcode')} readOnly={isReadOnly} placeholder="Scan or type" className={cn(fieldClassName, 'font-mono')} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="min-w-0">
            <Label className={labelClassName}>Price <span className="text-red-600">*</span></Label>
            <Input {...form.register('price')} readOnly={isReadOnly} type="number" step="0.01" placeholder="0.00" className={cn(fieldClassName, 'font-mono')} />
            {form.formState.errors.price && <p className="mt-1 text-xs text-red-600">{form.formState.errors.price.message}</p>}
          </div>
          <div className="min-w-0">
            <Label className={labelClassName}>Stock</Label>
            <Input {...form.register('stock')} readOnly={isReadOnly} type="number" placeholder="0" className={cn(fieldClassName, 'font-mono')} />
            {form.formState.errors.stock && <p className="mt-1 text-xs text-red-600">{form.formState.errors.stock.message}</p>}
          </div>
          <div className="min-w-0">
            <Label className={labelClassName}>Margin</Label>
            <Input
              {...form.register('profitPercentage', { onChange: () => { lastEdited.current = 'percentage' } })}
              readOnly={isReadOnly}
              disabled={!price}
              type="number"
              step="0.01"
              placeholder="0%"
              className={cn(fieldClassName, 'font-mono')}
            />
            {form.formState.errors.profitPercentage && <p className="mt-1 text-xs text-red-600">{form.formState.errors.profitPercentage.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className={labelClassName}>Category <span className="text-red-600">*</span></Label>
            <SearchableSelect
              value={form.watch('category')}
              items={PRODUCT_CATEGORY.map((category) => ({ value: category.value, label: category.name }))}
              onChange={(category) => form.setValue('category', category, { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
              readOnly={isReadOnly}
              label="Category"
              placeholder="Choose category"
            />
            {form.formState.errors.category && <p className="mt-1 text-xs text-red-600">{form.formState.errors.category.message}</p>}
          </div>
          <div>
            <Label className={labelClassName}>Supplier</Label>
            <Input {...form.register('supplier')} readOnly={isReadOnly} placeholder="Supplier name" className={fieldClassName} />
          </div>
        </div>

        <div>
          <Label className={labelClassName}>Profit amount</Label>
          <Input
            {...form.register('profit', { onChange: () => { lastEdited.current = 'amount' } })}
            readOnly={isReadOnly}
            disabled={!price}
            type="number"
            step="0.01"
            placeholder="0.00"
            className={cn(fieldClassName, 'font-mono')}
          />
          {form.formState.errors.profit && <p className="mt-1 text-xs text-red-600">{form.formState.errors.profit.message}</p>}
        </div>

        <div>
          <Label className={labelClassName}>Description</Label>
          <Textarea {...form.register('description')} readOnly={isReadOnly} rows={3} placeholder="Optional notes for staff." className="resize-y rounded-xl border-[#dce3e2] px-3.5 py-3 text-[13px] shadow-none dark:border-[#2b4340]" />
        </div>
      </div>

      <div className="flex gap-2.5 border-t border-[#edf1f0] bg-[#fbfcfc] px-[22px] py-3.5 dark:border-[#1e322f] dark:bg-[#16292b]">
        <Button type="button" variant="outline" onClick={closeForm} className="h-11 flex-1 rounded-xl border-[#dce3e2] bg-white text-[13px] dark:border-[#2b4340] dark:bg-[#12201f]">
          {isReadOnly ? 'Close' : 'Cancel'}
        </Button>
        {!isReadOnly && (
          <Button type="submit" disabled={isLoading} className="h-11 flex-[1.4] rounded-xl bg-[#0c4b47] text-[13px] font-semibold text-white hover:bg-[#007f78]">
            {formState === FormState.EDIT ? 'Update product' : 'Save product'}
          </Button>
        )}
      </div>
    </form>
  )
}
