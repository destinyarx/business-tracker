import assert from 'node:assert/strict'
import test from 'node:test'
import { createSalesApi } from '../src/features/sales/sales.api.ts'
import {
  formatSalesCurrency,
  getFilteredSales,
  getSaleTotal,
  getSalesSummary,
} from '../src/features/sales/sales.utils.ts'

const createSale = ({
  id,
  customerName,
  orderName = `Order ${id}`,
  notes = null,
  orderItems,
  totalAmount,
  profitInaccurate = false,
  recognizedAt = '2026-09-01T09:00:00.000Z',
}) => ({
  id,
  orderId: id + 100,
  orderName,
  customerId: null,
  customerName,
  totalAmount,
  totalProfit: '20.00',
  profitInaccurate,
  notes,
  state: 'active',
  recognizedAt,
  recognizedBy: 'user_1',
  revertedAt: null,
  revertedBy: null,
  reversalReason: null,
  createdAt: recognizedAt,
  updatedAt: null,
  orderItems,
})

test('sales summary calculates active Sale records with decimal-string money', () => {
  const sales = [
    createSale({ id: 1, customerName: 'Nena Ramirez', totalAmount: '240.00', orderItems: [{ quantity: 2 }] }),
    createSale({ id: 2, customerName: 'Grace Villanueva', totalAmount: '150.00', orderItems: [{ quantity: 3 }], profitInaccurate: true }),
    createSale({ id: 3, customerName: 'Nena Ramirez', totalAmount: '90.00', orderItems: [{ quantity: 1 }] }),
  ]

  assert.equal(getSaleTotal(sales[1]), 150)
  assert.deepEqual(getSalesSummary(sales), {
    totalSales: 480,
    averageSale: 160,
    unitsSold: 6,
    bestCustomer: 'Nena Ramirez',
    profitInaccurate: true,
  })
  assert.match(formatSalesCurrency(480), /480\.00/)
})

test('sales filtering searches only order name, customer name, and notes', () => {
  const firstSale = createSale({
    id: 1,
    customerName: 'Nena Ramirez',
    orderName: 'Morning order',
    notes: 'Walk-in purchase',
    totalAmount: '240.00',
    orderItems: [{ quantity: 2, product: { id: 1, title: 'Coffee' } }],
  })
  const secondSale = createSale({
    id: 2,
    customerName: 'Grace Villanueva',
    orderName: 'Afternoon order',
    totalAmount: '50.00',
    recognizedAt: '2026-09-02T09:00:00.000Z',
    orderItems: [{ quantity: 1, product: { id: 2, title: 'Crackers' } }],
  })

  assert.deepEqual(getFilteredSales([firstSale, secondSale], 'grace', 'desc').map((sale) => sale.id), [2])
  assert.deepEqual(getFilteredSales([firstSale, secondSale], 'walk-in', 'desc').map((sale) => sale.id), [1])
  assert.deepEqual(getFilteredSales([firstSale, secondSale], 'coffee', 'desc'), [])
  assert.deepEqual(getFilteredSales([firstSale, secondSale], '101', 'desc'), [])
  assert.deepEqual(getFilteredSales([firstSale, secondSale], '', 'desc').map((sale) => sale.id), [2, 1])
})

test('sales list request sends the dedicated range and sort parameters', async () => {
  let requestedPath = ''
  let requestedParams
  const salesApi = createSalesApi({
    get: async (path, config) => {
      requestedPath = path
      requestedParams = config.params
      return { data: { data: [] } }
    },
  })

  await salesApi.getAll({ range: 'this_week', sort: 'desc' })

  assert.equal(requestedPath, '/sales')
  assert.equal(requestedParams.get('range'), 'this_week')
  assert.equal(requestedParams.get('sort'), 'desc')
  assert.equal(requestedParams.has('state'), false)
  assert.equal(requestedParams.has('search'), false)
})
