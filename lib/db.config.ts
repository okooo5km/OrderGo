interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

export const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || '182.92.169.38',
  port: Number(process.env.DB_PORT) || 5435,
  database: process.env.DB_NAME || 'ordergo',
  username: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || 'testit',
}

// 构建数据库连接URL
export const getDatabaseUrl = () => {
  const { host, port, database, username, password } = dbConfig
  return `postgresql://${username}:${password}@${host}:${port}/${database}`
} 