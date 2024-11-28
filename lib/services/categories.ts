import { query } from '@/lib/db'
import type { Category } from '@/types'

export const categoryService = {
  async getAll() {
    const result = await query('SELECT * FROM categories ORDER BY name')
    return result.rows as Category[]
  },

  async create(data: Pick<Category, 'name' | 'description'>) {
    const result = await query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [data.name, data.description]
    )
    return result.rows[0] as Category
  },

  async update(id: number, data: Partial<Category>) {
    const result = await query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [data.name, data.description, id]
    )
    return result.rows[0] as Category
  },

  async delete(id: number) {
    await query('DELETE FROM categories WHERE id = $1', [id])
    return true
  }
} 