import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const userService = {
  async initialize() {
    // 检查是否已有管理员用户
    const result = await query('SELECT * FROM users WHERE username = $1', [
      process.env.NEXT_PUBLIC_AUTH_USERNAME
    ]);

    if (result.rows.length === 0) {
      // 创建初始管理员用户
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(process.env.NEXT_PUBLIC_AUTH_PASSWORD || '', salt);
      
      await query(
        'INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, true)',
        [process.env.NEXT_PUBLIC_AUTH_USERNAME, hash]
      );
    }
  },

  async verifyPassword(username: string, password: string) {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return false;

    const user = result.rows[0];
    return bcrypt.compare(password, user.password_hash);
  },

  async updatePassword(username: string, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2',
      [hash, username]
    );
  }
}; 