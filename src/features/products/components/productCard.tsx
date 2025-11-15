import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Product {
    id: number
    title: string,
    description: string,
    price: number,
    stock: number,
    image: string,
    category: string
}

interface ProductProps {
    product: Product
}

export default function ProductCard({ product }: ProductProps ) {
    return (
        <div className="w-full max-w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative w-full h-48"> {/* height fixed */}
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover rounded-t-xl"
                />
            </div>

            <div className="flex flex-col flex-1 mb-2">
                <p className="inline-block bg-teal-500 text-white font-bold rounded-r-xl px-4 py-1 mr-20 mt-2 mb-2">
                    ₱{product.price}
                </p>

                <p className="text-[1rem] text-gray-600 font-semibold mb-2 ml-4">
                    {product.title}
                </p>

                <div className="flex flex-row justify-between mr-7">
                    <p className="text-slate-700 text-xs font-semibold ml-4">Stock: {product.stock}</p>

                    <p className="border rounded-xl bg-slate-800 text-white text-[0.6rem] ml-4 px-2">
                        {product.category}
                    </p>
                </div>

            </div>

            <div className="flex justify-center">
                <div className="border rounded-xl bg-orange-400 text-white text-[0.7rem] shadow-md hover:opacity-60 mb-2 px-2 py-1">
                    Update
                </div>
            </div>
        </div>
    )
}