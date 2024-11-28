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
import type { Model } from "@/types"

interface EditModelDialogProps {
  model: Model
  onSuccess?: () => void
}

export function EditModelDialog({ model, onSuccess }: EditModelDialogProps) {
  const [open, setOpen] = useState(false)
  const [modelNumber, setModelNumber] = useState(model.model_number)
  const [name, setName] = useState(model.name)
  const [specifications, setSpecifications] = useState(model.specifications || "")
  const [stockQuantity, setStockQuantity] = useState(model.stock_quantity.toString())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/models/${model.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_number: modelNumber,
          name,
          specifications,
          stock_quantity: parseInt(stockQuantity)
        }),
      })
      
      if (response.ok) {
        setOpen(false)
        onSuccess?.()
      } else {
        console.error("更新型号失败")
      }
    } catch (error) {
      console.error("更新型号失败:", error)
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
          <DialogTitle>编辑型号</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modelNumber">型号编码</Label>
            <Input
              id="modelNumber"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">型号名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specifications">规格说明</Label>
            <Input
              id="specifications"
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockQuantity">库存数量</Label>
            <Input
              id="stockQuantity"
              type="number"
              min="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
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