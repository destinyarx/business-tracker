import assert from 'node:assert/strict'
import test from 'node:test'
import { formatSalesCurrency, getFilteredSales, getOrderTotal, getSalesSummary } from '../src/features/sales/sales.utils.ts'

const createOrder = ({ id, customer, items, totalAmount, profitInaccurate = false }) => ({
  id,
  customerId: null,
  orderName: `Order ${id}`,
  status: 'completed',
  notes: undefined,
  orderItems: [],
  items,
  totalAmount,
  totalProfit: 20,
  customer: customer ? { name: customer } : undefined,
  createdAt: '2026-09-01T08:00:00.000Z',
  statusUpdatedAt: '2026-09-01T09:00:00.000Z',
  profitInaccurate,
})

test('sales summary derives totals, units, and the best customer from completed orders', () => {
  const orders = [
    createOrder({ id: 1, customer: 'Nena Ramirez', totalAmount: 240, items: [{ quantity: 2, priceAtPurchase: 120 }] }),
    createOrder({ id: 2, customer: 'Grace Villanueva', totalAmount: undefined, items: [{ quantity: 3, priceAtPurchase: 50 }], profitInaccurate: true }),
    createOrder({ id: 3, customer: 'Nena Ramirez', totalAmount: 90, items: [{ quantity: 1, priceAtPurchase: 90 }] }),
  ]

  assert.equal(getOrderTotal(orders[1]), 150)
  assert.deepEqual(getSalesSummary(orders), {
    totalSales: 480,
    averageSale: 160,
    unitsSold: 6,
    bestCustomer: 'Nena Ramirez',
    profitInaccurate: true,
  })
  assert.match(formatSalesCurrency(480), /480\.00/)
})

test('sales filtering retains customer and product search and sorts by completion date', () => {
  const firstOrder = createOrder({ id: 1, customer: 'Nena Ramirez', totalAmount: 240, items: [{ quantity: 2, priceAtPurchase: 120, product: { id: 1, title: 'Coffee', price: 120 } }] })
  const secondOrder = {
    ...createOrder({ id: 2, customer: 'Grace Villanueva', totalAmount: 50, items: [{ quantity: 1, priceAtPurchase: 50, product: { id: 2, title: 'Crackers', price: 50 } }] }),
    statusUpdatedAt: '2026-09-02T09:00:00.000Z',
  }

  assert.deepEqual(getFilteredSales([firstOrder, secondOrder], 'grace', 'desc').map((order) => order.id), [2])
  assert.deepEqual(getFilteredSales([firstOrder, secondOrder], 'coffee', 'desc').map((order) => order.id), [1])
  assert.deepEqual(getFilteredSales([firstOrder, secondOrder], '', 'desc').map((order) => order.id), [2, 1])
})
