'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Package,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Product } from '@/features/products/products.types'
import { useProductFormStore } from '@/features/products/store/useProductFormStore'
import ProductCard from '@/features/products/components/productCard'
import NoItemFound from '@/components/organisms/NoItemFound'
import { ModuleMetricCard } from '@/components/molecules/ModuleMetricCard'
import { PRODUCT_CATEGORY } from '@/constants'

interface ProductTableProps {
  products: Product[]
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount)

export default function ProductTable({ products }: ProductTableProps) {
  const { openForm } = useProductFormStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch =
        !normalizedQuery ||
        [product.title, product.sku, product.category, product.description]
          .filter((field): field is string => Boolean(field))
          .some((field) => field.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesSearch
    })
  }, [products, searchQuery, selectedCategory])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const currentProducts = filteredProducts.slice(startIndex, startIndex + pageSize)
  const inventoryUnits = products.reduce((total, product) => total + product.stock, 0)
  const lowStockProducts = products.filter((product) => product.stock <= 10).length
  const inventoryValue = products.reduce(
    (total, product) => total + product.stock * product.price,
    0,
  )

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex min-w-60 max-w-[460px] flex-1 items-center overflow-hidden rounded-full border border-[#e3e9e8] bg-[#f6f8f8] dark:border-[#243936] dark:bg-[#16292b]">
          <Input
            aria-label="Search products"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 flex-1 border-0 bg-transparent px-4 text-[13px] shadow-none focus-visible:ring-0"
          />
          <Search className="mr-4 size-4 text-[#7c8e8e]" />
        </div>
        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="h-10 rounded-[11px] border border-[#dce3e2] bg-white px-3 text-xs text-[#3f5254] outline-none focus:border-[#00beaa] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]"
        >
          <option value="all">All categories</option>
          {PRODUCT_CATEGORY.map((category) => (
            <option key={category.value} value={category.value}>
              {category.name}
            </option>
          ))}
        </select>
        <Button
          className="ml-auto h-10 rounded-[11px] bg-[#0c4b47] px-[18px] text-[13px] font-semibold text-white hover:bg-[#007f78]"
          onClick={openForm}
        >
          <Plus className="size-4" />
          Add product
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <ModuleMetricCard label="Total products" value={String(products.length)} hint="Catalog records" icon={Package} accent="#12cdbe" iconClassName="bg-[#e4f7f4] text-[#007f78]" chartValues={[4, 6, 5, 8, 7, 10, 12]} />
        <ModuleMetricCard label="Units in stock" value={String(inventoryUnits)} hint="Across all products" icon={Boxes} accent="#5b8def" iconClassName="bg-[#e6f0fe] text-[#1d4ed8]" chartValues={[8, 7, 9, 8, 11, 10, 12]} />
        <ModuleMetricCard label="Low stock" value={String(lowStockProducts)} hint="10 units or fewer" icon={TriangleAlert} accent="#ffb018" iconClassName="bg-[#fff7e0] text-[#8a6100]" chartValues={[7, 5, 6, 4, 5, 3, 4]} />
        <ModuleMetricCard label="Inventory value" value={formatCurrency(inventoryValue)} hint="Price × available stock" icon={CircleDollarSign} accent="#9b74e8" iconClassName="bg-[#f3eeff] text-[#5b34c7]" chartValues={[4, 5, 7, 6, 8, 9, 11]} />
      </div>

      {currentProducts.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,258px),1fr))] gap-3.5">
          {currentProducts.map((product) => (
            <ProductCard key={product.id ?? product.title} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[20px] border border-[#e3e9e8] bg-white py-16 dark:border-[#243936] dark:bg-[#12201f]">
          <NoItemFound title="No products found" description="Try another filter or add your first product." />
        </div>
      )}

      {filteredProducts.length > pageSize && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1}
            className="h-9 rounded-[10px] border-[#dce3e2] bg-white text-xs dark:border-[#2b4340] dark:bg-[#12201f]"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <span className="font-mono text-xs text-[#5f7273] dark:text-[#9fb3b0]">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages}
            className={cn('h-9 rounded-[10px] border-[#dce3e2] bg-white text-xs dark:border-[#2b4340] dark:bg-[#12201f]')}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
