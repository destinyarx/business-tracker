export type VideoLayout = 'landscape' | 'portrait';

export type DemoVideoProps = {
  layout: VideoLayout;
};

export type CustomerType = 'normal' | 'loyal' | 'deluxe' | 'premium' | 'VIP';

export type DemoCustomer = {
  id: number;
  name: string;
  customerType: CustomerType;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
};

export type DemoProduct = {
  id: number;
  title: string;
  category: string;
  sku: string;
  barcode: string;
  supplier: string;
  price: number;
  profit: number;
  profitPercentage: number;
  stock: number;
  palette: readonly [string, string];
  shortLabel: string;
};

export type DemoOrderItem = {
  id: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
};

export type DemoSale = {
  id: number;
  orderId: number;
  orderName: string;
  customerName: string;
  recognizedAt: string;
  itemSummary: string;
  units: number;
  totalAmount: number;
  totalProfit: number;
};

export type DashboardNumbers = {
  sales: number;
  expenses: number;
  profit: number;
  completedOrders: number;
  queuedOrders: number;
  totalOrders: number;
};
