import { NextResponse } from 'next/server'
import { modelService } from '@/lib/services/models'

export async function GET() {
  try {
    const models = await modelService.getAll()
    return NextResponse.json(models)
  } catch (_error) {
    return NextResponse.json({ error: '获取型号列表失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const model = await modelService.create(data)
    return NextResponse.json(model)
  } catch (_error) {
    return NextResponse.json({ error: '创建型号失败' }, { status: 500 })
  }
} 