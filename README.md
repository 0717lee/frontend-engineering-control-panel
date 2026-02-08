# Frontend Engineering Control Panel

![Status](https://img.shields.io/badge/status-active-success) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

**English Documentation** | [中文文档](README.zh-CN.md)

> **Note**: This project is considered feature-complete for its intended engineering scope.

**An internal frontend engineering tool designed to observe and manage frontend project deployment and runtime status.**

This project serves as an engineering reference implementation for a self-hosted control panel. It integrates with Vercel, Cloudflare, and GitHub to provide a unified dashboard for frontend engineering operations and deployment visibility.

## 🌐 Public Access & Security

The online instance is publicly accessible in **read-only mode** for demonstration purposes.

-   **Read-Only**: No write operations (create, update, delete) are permitted.
-   **Data Safety**: No sensitive credentials or private production data are exposed. All displayed data is sanitized or mocked.
-   **Access Control**: The live demo represents a secure subset of the internal tool's capabilities.

## 🏗️ Architecture

The system consists of:

-   **Frontend Dashboard**: A responsive SPA built with **React 18** and **TypeScript**, utilizing **Vite** for build tooling and **Zustand** for state management.
-   **Backend Service**: A lightweight **Fastify** server providing RESTful APIs for runtime metrics and project metadata.
-   **Lightweight Persistence**: A local file-system store (**LowDB**) for non-critical engineering metadata, designed for simplicity and portability in self-hosted environments.
-   **Integrations**: Direct API connectors for Vercel, Cloudflare, and GitHub.

## 💻 Why Self-Hosted?

Although this is a frontend-focused engineering tool, certain operational requirements make a self-hosted environment more appropriate instead of serverless platforms (like Vercel):

### 1. Long-Running Processes
We need a persistent process to execute background Cron Jobs, such as:
-   Periodic polling of third-party platform APIs to sync deployment status.
-   Continuous health checks of monitored sites.
-   Real-time log aggregation and analysis.

Serverless functions are ephemeral and stateless, making them unsuitable for these stateful, long-running tasks.

### 2. File System Persistence
The project prioritizes data sovereignty and portability. Using a local file-based database requiring persistent disk access allows the entire system (code + data) to be self-contained and easily migrated.

### 3. Intranet Capabilities
As an engineering tool, future iterations may require access to internal networks, VPN-gated services, or self-hosted GitLab/Jenkins instances. A dedicated server allows for secure VPC peering and firewall configuration.

## ✨ Features

- 📊 **Server Status Monitoring** - Real-time metrics for CPU, memory, uptime, and system load.
- 📁 **Project Management** - Centralized management of multiple frontend projects.
- 🔗 **Platform Sync** - Read-only synchronization of deployment and repository metadata from Vercel, Cloudflare, and GitHub.
- 📝 **Error Aggregation** - Centralized viewing and filtering of application error logs.
- 🎨 **Adaptive UI** - Glassmorphism design with automatic Dark/Light theme switching.
- 🌐 **Internationalization** - Native support for English and Chinese.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Zustand, Lucide React, ECharts
- **Backend**: Fastify, TypeScript, LowDB, Node-Schedule
- **Styling**: CSS Variables, Glassmorphism, Responsive Grid

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Install root dependencies
npm install

# Install client and server dependencies
cd client && npm install
cd ../server && npm install
```

### Configuration

Create a `.env` file in the `server/` directory.

> **Note**: All platform tokens are optional and used only for read-only metadata access.

```env
# Optional - Platform Integration Tokens
GITHUB_TOKEN=your_token
VERCEL_TOKEN=your_token
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ACCOUNT_ID=your_id
```

### Development

```bash
# Run backend and frontend in parallel
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production Build

```bash
npm run build
npm start
```

## 📄 License

MIT
