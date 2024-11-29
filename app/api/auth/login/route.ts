import { NextResponse } from 'next/server';
import { userService } from '@/lib/services/users';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const isValid = await userService.verifyPassword(username, password);

    if (isValid) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: '密码错误' }, { status: 401 });
  } catch (_error) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
} 