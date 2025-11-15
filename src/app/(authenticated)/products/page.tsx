"use client"

import { useState } from 'react'
import ProductTable from "@/features/products/components/ProductsDT";
import { Modal } from '@/components/molecules/Modal'
import ProductForm from '@/features/products/components/productForm'

export default function Products() {
  const [showForm, setShowForm] = useState<boolean>(false)

  const handleCreate = () => {
    setShowForm(true)
    console.log('Parent created products')
  }

  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
        <div className="m-5">
          <ProductTable onAddProduct={handleCreate}/>
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
  