import type {
  DashboardNumbers,
  DemoCustomer,
  DemoOrderItem,
  DemoProduct,
  DemoSale,
} from './types';

export const demoOwner = {
  name: 'Maria Santos',
  role: 'Business owner',
  businessName: 'Habi Home & Pantry',
} as const;

export const customers: DemoCustomer[] = [
  {
    id: 201,
    name: 'Angela Garcia',
    customerType: 'VIP',
    phone: '09171234567',
    email: 'angela.garcia@example.ph',
    notes: 'Weekly office pantry delivery, call lobby on arrival.',
    createdAt: '2026-09-03T02:20:00.000Z',
  },
  {
    id: 202,
    name: 'Carlo Reyes',
    customerType: 'loyal',
    phone: '09184561234',
    email: 'carlo.reyes@example.ph',
    notes: 'Prefers GCash and afternoon pickup.',
    createdAt: '2026-08-16T05:40:00.000Z',
  },
  {
    id: 203,
    name: 'Juan Dela Cruz',
    customerType: 'normal',
    phone: '09951239876',
    email: 'juan.delacruz@example.ph',
    notes: 'Walk-in customer from Project 4, Quezon City.',
    createdAt: '2026-09-21T08:15:00.000Z',
  },
  {
    id: 204,
    name: 'Liza Mendoza',
    customerType: 'premium',
    phone: '09207893456',
    email: 'liza.mendoza@example.ph',
    notes: 'Ships gift packs to Cebu branch.',
    createdAt: '2026-07-09T01:45:00.000Z',
  },
  {
    id: 205,
    name: 'Paolo Bautista',
    customerType: 'deluxe',
    phone: '09193334455',
    email: 'paolo.bautista@example.ph',
    notes: 'Batangas reseller, usually orders by case.',
    createdAt: '2026-06-12T03:10:00.000Z',
  },
];

export const products: DemoProduct[] = [
  {
    id: 101,
    title: 'Kapeng Barako 250g',
    category: 'Beverages',
    sku: 'BEV-KB250',
    barcode: '4809010101012',
    supplier: 'Batangas Brew Co.',
    price: 320,
    profit: 96,
    profitPercentage: 30,
    stock: 24,
    palette: ['#70472f', '#d6a66b'],
    shortLabel: 'KB',
  },
  {
    id: 102,
    title: 'Ube Pandesal Box',
    category: 'Baking Supplies',
    sku: 'BAK-UPB06',
    barcode: '4809010101029',
    supplier: "Tita Nena's Bakery",
    price: 280,
    profit: 84,
    profitPercentage: 30,
    stock: 18,
    palette: ['#6945a7', '#c9a5ed'],
    shortLabel: 'UP',
  },
  {
    id: 103,
    title: 'Cebu Dried Mango 200g',
    category: 'Snacks',
    sku: 'SNK-CDM200',
    barcode: '4809010101036',
    supplier: 'Sugbo Harvest',
    price: 245,
    profit: 61.25,
    profitPercentage: 25,
    stock: 9,
    palette: ['#f1a91b', '#ffd96a'],
    shortLabel: 'DM',
  },
  {
    id: 104,
    title: 'Laguna Buko Pie',
    category: 'Packaged Food',
    sku: 'PFD-LBP01',
    barcode: '4809010101043',
    supplier: 'Bay Pie House',
    price: 390,
    profit: 117,
    profitPercentage: 30,
    stock: 7,
    palette: ['#926f3f', '#ead9aa'],
    shortLabel: 'BP',
  },
  {
    id: 105,
    title: 'Tablea Chocolate 10s',
    category: 'Beverages',
    sku: 'BEV-TAB10',
    barcode: '4809010101050',
    supplier: 'Davao Cacao Works',
    price: 210,
    profit: 63,
    profitPercentage: 30,
    stock: 32,
    palette: ['#4f2b23', '#a96f50'],
    shortLabel: 'TC',
  },
  {
    id: 106,
    title: 'Banana Chips 250g',
    category: 'Snacks',
    sku: 'SNK-BC250',
    barcode: '4809010101067',
    supplier: 'Davao Gold Foods',
    price: 180,
    profit: 45,
    profitPercentage: 25,
    stock: 4,
    palette: ['#c6961c', '#f8df79'],
    shortLabel: 'BC',
  },
  {
    id: 107,
    title: 'Calamansi Concentrate',
    category: 'Beverages',
    sku: 'BEV-CAL500',
    barcode: '4809010101074',
    supplier: 'Laguna Citrus Farm',
    price: 260,
    profit: 78,
    profitPercentage: 30,
    stock: 16,
    palette: ['#5b8d2c', '#b8d96b'],
    shortLabel: 'CC',
  },
  {
    id: 108,
    title: 'Abaca Market Tote',
    category: 'Home & Living',
    sku: 'HOM-AMT01',
    barcode: '4809010101081',
    supplier: 'Bicol Habi Collective',
    price: 450,
    profit: 135,
    profitPercentage: 30,
    stock: 0,
    palette: ['#826947', '#d2bf94'],
    shortLabel: 'AT',
  },
];

