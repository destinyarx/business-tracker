import assert from 'node:assert/strict'
import test from 'node:test'
import { toUpdateOrderStatusCommand } from '../src/features/orders/order.mapper.ts'
import { getAllowedOrderStatusTargets } from '../src/features/orders/order.utils.ts'

test('order status payload contains only status and an optional trimmed reversal reason', () => {
  assert.deepEqual(toUpdateOrderStatusCommand('completed'), {
    status: 'completed',
  })
  assert.deepEqual(toUpdateOrderStatusCommand('cancelled', '  Customer requested refund  '), {
    status: 'cancelled',
    reversalReason: 'Customer requested refund',
  })
})

test('order status choices match the backend transition rules', () => {
  assert.deepEqual(getAllowedOrderStatusTargets('pending'), ['in_progress', 'cancelled', 'failed'])
  assert.deepEqual(getAllowedOrderStatusTargets('in_progress'), ['completed', 'cancelled', 'failed'])
  assert.deepEqual(getAllowedOrderStatusTargets('completed'), ['in_progress', 'cancelled', 'failed'])
  assert.deepEqual(getAllowedOrderStatusTargets('cancelled'), ['in_progress'])
  assert.deepEqual(getAllowedOrderStatusTargets('failed'), ['in_progress'])
})
