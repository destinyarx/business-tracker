import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createInventorySummary,
  getEffectiveStock,
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

test('inventory summary applies temporary stock previews to every derived value', () => {
  const stockOverrides = { 1: 0, 2: 8 }
  const summary = createInventorySummary(products, stockOverrides)

  assert.equal(getEffectiveStock(products[0], stockOverrides), 0)
  assert.equal(summary.stockValue, 40)
  assert.equal(summary.unitsOnHand, 8)
  assert.deepEqual(
    summary.outOfStockProducts.map((product) => product.id),
    [1],
  )
  assert.deepEqual(
    summary.lowStockProducts.map((product) => product.id),
    [2],
  )
})
