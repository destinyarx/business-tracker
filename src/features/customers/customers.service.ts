'use client'

import { useMemo } from 'react'
import { createCustomersApi } from './customers.api'
import { customersResponseSchema } from './customers.schema'
import type { CreateCustomerCommand, Customer, UpdateCustomerCommand } from './customers.types'
import { useApi } from '@/hooks/useApi'
import { ensureFeatureError } from '@/lib/feature-error'

export function useCustomerService() {
  const api = useApi()
  const customersApi = useMemo(() => createCustomersApi(api), [api])

  return {
    async getAll(): Promise<Customer[]> {
      try {
        const response = await customersApi.getAll()
        return customersResponseSchema.parse(response).data
      } catch (error) {
        throw ensureFeatureError('customer', error instanceof Error ? error : null)
      }
    },

    async create(customer: CreateCustomerCommand): Promise<void> {
      try {
        await customersApi.create(customer)
      } catch (error) {
        throw ensureFeatureError('customer', error instanceof Error ? error : null)
      }
    },

    async update(customerId: number, customer: UpdateCustomerCommand): Promise<void> {
      try {
        await customersApi.update(customerId, customer)
      } catch (error) {
        throw ensureFeatureError('customer', error instanceof Error ? error : null)
      }
    },

    async delete(customerId: number): Promise<void> {
      try {
        await customersApi.delete(customerId)
      } catch (error) {
        throw ensureFeatureError('customer', error instanceof Error ? error : null)
      }
    },
  }
}
