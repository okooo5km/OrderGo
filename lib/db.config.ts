// 构建数据库连接URL
export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      'DATABASE_URL is not defined in environment variables.\n' +
      'Please create a .env file based on .env.example and set your database URL.'
    );
  }

  return url;
}
