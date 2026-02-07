# 前端工程控制面板 (Frontend Engineering Control Panel)

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

一个用于监控和管理前端项目的现代化控制面板，支持多平台集成（Vercel、Cloudflare、GitHub）。

## ✨ 功能特性

- 📊 **服务器状态监控** - 实时显示 CPU、内存使用率和系统运行时间
- 📁 **项目管理** - 管理多个前端项目，支持手动导入
- 🔗 **平台集成** - 与 Vercel、Cloudflare、GitHub 同步项目状态
- 📝 **错误日志** - 集中查看和过滤错误日志
- 🎨 **主题切换** - 支持深色/浅色/跟随系统主题
- 🌐 **多语言** - 中文/英文界面切换
- ⚙️ **可配置设置** - 刷新间隔、通知偏好等

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装

```bash
# 安装根目录依赖
npm install

# 安装客户端和服务端依赖
cd client && npm install
cd ../server && npm install
```

### 配置

在 `server/` 目录创建 `.env` 文件：

```env
# 可选 - 平台集成 Token
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

### 开发模式

```bash
# 在项目根目录运行
npm run dev
```

- 前端: http://localhost:5173
- 后端: http://localhost:3001

### 生产构建

```bash
npm run build
npm start
```

## 📁 项目结构

```
├── client/          # React + Vite 前端
│   ├── src/
│   │   ├── components/   # UI 组件
│   │   ├── store/        # Zustand 状态管理
│   │   └── i18n/         # 国际化
│   └── ...
├── server/          # Fastify 后端
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   └── db/           # LowDB 数据库
│   └── ...
└── package.json
```

## 🛠️ 技术栈

- **前端**: React 18, TypeScript, Vite, Zustand, ECharts
- **后端**: Fastify, TypeScript, LowDB
- **样式**: CSS Variables, Glassmorphism Design

## 📄 License

MIT
