# 部署指南 - Frontend Engineering Control Panel

## 系统要求

- Node.js 18+ 
- npm 9+
- 腾讯云服务器 (或任何 Linux 服务器)
- Nginx (用于前端静态文件托管)

## 项目结构

```
frontend-engineering-control-panel/
├── client/          # 前端 React 应用
│   ├── src/
│   ├── dist/        # 构建产物 (npm run build 后生成)
│   └── package.json
├── server/          # 后端 Node.js API
│   ├── src/
│   ├── data/        # 数据存储目录
│   └── package.json
└── package.json     # 根 Monorepo 配置
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (同时启动前后端)
npm run dev

# 访问
# 前端: http://localhost:5173
# API:  http://localhost:3001
```

## 生产构建

```bash
# 构建前端和后端
npm run build
```

## 服务器部署

### 1. 上传代码

```bash
# 通过 Git 或 SCP 上传
scp -r . user@your-server:/opt/fecp
```

### 2. 安装依赖

```bash
cd /opt/fecp
npm install --production
```

### 3. 配置 Nginx

创建 `/etc/nginx/sites-available/fecp`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /opt/fecp/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

启用站点:
```bash
ln -s /etc/nginx/sites-available/fecp /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 4. 使用 PM2 管理后端进程

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
cd /opt/fecp/server
pm2 start dist/index.js --name fecp-api

# 保存进程列表
pm2 save
pm2 startup
```

### 5. 配置防火墙

```bash
# 仅开放 80/443 端口
ufw allow 80
ufw allow 443
```

## 环境变量

创建 `server/.env`:

```
PORT=3001
NODE_ENV=production
```

## API 文档

### 系统状态

- `GET /api/health` - 健康检查
- `GET /api/system/status` - 获取 CPU、内存、运行时间

### 项目管理

- `GET /api/projects` - 获取所有项目
- `GET /api/projects/:id` - 获取单个项目
- `POST /api/projects` - 添加/更新项目
- `DELETE /api/projects/:id` - 删除项目

### 错误日志

- `GET /api/errors` - 获取错误日志 (支持 `projectId`, `level`, `limit`, `offset` 参数)
- `POST /api/errors` - 上报错误
- `DELETE /api/errors/project/:projectId` - 清除项目错误

## 安全建议

1. 使用 HTTPS (Let's Encrypt)
2. 配置基本认证或 API Key
3. 限制 API 访问 IP
4. 定期备份数据目录
