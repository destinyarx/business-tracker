"use client"

import { useState, useEffect, useMemo } from 'react';
import { cn } from "@/lib/utils";
import ProductCard from '@/features/products/components/productCard';
import { data } from '@/features/products/data';
import { LoaderPinwheel, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react'
import { Product } from '@/features/products/products.types'
import { useProductFormStore } from '@/features/products/store/useProductFormStore';

interface Props {
    products: Product[],
}

export default function ProductTable({ products }: Props) {
    const { openForm } = useProductFormStore()

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
          const matchesSearch =
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    
          const matchesCategory =
            selectedCategory === 'all' || product.category === selectedCategory
    
          return matchesSearch && matchesCategory
        })
    }, [products, searchQuery, selectedCategory])

    const categories = useMemo(() => {
        const set = new Set(products.map((p) => p.category))
        return ['all', ...Array.from(set)]
    }, [products])
    
    // Pagination
    const pageSize = 10
    const totalPages = Math.ceil(filteredProducts.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const currentItems = filteredProducts.slice(startIndex, endIndex)
      
    return (
        <div className="w-full pb-5">
            <div className="flex flex-row justify-between mb-3">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setCurrentPage(1)
                        }}
                        placeholder="Search products..."
                        className="pl-10 bg-white border border-slate-300 focus-visible:ring-teal-500"
                    />
                </div>

                <div className="flex flex-row gap-3">
                    <Button
                        variant="outline"
                        className="bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-2"
                        onClick={() => openForm()}
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </div>
            </div>
            
            {currentItems.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {currentItems.map((product) => (
                            <ProductCard key={product.id} product={product} />
                    ))}
                    </div>
            ) : (
                <div className="text-2xl text-center text-semibold text-gray-600 mt-10 mb-5">No Products Found.</div>
            )}
            

            {!!currentItems.length && (
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

                    {currentPage}

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
            )}
        </div>
    )
    
}
