import { query } from '@/lib/db'
import type { Model } from '@/types'

export const modelService = {
  async getAll() {
    const result = await query(`
      SELECT m.*, c.name as category_name 
      FROM models m 
      JOIN categories c ON m.category_id = c.id 
      ORDER BY m.model_number
    `)
    return result.rows as (Model & { category_name: string })[]
  },

  async create(data: Omit<Model, 'id' | 'created_at' | 'updated_at'>) {
    const result = await query(
      'INSERT INTO models (category_id, model_number, name, specifications, stock_quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.category_id, data.model_number, data.name, data.specifications, data.stock_quantity]
    )
    return result.rows[0] as Model
  },
  
  async update(id: number, data: Partial<Model>) {
    const result = await query(
      `UPDATE models 
       SET model_number = $1, name = $2, specifications = $3, stock_quantity = $4 
       WHERE id = $5 RETURNING *`,
      [data.model_number, data.name, data.specifications, data.stock_quantity, id]
    )
    return result.rows[0] as Model
  },

  async delete(id: number) {
    await query('DELETE FROM models WHERE id = $1', [id])
    return true
  }
} 