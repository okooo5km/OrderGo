import { NextResponse } from 'next/server'
import { modelService } from '@/lib/services/models'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const model = await modelService.update(Number(params.id), data)
    return NextResponse.json(model)
  } catch (_error) {
    return NextResponse.json({ error: '获取型号失败' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await modelService.delete(Number(params.id))
    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json({ error: '删除型号失败' }, { status: 500 })
  }
} 