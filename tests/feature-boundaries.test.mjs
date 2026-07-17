import assert from 'node:assert/strict'
import test from 'node:test'
import { customersResponseSchema } from '../src/features/customers/customers.schema.ts'
import { paginatedExpensesResponseSchema } from '../src/features/expenses/expenses.schema.ts'
import { paginatedOrdersResponseSchema } from '../src/features/orders/order.schema.ts'
import { productsResponseSchema } from '../src/features/products/products.schema.ts'
import { toFeatureError } from '../src/lib/feature-error.ts'

const validCustomer = {
  id: 1,
  name: 'Sample Customer',
  customerType: 'normal',
  createdAt: '2026-07-12T00:00:00.000Z',
}

const validProduct = {
  id: 1,
  title: 'Sample Product',
  description: null,
  price: 100,
  stock: 2,
}

test('customer response parsing rejects a malformed successful payload', () => {
  const result = customersResponseSchema.safeParse({ data: [{ ...validCustomer, id: '1' }] })
  assert.equal(result.success, false)
})

test('customer response parsing accepts backend status codes', () => {
  const result = customersResponseSchema.safeParse({
    statusCode: 200,
    message: 'Success',
    data: [{
      ...validCustomer,
      status: 'A',
      createdAt: '2026-07-17 07:02:16.91523',
    }],
    timestamp: '2026-07-17T07:06:38.869Z',
    path: '/customers',
  })

  assert.equal(result.success, true)
})

test('product response parsing rejects a missing required field', () => {
  const malformedProduct = { ...validProduct, stock: undefined }
  const result = productsResponseSchema.safeParse({ data: [malformedProduct] })
  assert.equal(result.success, false)
})

test('response validation failures become safe feature errors', () => {
  const result = productsResponseSchema.safeParse({ data: [{ ...validProduct, id: '1' }] })
  assert.equal(result.success, false)

  const featureError = toFeatureError('product', result.error)
  assert.equal(featureError.kind, 'invalid_response')
  assert.equal(featureError.message.includes('id'), false)
})

test('expense response parsing normalizes dates and numbers', () => {
  const result = paginatedExpensesResponseSchema.parse({
    data: {
      results: [{
        id: 1,
        title: 'Rent',
        dateIncurred: '2026-07-01T00:00:00.000Z',
        amount: '5000',
        category: 'rent',
        paymentMethod: 'cash',
      }],
      hasNext: false,
    },
  })

  assert.equal(result.data.results[0].amount, 5000)
  assert.ok(result.data.results[0].dateIncurred instanceof Date)
})

test('order response parsing accepts nested API summaries', () => {
  const result = paginatedOrdersResponseSchema.safeParse({
    data: {
      orders: [{
        id: 1,
        customerId: 3,
        orderName: 'Sample order',
        status: 'pending',
        notes: null,
        totalAmount: '100.00',
        totalProfit: '20.00',
        customer: { name: 'Luigi Santos' },
        items: [{
          quantity: 1,
          priceAtPurchase: '100.00',
          subtotal: '100.00',
          product: {
            id: 2,
            title: 'Sample Product',
            price: '100.00',
            profit: '20.00',
          },
        }],
        createdAt: '2026-07-17T07:02:16.915Z',
        statusUpdatedAt: null,
        profitInaccurate: false,
      }],
      hasNext: false,
    },
  })

  assert.equal(result.success, true)
})

for (const [status, expectedKind] of [
  [401, 'unauthenticated'],
  [403, 'forbidden'],
  [409, 'conflict'],
  [422, 'invalid_request'],
  [500, 'server'],
]) {
  test(`HTTP ${status} becomes a ${expectedKind} feature failure`, () => {
    const axiosError = Object.assign(new Error('backend details'), {
      isAxiosError: true,
      response: { status },
    })

    const featureError = toFeatureError('test', axiosError)

    assert.equal(featureError.kind, expectedKind)
    assert.equal(featureError.status, status)
    assert.equal(featureError.message.includes('backend details'), false)
  })
}
