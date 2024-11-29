"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataImportExport } from "@/components/data-import-export";
import { ChangePassword } from "@/components/admin/change-password";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    if (window.innerWidth < 1024) {
      redirect("/");
    }
  }, []);

  return (
    <div className="hidden lg:block p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <ChangePassword />
        <Card>
          <CardHeader>
            <CardTitle>数据管理</CardTitle>
            <CardDescription>
              导入或导出系统数据，支持 CSV 格式文件
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataImportExport />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 