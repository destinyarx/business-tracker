"use client"

import { useState } from 'react';
import ProductCard from '@/features/products/components/productCard';
import { data } from '@/features/products/data';
import { LoaderPinwheel, Package, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductTable() {
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(2)
  const totalPages = 1


  return (
    <div className="w-full">
      {isLoading ? (
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
      ) : (
        <div className="w-full pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {data.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="flex items-center justify-center gap-5 mt-5">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm
                    ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
                    transition-colors duration-200`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    Prev
                </button>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm
                    ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'}
                    transition-colors duration-200`}
                >
                    Next
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
