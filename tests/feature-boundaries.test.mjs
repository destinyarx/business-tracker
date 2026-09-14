import assert from 'node:assert/strict'
import test from 'node:test'
import {
  customerFormSchema,
  customersResponseSchema,
} from '../src/features/customers/customers.schema.ts'
import { createCustomersApi } from '../src/features/customers/customers.api.ts'
import { paginatedExpensesResponseSchema } from '../src/features/expenses/expenses.schema.ts'
import { paginatedOrdersResponseSchema } from '../src/features/orders/order.schema.ts'
import { toUpdateOrderStatusCommand } from '../src/features/orders/order.mapper.ts'
import { parseOrderQuantity } from '../src/features/orders/order.utils.ts'
import { createProductsApi } from '../src/features/products/products.api.ts'
import {
  productFormSchema,
  productsResponseSchema,
} from '../src/features/products/products.schema.ts'
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

test('customer form accepts an omitted phone or exactly 11 digits', () => {
  const baseCustomer = {
    name: 'Sample Customer',
    customerType: 'normal',
    email: '',
    notes: '',
  }

  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, phone: '' }).success, true)
  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, phone: '09123456789' }).success, true)
  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, phone: '9123456789' }).success, false)
  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, phone: '091234567890' }).success, false)
  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, phone: '09123abc789' }).success, false)
})

test('customer form accepts an omitted or valid email', () => {
  const baseCustomer = {
    name: 'Sample Customer',
    customerType: 'normal',
    phone: '',
    notes: '',
  }

  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, email: '' }).success, true)
  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, email: 'customer@example.com' }).success, true)
  assert.equal(customerFormSchema.safeParse({ ...baseCustomer, email: 'invalid-email' }).success, false)
})

test('customer create and update requests normalize blank contacts to null', async () => {
  let createRequestBody
  let updateRequestBody
  const customersApi = createCustomersApi({
    post: async (_path, body) => {
      createRequestBody = body
      return { data: {} }
    },
    patch: async (_path, body) => {
      updateRequestBody = body
      return { data: {} }
    },
  })

  const customer = {
    name: 'Sample Customer',
    customerType: 'normal',
    phone: '',
    email: ' ',
    notes: '',
  }

  await customersApi.create(customer)
  await customersApi.update(1, customer)

  assert.equal(createRequestBody.phone, null)
  assert.equal(createRequestBody.email, null)
  assert.equal(updateRequestBody.phone, null)
  assert.equal(updateRequestBody.email, null)
})

test('product response parsing rejects a missing required field', () => {
  const malformedProduct = { ...validProduct, stock: undefined }
  const result = productsResponseSchema.safeParse({ data: [malformedProduct] })
  assert.equal(result.success, false)
})

test('an API product with empty optional fields can be resubmitted for update', () => {
  const product = productsResponseSchema.parse({
    data: [{
      ...validProduct,
      category: 'food-and-beverage',
      sku: null,
      barcode: null,
      supplier: null,
      profitPercentage: null,
      profit: null,
      image: null,
      imageUrl: null,
      imageSource: null,
    }],
  }).data[0]

  const result = productFormSchema.safeParse(product)

  assert.equal(result.success, true)
})

test('product image URLs accept HTTP images and reject malformed URLs', () => {
  const product = {
    ...validProduct,
    category: 'food-and-beverage',
    imageUrl: 'https://placehold.net/400x600.png',
  }

  assert.equal(productFormSchema.safeParse(product).success, true)
  assert.equal(
    productFormSchema.safeParse({ ...product, imageUrl: 'https://' }).success,
    false,
  )
  assert.equal(
    productFormSchema.safeParse({ ...product, imageUrl: 'ftp://example.com/image.png' }).success,
    false,
  )
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

test('order quantities accept positive whole numbers without leading zeroes', () => {
  assert.equal(parseOrderQuantity('56'), 56)
  assert.equal(parseOrderQuantity('110'), 110)
  assert.equal(parseOrderQuantity('056'), null)
  assert.equal(parseOrderQuantity('00110'), null)
  assert.equal(parseOrderQuantity('0'), null)
  assert.equal(parseOrderQuantity('-1'), null)
  assert.equal(parseOrderQuantity('1.5'), null)
})

test('order status command matches the backend update DTO', () => {
  const order = paginatedOrdersResponseSchema.parse({
    data: {
      orders: [{
        id: 1,
        customerId: 3,
        orderName: 'Sample order',
        status: 'pending',
        notes: null,
        customer: { name: 'Luigi Santos' },
        items: [{
          quantity: 2,
          priceAtPurchase: '100.00',
          subtotal: '200.00',
          product: {
            id: 2,
            title: 'Sample Product',
            price: '100.00',
            profit: '20.00',
          },
        }],
        createdAt: '2026-07-17T07:02:16.915Z',
      }],
      hasNext: false,
    },
  }).data.orders[0]

  assert.deepEqual(toUpdateOrderStatusCommand(order, 'in_progress'), {
    orderItems: [{
      priceAtPurchase: '100',
      quantity: 2,
      subtotal: '200',
      product: {
        id: 2,
        title: 'Sample Product',
        price: 100,
      },
    }],
    status: 'in_progress',
  })
})

test('product image upload uses the backend multipart image field', async () => {
  let requestBody
  let requestConfig
  const productsApi = createProductsApi({
    post: async (_path, body, config) => {
      requestBody = body
      requestConfig = config
      return { data: {} }
    },
  })
  const image = new File(['image bytes'], 'sample.png', { type: 'image/png' })

  await productsApi.uploadImage(image)

  assert.ok(requestBody instanceof FormData)
  assert.equal(requestBody.get('image'), image)
  assert.equal(requestConfig, undefined)
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
