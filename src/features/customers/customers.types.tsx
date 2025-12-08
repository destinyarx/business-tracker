export type CustomerType = "normal" | "loyal" | "deluxe" | "premium" | "VIP";

export interface Customer {
  id?: number
  name: string
  status?: number
  customerType: 'normal' | 'loyal' | 'deluxe' | 'premium' | 'VIP'
  phone?: string
  email?: string
  notes?: string
}