import { query } from '@/lib/db'
import type { Order } from '@/types'

export const orderService = {
  async getAll() {
    const result = await query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'model_id', oi.model_id,
            'quantity', oi.quantity,
            'model', json_build_object(
              'name', m.name,
              'model_number', m.model_number
            )
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN models m ON oi.model_id = m.id
      GROUP BY o.id
      ORDER BY o.order_date DESC
    `)
    return result.rows as Order[]
  },

  async create(data: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_date'>) {
    const result = await query(
      `INSERT INTO orders (
        order_number, 
        customer_address, 
        notes, 
        shipping_type
      ) VALUES ($1, $2, $3, $4) 
      RETURNING *`,
      [
        data.order_number,
        data.customer_address,
        data.notes,
        data.shipping_type
      ]
    )
    return result.rows[0] as Order
  },

  async getById(id: number) {
    const result = await query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    )
    return result.rows[0] as Order
  },

  async update(id: number, data: Partial<Order>) {
    const result = await query(
      `UPDATE orders 
       SET order_number = $1, 
           customer_address = $2, 
           notes = $3, 
           shipping_type = $4 
       WHERE id = $5 
       RETURNING *`,
      [
        data.order_number,
        data.customer_address,
        data.notes,
        data.shipping_type,
        id
      ]
    )
    return result.rows[0] as Order
  },

  async delete(id: number) {
    await query('DELETE FROM orders WHERE id = $1', [id])
    return true
  }
} 