export const heroOrderItems: DemoOrderItem[] = [
  {
    id: 9101,
    productId: 102,
    quantity: 2,
    priceAtPurchase: 280,
    subtotal: 560,
  },
  {
    id: 9102,
    productId: 103,
    quantity: 2,
    priceAtPurchase: 245,
    subtotal: 490,
  },
  {
    id: 9103,
    productId: 107,
    quantity: 1,
    priceAtPurchase: 260,
    subtotal: 260,
  },
];

export const heroOrder = {
  id: 5026,
  customerId: 203,
  customerName: 'Juan Dela Cruz',
  orderName: "Juan's Merienda Pack",
  notes: 'Pickup at 4:30 PM, Quezon City.',
  createdAt: 'Sep 29, 2026 · 2:14 PM',
  totalAmount: 1310,
  totalProfit: 368.5,
  itemCount: 5,
} as const;

export const existingSales: DemoSale[] = [
  {
    id: 7001,
    orderId: 5001,
    orderName: 'QC Office Pantry Restock',
    customerName: 'Angela Garcia',
    recognizedAt: 'Sep. 29, 2026 · 09:12 AM',
    itemSummary: '3× Kapeng Barako · 2× Tablea Chocolate',
    units: 5,
    totalAmount: 1380,
    totalProfit: 414,
  },
  {
    id: 7002,
    orderId: 5002,
    orderName: 'Cebu Gift Pack Batch',
    customerName: 'Liza Mendoza',
    recognizedAt: 'Sep. 27, 2026 · 02:40 PM',
    itemSummary: '4× Native Snack Gift Box',
    units: 4,
    totalAmount: 2720,
    totalProfit: 816,
  },
  {
    id: 7003,
    orderId: 5003,
    orderName: 'Afternoon Pickup',
    customerName: 'Carlo Reyes',
    recognizedAt: 'Sep. 24, 2026 · 04:05 PM',
    itemSummary: '2× Ube Pandesal · 2× Calamansi',
    units: 4,
    totalAmount: 1080,
    totalProfit: 324,
  },
];

export const heroSale: DemoSale = {
  id: 7026,
  orderId: 5026,
  orderName: "Juan's Merienda Pack",
  customerName: 'Juan Dela Cruz',
  recognizedAt: 'Sep. 29, 2026 · 02:24 PM',
  itemSummary: '2× Ube Pandesal · 2× Dried Mango · 1× Calamansi',
  units: 5,
  totalAmount: 1310,
  totalProfit: 368.5,
};

export const dashboardBefore: DashboardNumbers = {
  sales: 52470,
  expenses: 42830,
  profit: 15741,
  completedOrders: 24,
  queuedOrders: 6,
  totalOrders: 38,
};

export const dashboardAfter: DashboardNumbers = {
  sales: 53780,
  expenses: 42830,
  profit: 16109.5,
  completedOrders: 25,
  queuedOrders: 5,
  totalOrders: 38,
};

export const expenseBreakdown = [
  { label: 'Rent', amount: 18000, percentage: 42, color: '#5b34c7' },
  { label: 'Salary', amount: 12000, percentage: 28, color: '#1d4ed8' },
  { label: 'Supplies', amount: 4250, percentage: 10, color: '#a8d97c' },
  { label: 'Utilities', amount: 3680, percentage: 9, color: '#ffb018' },
] as const;

export const topProducts = [
  {
    rank: 1,
    title: 'Native Snack Gift Box',
    revenue: 10880,
    sold: 16,
    percent: 100,
  },
  {
    rank: 2,
    title: 'Kapeng Barako 250g',
    revenue: 8320,
    sold: 26,
    percent: 76,
  },
  { rank: 3, title: 'Ube Pandesal Box', revenue: 7560, sold: 27, percent: 69 },
] as const;

export const topCustomers = [
  { rank: 1, name: 'Angela Garcia', orders: 7, sales: 11460, percent: 21 },
  { rank: 2, name: 'Liza Mendoza', orders: 5, sales: 9860, percent: 18 },
  { rank: 3, name: 'Paolo Bautista', orders: 4, sales: 7710, percent: 14 },
  { rank: 4, name: 'Juan Dela Cruz', orders: 3, sales: 5420, percent: 10 },
] as const;

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
