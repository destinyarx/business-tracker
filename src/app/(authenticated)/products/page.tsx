"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useApi } from '@/lib/api'
import type { Product } from '@/features/products/products.types'
import ProductTable from "@/features/products/components/ProductsTable";
import { Modal } from '@/components/molecules/Modal'
import ProductForm from '@/features/products/components/productForm'
import Loading from '@/components/organisms/Loading'
import { useProductFormStore } from '@/features/products/store/useProductFormStore';

export default function Products() {
  const api = useApi()
  const { userId } = useAuth()
  const { showForm, closeForm, setShowForm } = useProductFormStore()

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    try {
        setIsLoading(true)
        console.log(userId)
        const { data } = await api.get(`/products`)
        setProducts(data.data)
        console.log(data.data)
    } catch (error) {
        console.log(error)
    } finally {
        setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    closeForm()
    fetchProducts()
  }

  useEffect(() => {
      fetchProducts()
  }, [userId])

  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
        <div className="m-5">
          {isLoading ? (
            <Loading  message="Fetching products, please wait..." />
          ) : (
            <ProductTable products={products} />
          )}
        </div>

        <Modal 
          open={showForm} 
          onOpenChange={setShowForm} 
          title="Create Product"
          className="lg:max-w-4xl"
        >
          <ProductForm handleSuccess={handleSuccess}/>
        </Modal>
    </div>
  );
}
  