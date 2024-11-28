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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, MinusCircle } from "lucide-react";
import type { Model } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AdjustStockDialogProps {
  model: Model;
  onSuccess?: () => void;
}

export function AdjustStockDialog({ model, onSuccess }: AdjustStockDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"in" | "out">("in");
  const [quantity, setQuantity] = useState("1");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/models/${model.id}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          quantity: parseInt(quantity),
        }),
      });

      if (response.ok) {
        toast({
          title: "调整成功",
          description: `${type === "in" ? "入库" : "出库"}操作已完成`
        });
        setOpen(false);
        resetForm();
        onSuccess?.();
      }
    } catch (_error) {
      toast({
        title: "调整失败",
        description: "库存调整时出现错误",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setType("in");
    setQuantity("1");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          {type === "in" ? (
            <PlusCircle className="h-4 w-4 mr-1" />
          ) : (
            <MinusCircle className="h-4 w-4 mr-1" />
          )}
          调整库存
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>调整库存 - {model.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>调整类型</Label>
            <Select value={type} onValueChange={(value: "in" | "out") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择调整类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">入库</SelectItem>
                <SelectItem value="out">出库</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>数量</Label>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            确认
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 