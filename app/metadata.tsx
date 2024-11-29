import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "仓库进出库管理系统",
  description: "家电类产品库存和订单管理系统",
  manifest: "/manifest.json",
  themeColor: "#121212",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "仓库管理",
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      }
    ],
    apple: [
      {
        url: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}; 