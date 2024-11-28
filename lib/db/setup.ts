import { query } from './index'
import { readFileSync } from 'fs'
import { join } from 'path'

async function setupDatabase() {
  try {
    // 读取 SQL 文件
    const sqlFile = readFileSync(join(process.cwd(), 'lib/db/init.sql'), 'utf8')
    
    // 执行 SQL 语句
    await query(sqlFile)
    
    // 创建库存历史表
    await query(`
      CREATE TABLE IF NOT EXISTS stock_history (
        id SERIAL PRIMARY KEY,
        model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL CHECK (type IN ('in', 'out')),
        quantity INTEGER NOT NULL,
        reason TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT positive_quantity CHECK (quantity > 0)
      );
    `);
    
    // 插入一些测试数据
    await insertTestData()
    
    console.log('数据库初始化成功')
  } catch (error) {
    console.error('数据库初始化失败:', error)
    process.exit(1)
  }
}

async function insertTestData() {
  // 插入测试类别
  await query(`
    INSERT INTO categories (name, description) 
    VALUES 
      ('电视', '各类型号电视机'),
      ('冰箱', '各类型号冰箱'),
      ('洗衣机', '各类型号洗衣机')
    ON CONFLICT (name) DO NOTHING;
  `)

  // 插入测试型号
  await query(`
    INSERT INTO models (category_id, model_number, name, specifications, stock_quantity) 
    VALUES 
      (1, 'TV-2024-01', '智能电视 55寸', '4K超高清，智能语音', 10),
      (1, 'TV-2024-02', '智能电视 65寸', '8K超高清，全面屏', 5),
      (2, 'FR-2024-01', '双门冰箱', '风冷无霜，容量300L', 8),
      (3, 'WM-2024-01', '滚筒洗衣机', '变频节能，容量8KG', 12)
    ON CONFLICT (model_number) DO NOTHING;
  `)
}

// 执行初始化
setupDatabase() 
