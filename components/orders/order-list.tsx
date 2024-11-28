"use client";

import React, { useState, useEffect } from "react";
import type { Order } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Copy,
  ChevronDown,
  ChevronRight,
  Plus,
  CalendarDays,
  MapPin,
  Package,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EditOrderDialog } from "./edit-order-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { CreateOrderButton } from "./create-order-button";
import { useToast } from "@/hooks/use-toast";

interface OrderWithItems extends Order {
  items?: {
    id: number;
    model_id: number;
    quantity: number;
    model: {
      name: string;
      model_number: string;
    };
  }[];
}

interface OrderListProps {
  onInit?: (fetchOrders: () => Promise<void>) => void;
}

export function OrderList({ onInit }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
  const [shippingTypeFilter, setShippingTypeFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    onInit?.(fetchOrders);
    fetchOrders();
  }, [onInit]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders?include=items");
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("获取订单失败:", error);
      setLoading(false);
    }
  };

  const copyOrderInfo = (order: Order) => {
    const info = `订单编号: ${order.order_number}
收货地址: ${order.customer_address}
下单日期: ${format(new Date(order.order_date), "PPP", { locale: zhCN })}
发货方式: ${order.shipping_type === "warehouse" ? "仓库出库" : "直发"}
${order.notes ? `备注: ${order.notes}` : ""}`;

    navigator.clipboard.writeText(info);
    toast({
      title: "复制成功",
      description: "订单信息已复制到剪贴板"
    });
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "删除成功",
          description: "订单已被删除"
        });
        fetchOrders();
      }
    } catch (_error) {
      toast({
        title: "删除失败",
        description: "删除订单时出现错误",
        variant: "destructive"
      });
    }
  };

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
      <div className="px-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={shippingTypeFilter}
              onValueChange={setShippingTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="发货方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="warehouse">仓库出库</SelectItem>
                <SelectItem value="direct">直发</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden md:block">
            <CreateOrderButton onSuccess={fetchOrders} />
          </div>
        </div>
      </div>

      <div className="hidden md:block px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>订单编号</TableHead>
              <TableHead>收货地址</TableHead>
              <TableHead>下单日期</TableHead>
              <TableHead>发货方式</TableHead>
              <TableHead>型号</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order: OrderWithItems) => (
              <React.Fragment key={order.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrder(order.id)}
                    >
                      {expandedOrders.includes(order.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{order.order_number}</TableCell>
                  <TableCell>{order.customer_address}</TableCell>
                  <TableCell>
                    {format(new Date(order.order_date), "PPP", {
                      locale: zhCN,
                    })}
                  </TableCell>
                  <TableCell>
                    {order.shipping_type === "warehouse" ? "仓库出库" : "直发"}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items?.map((item) => (
                        <div key={item.id} className="text-sm">
                          {item.model.name} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyOrderInfo(order)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      复制
                    </Button>
                    <EditOrderDialog order={order} onSuccess={fetchOrders} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作将删除该订单及其所有信息，且无法恢复。是否继续？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(order.id)}
                          >
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
                {expandedOrders.includes(order.id) && (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell colSpan={6}>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">备注信息</h4>
                        <div className="text-sm text-muted-foreground">
                          {order.notes || "无备注"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            没有找到匹配的订单
          </div>
        )}
      </div>

      <div className="block md:hidden">
        <div className="space-y-4 px-4 pb-4">
          {filteredOrders.map((order: OrderWithItems) => (
            <Card key={order.id}>
              <CardContent 
                className="p-4"
                onDoubleClick={() => copyOrderInfo(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{order.order_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">
                        {format(new Date(order.order_date), "PPP", {
                          locale: zhCN,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{order.customer_address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">
                        {order.shipping_type === "warehouse"
                          ? "仓库出库"
                          : "直发"}
                      </span>
                    </div>
                    {order.notes && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm">{order.notes}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyOrderInfo(order)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <EditOrderDialog order={order} onSuccess={fetchOrders} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除</AlertDialogTitle>
                          <AlertDialogDescription>
                            此操作将删除该订单及其所有信息，且无法恢复。是否继续？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(order.id)}
                          >
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                    >
                      <div>
                        <div className="font-medium">{item.model.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.model.model_number}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        × {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="fixed right-4 bottom-20 md:hidden">
          <CreateOrderButton>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </CreateOrderButton>
        </div>
      </div>
    </>
  );
}
