import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT * FROM orders WHERE id = $1`,
      [params.id]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: '订单不存在' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (_error) {
    return NextResponse.json({ error: '获取订单失败' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { order_number, customer_address, notes, shipping_type } = await request.json()
    
    const result = await query(
      `UPDATE orders 
       SET order_number = $1, 
           customer_address = $2, 
           notes = $3, 
           shipping_type = $4 
       WHERE id = $5 
       RETURNING *`,
      [order_number, customer_address, notes, shipping_type, params.id]
    )

    return NextResponse.json(result.rows[0])
  } catch (_error) {
    return NextResponse.json({ error: '更新订单失败' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM orders WHERE id = $1', [params.id])
    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json({ error: '删除订单失败' }, { status: 500 })
  }
} 