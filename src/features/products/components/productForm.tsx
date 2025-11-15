"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

const schema = z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional(),
    price: z.preprocess(
        (val) => Number(val), 
        z.number().min(0, "Price must be 0 or greater")
    ),
    stock: z.preprocess(
        (val) => Number(val), 
        z.number().min(0, "Stock must be 0 or greater")
    ),
    profit: z.preprocess(
        (val) => Number(val), 
        z.number().optional()
    ),
    category: z.string().min(1, "Category is required"),
})

export default function ProductForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      profit: 0,
      category: "",
    },
  })

  function onSubmit(values: any) {
    console.log(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="grid gap-1">
        <Label className="mb-1">Product Title</Label>
        <Input placeholder="Enter product name" {...form.register("title")} />
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
            <Label className="mb-1">Category</Label>
            <Select onValueChange={(val) => form.setValue("category", val)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose category"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="food">Food</SelectItem>
            </SelectContent>
            </Select>
        </div>

        <div>
            <Label className="mb-1">SKU / Product Code</Label>
            <Input placeholder="Optional SKU code" />
        </div>

        <div>
            <Label className="mb-1">Supplier</Label>
            <Input placeholder="Supplier name (optional)" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label className="mb-1">Price</Label>
          <Input placeholder="0.00" type="number" step="1" {...form.register("price")} />
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
            <Label className="mb-1">Profit</Label>
            <Input placeholder="0.00" type="number" step="1" {...form.register("profit")} />

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
