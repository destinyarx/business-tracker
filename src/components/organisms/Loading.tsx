import { LoaderPinwheel, Package } from 'lucide-react'

interface Props {
    message?: string,
    description?: string
}

export default function Loading ({
    message = 'Fetching items, please wait...', 
    description = 'We are loading the latest products. This may take a few seconds depending on your connection.'}
    : Props)
{
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <LoaderPinwheel className="w-16 h-16 animate-spin text-teal-500" />
            <div className="flex items-center gap-2 text-teal-600 text-2xl font-medium">
                <Package className="w-8 h-8" />
                {message}
            </div>
            <p className="text-gray-400 text-[0.75rem] text-center max-w-xs">
                {description}
            </p>
        </div>
    )
}