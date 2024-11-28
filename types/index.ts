export interface Category {
  id: number
  name: string
  description?: string
  created_at: Date
  updated_at: Date
}

export interface Model {
  id: number
  category_id: number
  model_number: string
  name: string
  specifications?: string
  stock_quantity: number
  created_at: Date
  updated_at: Date
}

export interface Order {
  id: number
  order_number: string
  customer_address: string
  order_date: Date
  notes?: string
  shipping_type: 'warehouse' | 'direct'
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: number
  order_id: number
  model_id: number
  quantity: number
  created_at: Date
  updated_at: Date
}

export interface InventoryRecord {
  id: number
  model_id: number
  quantity: number
  operation_type: 'in' | 'out'
  notes?: string
  created_at: Date
} 