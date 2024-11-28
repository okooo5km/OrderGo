"use client";

import React from "react";
import { useState, useEffect } from "react";
import type { Category, Model } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { CreateModelButton } from "./create-model-button";
import { Card, CardContent } from "@/components/ui/card";
import { EditCategoryDialog } from "./edit-category-dialog";
import { EditModelDialog } from "./edit-model-dialog";
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCategoryButton } from "./create-category-button";
import { useToast } from "@/hooks/use-toast";

interface CategoryWithModels extends Category {
  models?: Model[];
}

export function CategoryList() {
  const [categories, setCategories] = useState<CategoryWithModels[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const matchedCategoryIds = categories
        .filter((category) =>
          category.models?.some(
            (model) =>
              model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              model.model_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              model.specifications
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          )
        )
        .map((category) => category.id);

      setExpandedCategories(matchedCategoryIds);
    } else {
      setExpandedCategories([]);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();

      // 取所有型号
      const modelsRes = await fetch("/api/models");
      const modelsData = await modelsRes.json();

      // 将型号数据关联到对应的类别
      const categoriesWithModels = categoriesData.map((category: Category) => ({
        ...category,
        models: modelsData.filter(
          (model: Model) => model.category_id === category.id
        ),
      }));

      setCategories(categoriesWithModels);
      setLoading(false);
    } catch (error) {
      console.error("获取数据失败:", error);
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "删除成功",
          description: "类别及其所有型号已被删除"
        });
        fetchCategories();
      }
    } catch (_error) {
      toast({
        title: "删除失败",
        description: "删除类别时出现错误",
        variant: "destructive"
      });
    }
  };

  const handleDeleteModel = async (id: number) => {
    try {
      const response = await fetch(`/api/models/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "删除成功",
          description: "型号已被删除"
        });
        fetchCategories();
      }
    } catch (_error) {
      toast({
        title: "删除失败",
        description: "删除型号时出现错误",
        variant: "destructive"
      });
    }
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      models: category.models?.filter(
        (model) =>
          model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.model_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.specifications?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        !searchTerm || (category.models && category.models.length > 0)
    );

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
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索型号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="hidden md:block">
            <CreateCategoryButton onSuccess={fetchCategories} />
          </div>
        </div>
      </div>

      <div className="hidden md:block px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>类别名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>型号数量</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <React.Fragment key={category.id}>
                <TableRow>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.models?.length || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditCategoryDialog
                      category={category}
                      onSuccess={fetchCategories}
                    />
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
                            此操作将删除该类别及其所有型号，且无法恢复。是否继续？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                          >
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <CreateModelButton
                      categoryId={category.id}
                      onSuccess={fetchCategories}
                    />
                  </TableCell>
                </TableRow>
                {expandedCategories.includes(category.id) &&
                  category.models?.map((model) => (
                    <TableRow key={model.id} className="bg-muted/50">
                      <TableCell></TableCell>
                      <TableCell colSpan={2}>
                        <div className="ml-4">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-muted-foreground">
                            型号: {model.model_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>库存: {model.stock_quantity}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <EditModelDialog
                          model={model}
                          onSuccess={fetchCategories}
                        />
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
                                此操作将删除该型号，且无法恢复。是否继续？
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteModel(model.id)}>
                                确认删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="block md:hidden">
        <div className="space-y-6 px-4 pb-4">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4 space-y-4">
                {/* 类别标题栏 */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <EditCategoryDialog
                      category={category}
                      onSuccess={fetchCategories}
                    />
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
                            此操作将删除该类别及其所有型号，且无法恢复。是否继续？
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(category.id)}>
                            确认删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* 型号列表标题和展开按钮 */}
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">型号列表</div>
                  <div className="flex gap-2">
                    <CreateModelButton
                      categoryId={category.id}
                      onSuccess={fetchCategories}
                    >
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        添加型号
                      </Button>
                    </CreateModelButton>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* 型号列表 */}
                {expandedCategories.includes(category.id) && (
                  <div className="space-y-2 pt-2 border-t">
                    {category.models?.map((model) => (
                      <div
                        key={model.id}
                        className="flex justify-between items-start p-2 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{model.name}</p>
                          <p className="text-sm text-muted-foreground">
                            型号: {model.model_number}
                          </p>
                          <p className="text-sm">
                            库存: {model.stock_quantity}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <EditModelDialog
                            model={model}
                            onSuccess={fetchCategories}
                          />
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
                                  此操作将删除该型号，且无法恢复。是否继续？
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteModel(model.id)}>
                                  确认删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 移动端浮动添加按钮 */}
        <div className="fixed right-4 bottom-20 md:hidden">
          <CreateCategoryButton onSuccess={fetchCategories}>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </CreateCategoryButton>
        </div>
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          没有找到匹配的型号
        </div>
      )}
    </>
  );
}
