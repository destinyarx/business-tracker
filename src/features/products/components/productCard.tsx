import Image from 'next/image'
import { cn } from '@/lib/utils'
import { MoreVertical, CircleAlert } from 'lucide-react'
import { DropdownMenu,  DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Product } from '@/features/products/products.types'
import { useProductFormStore } from '@/features/products/store/useProductFormStore';
import { useProducts } from '@/features/products/hooks/useProducts'
import { PRODUCT_CATEGORY } from '@/constants'

interface ProductProps {
    product: Product
}

export default function ProductCard({ product }: ProductProps ) {
    const { deleteProduct } = useProducts()
    const { editForm, viewForm, closeForm } = useProductFormStore()

    const handleDelete = async (id: number|undefined) => {
        if(!id) return
        
        try {
            const request = await deleteProduct.mutateAsync(id)
            closeForm()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-full max-w-full bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col justify-between h-full">
                <div className="relative w-full h-48">
                    <Image
                        src={product.image ?? 'https://foodish-api.com/images/pasta/pasta1.jpg'}
                        alt={product.title}
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw'
                        fill
                        className="object-cover rounded-t-xl"
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className='absolute top-2 right-2 z-20 bg-black/60 hover:bg-black/80 text-white rounded-full p-1'>
                                <MoreVertical size={18} />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align='end' className='w-28 bg-white text-sm font-medium'>
                            <DropdownMenuItem onClick={() => viewForm(product)}>
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editForm(product)}>
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-col justify-between">
                    <div className="flex flex-col flex-1 mb-2">
                        <div className="flex flex-row justify-between items-center px-2 mt-1">
                            <p className="text-gray-400 font-light text-[0.7rem] mt-1">
                                {product.sku && (
                                    <span>#{product.sku}</span>
                                )}
                            </p>

                            <p className="border rounded-xl bg-slate-800 text-white text-[0.6rem] px-2">
                                { product.category ? PRODUCT_CATEGORY.find(c => c.value === product.category)?.name : ''}
                            </p>
                        </div>

                        <p className="text-[1.1rem] text-gray-600 font-semibold ml-2">
                            {product.title}
                        </p>

                        <p className="min-h-2 text-[0.7rem] text-slate-500 font-light italic truncate ml-2 -mt-1">
                            {product.description ?? null}
                        </p>
                    </div>

                    <div className="flex flex-row justify-between items-center pr-2 mb-1">
                        <p className="bg-teal-500 w-fit text-white font-bold rounded-r-xl px-4 py-1 mb-2">
                            ₱{product.price}
                        </p>

                        <div  className={cn(
                                "flex flex-row items-center gap-1 bg-slate-600 text-[0.8rem] text-white rounded-xl font-semibold ml-4 px-2 py-1",
                                product.stock ? "bg-slate-600" : "bg-rose-600"
                            )}
                        >
                            <span>{!product.stock && <CircleAlert className="w-4"/>}</span>
                            Stock: {product.stock}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}