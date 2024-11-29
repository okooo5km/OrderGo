import { NextResponse } from 'next/server';
import { userService } from '@/lib/services/users';

export async function POST(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    // 先验证当前密码是否正确
    const isValid = await userService.verifyPassword(username, currentPassword);
    if (!isValid) {
      return NextResponse.json({ error: '当前密码错误' }, { status: 401 });
    }

    // 更新密码
    await userService.updatePassword(username, newPassword);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '修改密码失败' }, { status: 500 });
  }
} 