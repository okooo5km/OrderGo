import { NextResponse } from 'next/server'
import { categoryService } from '@/lib/services/categories'

export async function GET() {
  try {
    const categories = await categoryService.getAll()
    return NextResponse.json(categories)
  } catch (_error) {
    return NextResponse.json({ error: '获取类别失败' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const category = await categoryService.create(data)
    return NextResponse.json(category)
  } catch (_error) {
    return NextResponse.json({ error: '创建类别失败' }, { status: 500 })
  }
} 