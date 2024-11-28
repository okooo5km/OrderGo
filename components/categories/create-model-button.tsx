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
import { Plus } from "lucide-react"

interface CreateModelButtonProps {
  categoryId: number
  onSuccess?: () => void
  children?: React.ReactNode
}

export function CreateModelButton({ categoryId, onSuccess, children }: CreateModelButtonProps) {
  const [open, setOpen] = useState(false)
  const [modelNumber, setModelNumber] = useState("")
  const [name, setName] = useState("")
  const [specifications, setSpecifications] = useState("")
  const [stockQuantity, setStockQuantity] = useState("0")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: categoryId,
          model_number: modelNumber,
          name,
          specifications,
          stock_quantity: parseInt(stockQuantity)
        }),
      })
      
      if (response.ok) {
        setOpen(false)
        resetForm()
        onSuccess?.()
      } else {
        console.error("创建型号失败")
      }
    } catch (error) {
      console.error("创建型号失败:", error)
    }
  }

  const resetForm = () => {
    setModelNumber("")
    setName("")
    setSpecifications("")
    setStockQuantity("0")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            添加型号
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增型号</DialogTitle>
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
            <Label htmlFor="stockQuantity">初始库存</Label>
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
            确认
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 