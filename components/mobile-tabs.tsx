"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ClipboardList, Boxes, PackageSearch } from "lucide-react";

const tabs = [
  {
    title: "订单",
    href: "/",
    icon: ClipboardList,
  },
  {
    title: "类别",
    href: "/categories",
    icon: Boxes,
  },
  {
    title: "库存",
    href: "/inventory",
    icon: PackageSearch,
  },
];

export function MobileTabs() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
      <nav className="flex">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 p-3 text-muted-foreground",
              pathname === tab.href && "text-primary"
            )}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs">{tab.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
} 