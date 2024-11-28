import { NextResponse } from 'next/server'
import { categoryService } from '@/lib/services/categories'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const category = await categoryService.update(Number(params.id), data)
    return NextResponse.json(category)
  } catch (error: unknown) {
    console.error("操作失败:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "操作失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await categoryService.delete(Number(params.id))
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("操作失败:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "操作失败" },
      { status: 500 }
    );
  }
} 