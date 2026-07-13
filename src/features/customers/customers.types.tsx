export type CustomerType = 'normal' | 'loyal' | 'deluxe' | 'premium' | 'VIP'

export interface Customer {
  id?: number
  name: string
  status?: number
  customerType: CustomerType
  phone?: string
  email?: string
  notes?: string
  createdAt?: Date
}

export type CreateCustomerCommand = Omit<Customer, 'id' | 'createdAt'>
export type UpdateCustomerCommand = CreateCustomerCommand
