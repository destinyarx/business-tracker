import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createInventorySummary,
} from '../src/features/inventory/inventory.utils.ts'

const products = [
  {
    id: 1,
    title: 'Coffee beans',
    description: null,
    price: 250,
    stock: 12,
  },
  {
    id: 2,
    title: 'Paper cups',
    description: null,
    price: 5,
    stock: 4,
  },
]

test('inventory summary derives every value from persisted product stock', () => {
  const summary = createInventorySummary(products)

  assert.equal(summary.stockValue, 3020)
  assert.equal(summary.unitsOnHand, 16)
  assert.deepEqual(
    summary.outOfStockProducts.map((product) => product.id),
    [],
  )
  assert.deepEqual(
    summary.lowStockProducts.map((product) => product.id),
    [2],
  )
})
