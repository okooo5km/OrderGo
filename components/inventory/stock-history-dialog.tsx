"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { History } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import type { Model } from "@/types";

interface StockHistory {
  id: number;
  model_id: number;
  type: "in" | "out";
  quantity: number;
  reason: string;
  created_at: string;
}

interface StockHistoryDialogProps {
  model: Model;
}

export function StockHistoryDialog({ model }: StockHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/models/${model.id}/stock/history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("获取库存记录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      fetchHistory();
    }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <History className="h-4 w-4 mr-1" />
          变动记录
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>库存变动记录 - {model.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">加载中...</div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          record.type === "in"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {record.type === "in" ? "入库" : "出库"}
                      </span>
                      <span className="font-medium">{record.quantity}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {record.reason}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(record.created_at), "PPP HH:mm", {
                      locale: zhCN,
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              暂无变动记录
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 