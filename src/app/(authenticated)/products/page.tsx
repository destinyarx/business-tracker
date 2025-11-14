import ProductTable from "@/features/products/components/ProductsDT";

export default function Products() {
  return (
    <div className="w-full max-w-full min-h-screen bg-gradient-to-br from-teal-50 via-gray-50 to-teal-100 text-gray-800">
        <div className="text-3xl font-semibold ml-3 mt-3">Products</div>

        <div className="m-5">
            <ProductTable />
        </div>
    </div>
  );
}
  