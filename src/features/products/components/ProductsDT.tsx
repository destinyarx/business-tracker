"use client"

import { useState } from 'react';
import { cn } from "@/lib/utils";
import ProductCard from '@/features/products/components/productCard';
import { data } from '@/features/products/data';
import { LoaderPinwheel, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react'

interface Props {
    onAddProduct: () => void
}

export default function ProductTable({ onAddProduct }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(2)
  const totalPages = 5

  const handleCreate = () => {
    onAddProduct()
  }

  const renderLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <LoaderPinwheel className="w-16 h-16 animate-spin text-teal-500" />
            <div className="flex items-center gap-2 text-teal-600 text-2xl font-medium">
                <Package className="w-8 h-8" />
                Fetching products, please wait...
            </div>
            <p className="text-gray-400 text-[0.75rem] text-center max-w-xs">
                We are loading the latest products. This may take a few seconds depending on your connection.
            </p>
        </div>
    )
  }

  const renderTable = () => {
    return (
        <div className="w-full pb-5">
            <div className="flex flex-row justify-between mb-3">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-10 bg-white border border-slate-300 focus-visible:ring-teal-500"
                    />
                </div>

                <div className="flex flex-row gap-3">
                    <Button
                        variant="outline"
                        className="bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-2"
                        onClick={handleCreate}
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {data.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="flex items-center justify-center gap-5 mt-5">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200",
                        currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Prev
                </button>

                { currentPage}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200",
                        currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    )}
                >
                    Next
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="w-full">
      {isLoading ? renderLoading() : renderTable() }
    </div>
  );
}
