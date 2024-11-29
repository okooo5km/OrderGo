const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // 这里禁用了开发环境的 PWA
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 其他配置保持不变
};

module.exports = withPWA(nextConfig);
