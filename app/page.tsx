import { OrderList } from "@/components/orders/order-list";

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold">订单管理</h1>
      </div>
      <OrderList />
    </div>
  );
}
