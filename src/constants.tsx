export const PRODUCT_CATEGORY = [
    // FOOD & GROCERIES
    { value: "groceries", name: "Groceries" },
    { value: "fresh-produce", name: "Fresh Produce" },
    { value: "meat-seafood", name: "Meat & Seafood" },
    { value: "packaged-food", name: "Packaged Food" },
    { value: "snacks", name: "Snacks" },
    { value: "beverages", name: "Beverages" },
    { value: "baking-supplies", name: "Baking Supplies" },
    { value: "dairy-eggs", name: "Dairy & Eggs" },
    { value: "condiments", name: "Condiments & Sauces" },
  
    // HARDWARE & CONSTRUCTION
    { value: "hardware", name: "Hardware" },
    { value: "construction-materials", name: "Construction Materials" },
    { value: "plumbing", name: "Plumbing Supplies" },
    { value: "electrical", name: "Electrical Supplies" },
    { value: "paints-coatings", name: "Paints & Coatings" },
    { value: "safety-equipment", name: "Safety Equipment" },
  
    // GENERAL MERCHANDISE
    { value: "electronics", name: "Electronics" },
    { value: "mobile-accessories", name: "Mobile & Accessories" },
    { value: "appliances", name: "Appliances" },
    { value: "tools", name: "Tools" },
    { value: "furniture", name: "Furniture" },
    { value: "home-living", name: "Home & Living" },
    { value: "kitchenware", name: "Kitchenware" },
    { value: "cleaning-supplies", name: "Cleaning Supplies" },
  
    // PERSONAL GOODS
    { value: "clothing", name: "Clothing" },
    { value: "footwear", name: "Footwear" },
    { value: "beauty-care", name: "Beauty & Personal Care" },
    { value: "health-wellness", name: "Health & Wellness" },
    { value: "baby-products", name: "Baby Products" },
  
    // AUTO & OUTDOORS
    { value: "automotive", name: "Automotive" },
    { value: "motorcycle-parts", name: "Motorcycle Parts" },
    { value: "outdoor-garden", name: "Outdoor & Garden" },
    { value: "sports-fitness", name: "Sports & Fitness" },
  
    // OTHERS
    { value: "office-supplies", name: "Office Supplies" },
    { value: "books-stationery", name: "Books & Stationery" },
    { value: "pet-supplies", name: "Pet Supplies" },
    { value: "toys-games", name: "Toys & Games" },
];

export const ORDER_STATUS = [
    { name: 'Pending', value: 'pending', color: 'bg-amber-500' },
    { name: 'In Progress', value: 'in_progress', color: 'bg-[#3B82F6]' },
    { name: 'Completed', value: 'completed', color: 'bg-[#16A34A]' },
    { name: 'Cancelled', value: 'cancelled', color: 'bg-[#DC2626]' },
] as const

export const ORDER_STATUS_VALUE = {
    'pending': 'Pending',
    'in_progress': 'Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
}
  