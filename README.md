# 仓库进出库管理系统

一个基于 Next.js 14 开发的家电类产品库存和订单管理系统，支持响应式布局，同时适配桌面端和移动端。

## 功能特点

- 📱 响应式设计，支持桌面端和移动端
- 📦 库存管理：支持入库、出库操作，库存变动记录追踪
- 📋 订单管理：支持订单创建、编辑、删除，一键复制订单信息
- 📁 类别管理：支持家电类别的添加、编辑、删除
- 💾 数据导入导出：支持通过 CSV 文件导入导出系统数据
- 🌓 深色模式支持

## 部署指南

### Vercel 一键部署

1. 点击下方按钮一键部署到 Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fokooo5km%2FOrderGo)

2. 在 Vercel 控制台配置环境变量:
   - `DATABASE_URL`: PostgreSQL 数据库连接 URL，格式如下:

     ```
     postgresql://user:password@host:port/dbname?sslmode=require
     ```

3. 部署完成后，Vercel 会自动运行数据库迁移脚本

### 本地开发

1. 克隆项目并安装依赖:

   ```bash
   git clone https://github.com/okooo5km/OrderGo.git
   cd OrderGo
   pnpm install
   ```

2. 复制环境变量配置文件:

   ```bash
   cp .env.example .env
   ```

3. 修改 `.env` 文件中的数据库连接信息

4. 初始化数据库:

   ```bash
   pnpm run db:setup
   ```

5. 启动开发服务器:

   ```bash
   pnpm dev
   ```

5. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

## 技术栈

- [Next.js 14](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [PostgreSQL](https://www.postgresql.org/) - 数据库
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Vercel](https://vercel.com/) - 部署平台

## 许可证

本项目采用 [MIT](LICENSE) 许可证。
