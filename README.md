# 前端工程控制面板 (Frontend Engineering Control Panel)

![Status](https://img.shields.io/badge/status-active-success) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

**This project is an internal frontend engineering tool designed to observe and manage frontend project deployment and runtime status.**

这是一个用于监控和管理前端项目的现代化控制面板，支持多平台集成（Vercel、Cloudflare、GitHub）。

[English Documentation](#english-documentation) | [中文文档](#中文文档)

---

<a name="english-documentation"></a>
## 🇬🇧 English Documentation

### ⚠️ Important Notice

#### 🔒 Read-Only Production Environment

**The production environment is for demonstration purposes only. It does not provide write operations, and all data is desensitized mock data or public data, containing no sensitive information.**

-   **Demo Environment**: Intended for preview and demonstration purposes only.
-   **Read-Only Mode**: Write, modify, or delete operations are strictly prohibited.
-   **Security Assurance**: No sensitive credentials for real production environments are stored.

#### 💻 Why Server-Hosted? (Not Vercel/Serverless)

This project adopts a Server-Hosted deployment rather than a Serverless architecture based on the following engineering considerations:

1.  **Long-Running Process**:
    -   We need a persistent process to execute Cron Jobs, such as periodically polling third-party platform APIs, health checks, and log aggregation. The stateless and ephemeral nature of Serverless is unsuitable for such tasks.

2.  **File System Persistence**:
    -   The project uses LowDB (JSON-based) as a lightweight database, requiring read/write access to the local file system for data persistence. Serverless environments typically do not provide persistent local file systems.

3.  **Intranet Access & Monitoring**:
    -   As an internal engineering tool, future requirements may involve accessing intranet services or databases. Deploying on a dedicated server offers better network control and security isolation.

4.  **Performance & Cost**:
    -   For high-frequency polling and data aggregation, a dedicated server offers more stable performance and controllable costs for large-scale data processing.

### ✨ Features

- 📊 **Server Status Monitoring** - Real-time display of CPU, memory usage, and system uptime.
- 📁 **Project Management** - Manage multiple frontend projects with manual import support.
- 🔗 **Platform Integration** - Sync project status with Vercel, Cloudflare, and GitHub.
- 📝 **Error Logs** - Centralized view and filtering of error logs.
- 🎨 **Theme Switching** - Support for Dark/Light/System themes.
- 🌐 **Multi-language** - Switch between English and Chinese interfaces.
- ⚙️ **Configurable Settings** - Refresh interval, notification preferences, etc.

### 🚀 Quick Start

#### Prerequisites

- Node.js >= 18
- npm >= 9

#### Installation

```bash
# Install root dependencies
npm install

# Install client and server dependencies
cd client && npm install
cd ../server && npm install
```

#### Configuration

Create a `.env` file in the `server/` directory:

```env
# Optional - Platform Integration Tokens
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

#### Development Mode

```bash
# Run in the project root
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

#### Production Build

```bash
npm run build
npm start
```

### 📁 Project Structure

```
├── client/          # React + Vite Frontend
│   ├── src/
│   │   ├── components/   # UI Components
│   │   ├── store/        # Zustand State Management
│   │   └── i18n/         # Internationalization
│   └── ...
├── server/          # Fastify Backend
│   ├── src/
│   │   ├── routes/       # API Routes
│   │   └── db/           # LowDB Database
│   └── ...
└── package.json
```

### 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Zustand, ECharts
- **Backend**: Fastify, TypeScript, LowDB
- **Styling**: CSS Variables, Glassmorphism Design

---

<a name="中文文档"></a>
## 🇨🇳 中文文档

### ⚠️ 重要声明

#### 🔒 线上环境为只读展示

**线上环境仅用于展示功能，不提供写操作，且所有数据均为脱敏后的模拟数据或公开数据，不包含任何敏感信息。**

-   **展示环境**: 仅供预览和演示目的。
-   **只读模式**: 禁止任何写入、修改或删除操作。
-   **安全保障**: 不存储真实生产环境的敏感凭证。

#### 💻 为什么不使用 Vercel / Serverless?

本项目采用服务器独占部署（Server-Hosted）而非 Serverless 架构，基于以下工程考量：

1.  **长期运行环境 (Long-Running Process)**:
    -   我们需要一个持续运行的进程来执行定时任务（Cron Jobs），如定期轮询第三方平台 API、健康检查和日志聚合。Serverless 的无状态和短暂执行特性不适合此类任务。

2.  **文件系统持久化 (File System Persistence)**:
    -   项目使用 LowDB (基于 JSON 文件) 作为轻量级数据库。需要对本地文件系统进行读写操作以持久化数据。Serverless 环境通常不提供持久化的本地文件系统。

3.  **内网穿透与监控 (Intranet Access & Monitoring)**:
    -   作为内部工程工具，未来可能需要访问内网服务或数据库，部署在自有服务器上能提供更好的网络控制和安全隔离。

4.  **性能与成本 (Performance & Cost)**:
    -   对于高频的轮询和数据聚合操作，独占服务器能提供更稳定的性能，且在大规模数据处理时成本更可控。

### ✨ 功能特性

- 📊 **服务器状态监控** - 实时显示 CPU、内存使用率和系统运行时间
- 📁 **项目管理** - 管理多个前端项目，支持手动导入
- 🔗 **平台集成** - 与 Vercel、Cloudflare、GitHub 同步项目状态
- 📝 **错误日志** - 集中查看和过滤错误日志
- 🎨 **主题切换** - 支持深色/浅色/跟随系统主题
- 🌐 **多语言** - 中文/英文界面切换
- ⚙️ **可配置设置** - 刷新间隔、通知偏好等

### 🚀 快速开始

#### 环境要求

- Node.js >= 18
- npm >= 9

#### 安装

```bash
# 安装根目录依赖
npm install

# 安装客户端和服务端依赖
cd client && npm install
cd ../server && npm install
```

#### 配置

在 `server/` 目录创建 `.env` 文件：

```env
# 可选 - 平台集成 Token
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

#### 开发模式

```bash
# 在项目根目录运行
npm run dev
```

- 前端: http://localhost:5173
- 后端: http://localhost:3001

#### 生产构建

```bash
npm run build
npm start
```

### 📁 项目结构

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

### 🛠️ 技术栈

- **前端**: React 18, TypeScript, Vite, Zustand, ECharts
- **后端**: Fastify, TypeScript, LowDB
- **样式**: CSS Variables, Glassmorphism Design

## 📄 License

MIT
