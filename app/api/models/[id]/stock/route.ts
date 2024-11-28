import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { type, quantity } = await request.json();

    const updateResult = await query(
      `UPDATE models 
       SET stock_quantity = stock_quantity ${type === "in" ? "+" : "-"} $1
       WHERE id = $2
       RETURNING stock_quantity`,
      [quantity, params.id]
    );

    if (updateResult.rowCount === 0) {
      throw new Error("型号不存在");
    }

    if (updateResult.rows[0].stock_quantity < 0) {
      throw new Error("库存不足");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("调整库存失败:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "调整库存失败" },
      { status: 500 }
    );
  }
} 