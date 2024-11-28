import { InventoryList } from "@/components/inventory/inventory-list";

export default function InventoryPage() {
  return (
    <div className="space-y-4">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold">库存管理</h1>
      </div>
      <InventoryList />
    </div>
  );
} 