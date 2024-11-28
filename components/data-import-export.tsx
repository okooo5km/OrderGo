"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DataImportExport() {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);

  // 下载模板
  const downloadTemplate = () => {
    const template = `type,id,category_id,name,description,model_number,specifications,stock_quantity,order_number,customer_address,order_date,shipping_type,notes,quantity
category,1,,电视,各类型号电视机,,,,,,,,
category,2,,冰箱,各类型号冰箱,,,,,,,,
model,1,1,智能电视 55寸,,TV-2024-01,4K超高清，智能语音,10,,,,,
model,2,1,智能电视 65寸,,TV-2024-02,8K超高清，全面屏,5,,,,,
order,1,,,,,,,ORD-2024-001,北京市朝阳区xxx,2024-03-14,warehouse,测试订单,
order_item,1,,,,,,,ORD-2024-001,,,,2,1`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // 导出数据
  const exportData = async () => {
    try {
      // 获取所有数据
      const [categories, models, orders] = await Promise.all([
        fetch("/api/categories").then(res => res.json()),
        fetch("/api/models").then(res => res.json()),
        fetch("/api/orders?include=items").then(res => res.json())
      ]);

      // 构建 CSV 内容
      let csv = "type,id,category_id,name,description,model_number,specifications,stock_quantity,order_number,customer_address,order_date,shipping_type,notes,quantity\n";

      // 添加类别数据
      categories.forEach((cat: any) => {
        csv += `category,${cat.id},,${cat.name},${cat.description || ""},,,,,,,,\n`;
      });

      // 添加型号数据
      models.forEach((model: any) => {
        csv += `model,${model.id},${model.category_id},${model.name},,${model.model_number},${model.specifications || ""},${model.stock_quantity},,,,,\n`;
      });

      // 添加订单和订单项数据
      orders.forEach((order: any) => {
        csv += `order,${order.id},,,,,,,"${order.order_number}","${order.customer_address}",${order.order_date},${order.shipping_type},${order.notes || ""},\n`;
        order.items?.forEach((item: any) => {
          csv += `order_item,${item.id},,,,,,,${order.order_number},,,,${item.model_id},${item.quantity}\n`;
        });
      });

      // 下载文件
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "导出成功",
        description: "数据已成功导出为 CSV 文件"
      });
    } catch (error) {
      toast({
        title: "导出失败",
        description: "导出数据时出现错误",
        variant: "destructive"
      });
    }
  };

  // 导入数据
  const importData = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const rows = text.split("\n").map(row => row.split(","));
      const header = rows[0];
      const data = rows.slice(1);

      // 按类型分组数据
      const categories: any[] = [];
      const models: any[] = [];
      const orders: any[] = [];
      const orderItems: any[] = [];

      data.forEach(row => {
        const item: any = {};
        row.forEach((value, index) => {
          item[header[index]] = value;
        });

        switch (item.type) {
          case "category":
            categories.push(item);
            break;
          case "model":
            models.push(item);
            break;
          case "order":
            orders.push(item);
            break;
          case "order_item":
            orderItems.push(item);
            break;
        }
      });

      // 按顺序导入数据
      await Promise.all([
        // 导入类别
        ...categories.map(cat => 
          fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: cat.name,
              description: cat.description
            })
          })
        ),
        // 导入型号
        ...models.map(model =>
          fetch("/api/models", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category_id: model.category_id,
              name: model.name,
              model_number: model.model_number,
              specifications: model.specifications,
              stock_quantity: parseInt(model.stock_quantity)
            })
          })
        ),
        // 导入订单
        ...orders.map(async order => {
          const orderRes = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_number: order.order_number,
              customer_address: order.customer_address,
              order_date: order.order_date,
              shipping_type: order.shipping_type,
              notes: order.notes
            })
          });
          
          if (orderRes.ok) {
            const { id } = await orderRes.json();
            const items = orderItems
              .filter(item => item.order_number === order.order_number)
              .map(item => ({
                model_id: parseInt(item.model_id),
                quantity: parseInt(item.quantity)
              }));

            if (items.length > 0) {
              await fetch(`/api/orders/${id}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items })
              });
            }
          }
        })
      ]);

      toast({
        title: "导入成功",
        description: "数据已成功导入系统"
      });
    } catch (error) {
      toast({
        title: "导入失败",
        description: "导入数据时出现错误",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) importData(file);
          }}
          disabled={importing}
          className="text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={downloadTemplate}
        >
          <Download className="h-4 w-4 mr-2" />
          下载模板
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={exportData}
        >
          <Upload className="h-4 w-4 mr-2" />
          导出数据
        </Button>
      </div>
    </div>
  );
} 