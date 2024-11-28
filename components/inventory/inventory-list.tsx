"use client";

import React, { useState, useEffect } from "react";
import type { Model } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Package, Hash, BoxIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdjustStockDialog } from "./adjust-stock-dialog";

interface ModelWithCategory extends Model {
  category: {
    id: number;
    name: string;
  };
}

export function InventoryList() {
  const [models, setModels] = useState<ModelWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch("/api/models?include=category");
      const data = await res.json();
      setModels(data);
      setLoading(false);
    } catch (error) {
      console.error("获取库存数据失败:", error);
      setLoading(false);
    }
  };

  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.model_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  if (loading) {
    return (
      <div className="space-y-4 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* 工具栏 */}
      <div className="px-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="搜索型号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {/* 库存调整按钮 */}
        </div>
      </div>

      {/* 桌面端表格视图 */}
      <div className="hidden md:block px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>型号名称</TableHead>
              <TableHead>型号编码</TableHead>
              <TableHead>所属类别</TableHead>
              <TableHead>当前库存</TableHead>
              <TableHead>规格参数</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.model_number}</TableCell>
                <TableCell>{model.category?.name}</TableCell>
                <TableCell>{model.stock_quantity}</TableCell>
                <TableCell>{model.specifications}</TableCell>
                <TableCell className="text-right">
                  <AdjustStockDialog model={model} onSuccess={fetchModels} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 移动端卡片视图 */}
      <div className="block md:hidden">
        <div className="space-y-4 px-4 pb-4">
          {filteredModels.map((model) => (
            <Card key={model.id}>
              <CardContent className="p-4">
                <div className="relative">
                  {/* 型号信息 */}
                  <div className="space-y-3 pr-16">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{model.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {model.model_number}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BoxIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {model.category?.name}
                      </span>
                    </div>
                  </div>

                  {/* 库存数量和调整按钮 */}
                  <div className="absolute right-0 bottom-0 flex flex-col items-end gap-2">
                    <AdjustStockDialog model={model} onSuccess={fetchModels} />
                    <div className="text-4xl font-bold tabular-nums">
                      {model.stock_quantity}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
} 