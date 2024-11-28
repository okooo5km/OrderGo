import { Pool, QueryResult, PoolClient } from 'pg'
import { getDatabaseUrl } from '../db.config'

// 创建数据库连接池
const pool = new Pool({
  connectionString: getDatabaseUrl(),
})

interface QueryConfig {
  text: string;
  values?: unknown[];
}

// 基础查询函数
export async function query(
  text: string | QueryConfig,
  values?: unknown[]
): Promise<QueryResult> {
  const start = Date.now()
  try {
    const res = await pool.query(text, values)
    const duration = Date.now() - start
    console.log('执行查询', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('查询错误', error)
    throw error
  }
}

// 事务处理函数
export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
} 