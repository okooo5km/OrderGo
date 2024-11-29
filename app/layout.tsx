"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainSidebar } from "@/components/main-sidebar";
import { MobileTabs } from "@/components/mobile-tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthCheck } from "@/components/auth/auth-check";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthCheck>
            <div className="flex min-h-screen">
              {/* 桌面端侧边栏 */}
              <aside className="w-64 border-r min-h-screen hidden lg:block">
                <MainSidebar />
              </aside>

              {/* 主内容区 */}
              <div className="flex-1 flex flex-col">
                {/* 移动端顶部标题栏 */}
                <header className="border-b p-4 flex items-center justify-between lg:hidden">
                  <h1 className="text-xl font-semibold">仓库管理系统</h1>
                  <ThemeToggle variant="ghost" size="icon" />
                </header>

                {/* 内容区域 */}
                <main className="flex-1 pb-16 md:pb-0">{children}</main>

                {/* 移动端底部导航 */}
                <MobileTabs />
              </div>
            </div>
          </AuthCheck>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
