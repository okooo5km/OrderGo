"use client";

import { useState, useEffect } from "react";
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
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderItem {
  model_id: number;
  quantity: number;
}

interface Model {
  id: number;
  name: string;
  model_number: string;
}

interface CreateOrderButtonProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateOrderButton({ children, onSuccess }: CreateOrderButtonProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [open, setOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingType, setShippingType] = useState<"warehouse" | "direct">(
    "warehouse"
  );

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => setModels(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_address: customerAddress,
          notes,
          shipping_type: shippingType,
        }),
      });

      if (orderResponse.ok) {
        const order = await orderResponse.json();

        if (selectedItems.length > 0) {
          await fetch(`/api/orders/${order.id}/items`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: selectedItems }),
          });
        }

        const info = `订单编号: ${order.order_number}
收货地址: ${order.customer_address}
下单日期: ${new Date(order.order_date).toLocaleDateString()}
${order.notes ? `备注: ${order.notes}` : ""}`;

        navigator.clipboard.writeText(info);

        setOpen(false);
        resetForm();
        onSuccess?.();
      }
    } catch (error) {
      console.error("创建订单失败:", error);
    }
  };

  const resetForm = () => {
    setOrderNumber("");
    setCustomerAddress("");
    setNotes("");
    setShippingType("warehouse");
    setSelectedItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            新增订单
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新增订单</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">订单编号</Label>
            <Input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerAddress">收货地址</Label>
            <Input
              id="customerAddress"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingType">发货方式</Label>
            <Select
              value={shippingType}
              onValueChange={(value: "warehouse" | "direct") =>
                setShippingType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择发货方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse">仓库出库</SelectItem>
                <SelectItem value="direct">直发</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">备注</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>选择型号</Label>
            <div className="space-y-2">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={item.model_id.toString()}
                    onValueChange={(value) => {
                      const newItems = [...selectedItems];
                      newItems[index].model_id = Number(value);
                      setSelectedItems(newItems);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {models.find((m) => m.id === item.model_id)?.name ||
                          "选择型号"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.name} ({model.model_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...selectedItems];
                      newItems[index].quantity = Number(e.target.value);
                      setSelectedItems(newItems);
                    }}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedItems((items) =>
                        items.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    删除
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedItems((items) => [
                    ...items,
                    { model_id: 0, quantity: 1 },
                  ]);
                }}
              >
                添加型号
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            确认
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
