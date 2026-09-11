import type { AxiosInstance } from 'axios'
import type { CreateCustomerCommand, UpdateCustomerCommand } from './customers.types'

function normalizeOptionalContact(contact: string | null | undefined): string | null {
  const normalizedContact = contact?.trim()
  return normalizedContact ? normalizedContact : null
}

function toCustomerRequest(customer: CreateCustomerCommand): CreateCustomerCommand {
  return {
    ...customer,
    phone: normalizeOptionalContact(customer.phone),
    email: normalizeOptionalContact(customer.email),
  }
}

export function createCustomersApi(api: AxiosInstance) {
  return {
    async getAll(): Promise<object> {
      const response = await api.get<object>('/customers')
      return response.data
    },

    async create(customer: CreateCustomerCommand): Promise<void> {
      await api.post('/customers', toCustomerRequest(customer))
    },

    async update(customerId: number, customer: UpdateCustomerCommand): Promise<void> {
      await api.patch(`/customers/${customerId}`, toCustomerRequest(customer))
    },

    async delete(customerId: number): Promise<void> {
      await api.delete(`/customers/${customerId}`)
    },
  }
}
