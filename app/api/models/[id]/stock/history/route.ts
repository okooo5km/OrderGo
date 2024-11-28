import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await query(
      `SELECT * FROM stock_history 
       WHERE model_id = $1 
       ORDER BY created_at DESC`,
      [params.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("获取库存记录失败:", error);
    return NextResponse.json(
      { error: "获取库存记录失败" },
      { status: 500 }
    );
  }
} 