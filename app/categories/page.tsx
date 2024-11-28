import { CategoryList } from "@/components/categories/category-list";

export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold">家电类别管理</h1>
      </div>
      <CategoryList />
    </div>
  );
}
