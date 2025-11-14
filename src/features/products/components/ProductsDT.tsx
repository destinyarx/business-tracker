import { data } from '@/features/products/data'

import ProductCard from '@/features/products/components/productCard'

export default function ProductTable() {
    return (
        <div className="w-full max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {data.products.map((item) => (
                    <ProductCard key={item.id} product={item}/>
                ))}
            </div>
        </div>
    )
}