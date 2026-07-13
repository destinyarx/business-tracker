import type { AxiosInstance } from 'axios'
import type { CreateCustomerCommand, UpdateCustomerCommand } from './customers.types'

export function createCustomersApi(api: AxiosInstance) {
  return {
    async getAll(): Promise<object> {
      const response = await api.get<object>('/customers')
      return response.data
    },

    async create(customer: CreateCustomerCommand): Promise<void> {
      await api.post('/customers', customer)
    },

    async update(customerId: number, customer: UpdateCustomerCommand): Promise<void> {
      await api.patch(`/customers/${customerId}`, customer)
    },

    async delete(customerId: number): Promise<void> {
      await api.delete(`/customers/${customerId}`)
    },
  }
}
