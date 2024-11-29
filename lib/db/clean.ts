import { query } from './index'

async function cleanDatabase() {
  try {
    await query(`
      DROP TABLE IF EXISTS 
        inventory_records,
        order_items,
        orders,
        models,
        categories,
        users
      CASCADE;
    `)
    console.log('数据库清理成功')
  } catch (error) {
    console.error('数据库清理失败:', error)
    process.exit(1)
  }
}

// 执行清理
cleanDatabase() 