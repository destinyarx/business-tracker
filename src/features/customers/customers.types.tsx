export type CustomerType = 'normal' | 'loyal' | 'deluxe' | 'premium' | 'VIP'

export interface Customer {
  id?: number
  name: string
  status?: string
  customerType: CustomerType
  phone?: string
  email?: string
  notes?: string
  createdAt?: Date
}

export type CreateCustomerCommand = Omit<Customer, 'id' | 'createdAt' | 'phone' | 'email'> & {
  phone?: string | null
  email?: string | null
}
export type UpdateCustomerCommand = CreateCustomerCommand
