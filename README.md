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

2. 在 Vercel 控制台配置以下环境变量:
   - `DB_HOST`: PostgreSQL 数据库主机地址
   - `DB_PORT`: PostgreSQL 数据库端口
   - `DB_NAME`: PostgreSQL 数据库名称
   - `DB_USER`: PostgreSQL 数据库用户名
   - `DB_PASSWORD`: PostgreSQL 数据库密码

3. 部署完成后，Vercel 会自动运行数据库迁移脚本
