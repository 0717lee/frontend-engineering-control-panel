# Frontend Engineering Control Panel

![Status](https://img.shields.io/badge/status-active-success) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

**English Documentation** | [中文文档](README.zh-CN.md)

**This project is an internal frontend engineering tool designed to observe and manage frontend project deployment and runtime status.**

It is a modern dashboard for monitoring and managing frontend projects, supporting multi-platform integrations (Vercel, Cloudflare, GitHub).

## ⚠️ Important Notice

### 🔒 Read-Only Production Environment

**The production environment is for demonstration purposes only. It does not provide write operations, and all data is desensitized mock data or public data, containing no sensitive information.**

-   **Demo Environment**: Intended for preview and demonstration purposes only.
-   **Read-Only Mode**: Write, modify, or delete operations are strictly prohibited.
-   **Security Assurance**: No sensitive credentials for real production environments are stored.

### 💻 Why Server-Hosted? (Not Vercel/Serverless)

This project adopts a Server-Hosted deployment rather than a Serverless architecture based on the following engineering considerations:

1.  **Long-Running Process**:
    -   We need a persistent process to execute Cron Jobs, such as periodically polling third-party platform APIs, health checks, and log aggregation. The stateless and ephemeral nature of Serverless is unsuitable for such tasks.

2.  **File System Persistence**:
    -   The project uses LowDB (JSON-based) as a lightweight database, requiring read/write access to the local file system for data persistence. Serverless environments typically do not provide persistent local file systems.

3.  **Intranet Access & Monitoring**:
    -   As an internal engineering tool, future requirements may involve accessing intranet services or databases. Deploying on a dedicated server offers better network control and security isolation.

4.  **Performance & Cost**:
    -   For high-frequency polling and data aggregation, a dedicated server offers more stable performance and controllable costs for large-scale data processing.

## ✨ Features

- 📊 **Server Status Monitoring** - Real-time display of CPU, memory usage, and system uptime.
- 📁 **Project Management** - Manage multiple frontend projects with manual import support.
- 🔗 **Platform Integration** - Sync project status with Vercel, Cloudflare, and GitHub.
- 📝 **Error Logs** - Centralized view and filtering of error logs.
- 🎨 **Theme Switching** - Support for Dark/Light/System themes.
- 🌐 **Multi-language** - Switch between English and Chinese interfaces.
- ⚙️ **Configurable Settings** - Refresh interval, notification preferences, etc.

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

Create a `.env` file in the `server/` directory:

```env
# Optional - Platform Integration Tokens
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

### Development Mode

```bash
# Run in the project root
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

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
│   │   ├── db/           # LowDB Database
│   │   └── ...
│   └── ...
└── package.json
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Zustand, ECharts
- **Backend**: Fastify, TypeScript, LowDB
- **Styling**: CSS Variables, Glassmorphism Design

## 📄 License

MIT
