import { NextResponse } from 'next/server'
import { withTransaction } from '@/lib/db'
import { orderService } from '@/lib/services/orders'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { items } = await request.json()
    
    await withTransaction(async (client) => {
      for (const item of items) {
        // 创建订单项
        await client.query(
          `INSERT INTO order_items (order_id, model_id, quantity) 
           VALUES ($1, $2, $3)`,
          [params.id, item.model_id, item.quantity]
        )

        // 如果是仓库出库，更新库存
        const order = await orderService.getById(Number(params.id))
        if (order.shipping_type === 'warehouse') {
          await client.query(
            `UPDATE models 
             SET stock_quantity = stock_quantity - $1 
             WHERE id = $2`,
            [item.quantity, item.model_id]
          )

          // 记录库存变动
          await client.query(
            `INSERT INTO inventory_records (model_id, quantity, operation_type, notes) 
             VALUES ($1, $2, 'out', $3)`,
            [item.model_id, item.quantity, `订单出库: ${order.order_number}`]
          )
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json({ error: '添加订单项失败' }, { status: 500 })
  }
} 