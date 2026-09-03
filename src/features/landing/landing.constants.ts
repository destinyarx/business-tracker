import {
  ChartNoAxesCombined,
  PackageOpen,
  ReceiptText,
  ShoppingBag,
  UsersRound,
  Warehouse,
} from 'lucide-react'
import type { LandingModule, LandingStep } from './landing.types'

export const landingModules: LandingModule[] = [
  {
    title: 'Customers',
    description:
      'Names, contact numbers, tiers and notes. Everything an order needs, already on file.',
    detail: 'Five tiers, from Normal to VIP',
    icon: UsersRound,
    tileClassName: 'bg-[#E8F7F5]',
    iconClassName: 'text-[#007F78]',
  },
  {
    title: 'Orders',
    description:
      'Build an order from stock, attach a customer or keep it as a guest sale, then move it through the queue.',
    detail: 'Pending to in progress to completed',
    icon: ShoppingBag,
    tileClassName: 'bg-[#E6F0FE]',
    iconClassName: 'text-[#1D4ED8]',
  },
  {
    title: 'Products',
    description:
      'Keep titles, SKUs, barcodes, suppliers, price and margin together in one product record.',
    detail: '37 categories out of the box',
    icon: PackageOpen,
    tileClassName: 'bg-[#FFF4DB]',
    iconClassName: 'text-[#8A6100]',
  },
  {
    title: 'Inventory',
    description:
      'See what is running low before a customer tells you. Stock movement follows completed orders.',
    detail: 'Low-stock and out-of-stock flags',
    icon: Warehouse,
    tileClassName: 'bg-[#F3EEFF]',
    iconClassName: 'text-[#5B34C7]',
  },
  {
    title: 'Expenses',
    description:
      'Record rent, utilities, restocks and salaries by category, with reference numbers kept for review.',
    detail: '16 categories, 6 payment methods',
    icon: ReceiptText,
    tileClassName: 'bg-[#FDECEC]',
    iconClassName: 'text-[#B01C1C]',
  },
  {
    title: 'Sales',
    description:
      'Read daily, weekly and monthly performance so you know which weeks actually paid.',
    detail: 'Today, 7 days, this month',
    icon: ChartNoAxesCombined,
    tileClassName: 'bg-[#E7F7EC]',
    iconClassName: 'text-[#166534]',
  },
]

export const landingSteps: LandingStep[] = [
  {
    number: '01',
    title: 'Add your products',
    description:
      'Import or type your list once with price, stock and supplier. SKUs are optional.',
  },
  {
    number: '02',
    title: 'Record orders as they come',
    description:
      'Add products to a cart, choose a customer or leave it as a guest sale, then place the order.',
  },
  {
    number: '03',
    title: 'Watch the numbers',
    description:
      'Stock drops as orders complete, expenses compare against sales and reports update automatically.',
  },
]
