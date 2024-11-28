"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import type { Order } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditOrderDialogProps {
  order: Order
  onSuccess?: () => void
}

export function EditOrderDialog({ order, onSuccess }: EditOrderDialogProps) {
  const [open, setOpen] = useState(false)
  const [orderNumber, setOrderNumber] = useState(order.order_number)
  const [customerAddress, setCustomerAddress] = useState(order.customer_address)
  const [notes, setNotes] = useState(order.notes || "")
  const [shippingType, setShippingType] = useState<"warehouse" | "direct">(
    order.shipping_type
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_number: orderNumber,
          customer_address: customerAddress,
          notes,
          shipping_type: shippingType,
        }),
      })
      
      if (response.ok) {
        setOpen(false)
        onSuccess?.()
      } else {
        console.error("更新订单失败")
      }
    } catch (error) {
      console.error("更新订单失败:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4 mr-1" />
          编辑
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑订单</DialogTitle>
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
          <Button type="submit" className="w-full">
            保存
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 