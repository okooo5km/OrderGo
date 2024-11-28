import { NextResponse } from 'next/server'
import { orderService } from '@/lib/services/orders'

export async function GET() {
  try {
    const orders = await orderService.getAll()
    return NextResponse.json(orders)
  } catch (_error) {
    return NextResponse.json({ error: '获取订单列表失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const order = await orderService.create(data)
    return NextResponse.json(order)
  } catch (_error) {
    return NextResponse.json({ error: '创建订单失败' }, { status: 500 })
  }
} 