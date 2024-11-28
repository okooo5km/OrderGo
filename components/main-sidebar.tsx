"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, Boxes, PackageSearch, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarNavItems = [
  {
    title: "订单管理",
    href: "/",
    icon: ClipboardList,
  },
  {
    title: "家电类别管理",
    href: "/categories",
    icon: Boxes,
  },
  {
    title: "库存管理",
    href: "/inventory",
    icon: PackageSearch,
  },
  {
    title: "系统管理",
    href: "/admin",
    icon: Settings,
    className: "lg:block hidden",
  },
];

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: typeof sidebarNavItems;
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center justify-start gap-3 hover:bg-accent hover:text-accent-foreground px-3 py-2 text-base font-medium rounded-lg",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export function MainSidebar() {
  return (
    <div className="hidden lg:block h-full">
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">仓库管理系统</h2>
            <SidebarNav items={sidebarNavItems} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
