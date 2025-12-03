export type CustomerType = "normal" | "loyal" | "deluxe" | "premium" | "VIP";

export interface Customer {
  id?: number
  name: string
  contact_number: string
  email: string
  status: number
  customerType: CustomerType
  notes?: string
}