"use client"

import ProductTable from "@/features/products/components/ProductsTable";
import { Modal } from '@/components/molecules/Modal'
import ProductForm from '@/features/products/components/productForm'
import Loading from '@/components/organisms/Loading'
import { useProductFormStore } from '@/features/products/store/useProductFormStore';
import { useProducts } from '@/features/products/hooks/useProducts'

export default function Products() {
  const { productsQuery } = useProducts()
  const { showForm, setShowForm } = useProductFormStore()

  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
        <div className="m-5">
          {productsQuery.isLoading ? (
            <Loading  message="Fetching products, please wait..." />
          ) : (
            <ProductTable products={productsQuery.data ?? []} />
          )}
        </div>

        <Modal 
          open={showForm} 
          onOpenChange={setShowForm} 
          title="Create Product"
          className="lg:max-w-4xl"
        >
          <ProductForm />
        </Modal>
    </div>
  );
}
  