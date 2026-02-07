# 腾讯云服务器部署指南

本文档介绍如何将前端工程控制面板部署到腾讯云服务器。

## 服务器信息

- **IP**: 159.75.241.13
- **用户**: ubuntu
- **部署目录**: `/home/ubuntu/fecp`

## 部署步骤

### 1. SSH 登录服务器

```bash
ssh ubuntu@159.75.241.13
```

### 2. 创建项目目录

```bash
mkdir -p /home/ubuntu/fecp
cd /home/ubuntu/fecp
```

### 3. 克隆代码（GitHub 仓库创建后）

```bash
git clone https://github.com/0717lee/frontend-engineering-control-panel.git .
```

### 4. 安装依赖

```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 5. 构建前端

```bash
cd client
npm run build
cd ..
```

### 6. 配置环境变量

```bash
# 创建服务端环境变量
cat > server/.env << 'EOF'
# 可选 - 平台集成 Token
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
EOF
```

### 7. 使用 PM2 启动服务

```bash
# 构建服务端
cd server
npm run build

# 使用 PM2 启动
pm2 start dist/index.js --name fecp-server

# 保存 PM2 进程列表
pm2 save
pm2 startup
```

### 8. 配置 Nginx（可选，推荐）

```bash
sudo apt install nginx -y

sudo tee /etc/nginx/sites-available/fecp << 'EOF'
server {
    listen 80;
    server_name 159.75.241.13;

    # 前端静态文件
    location / {
        root /home/ubuntu/fecp/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 启用配置
sudo ln -s /etc/nginx/sites-available/fecp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. 配置防火墙

```bash
# 开放 80 端口（如果使用 Nginx）
sudo ufw allow 80/tcp

# 或者直接开放 3001 端口（不使用 Nginx）
sudo ufw allow 3001/tcp
```

## 访问应用

配置完成后，可以通过以下地址访问：

- **使用 Nginx**: http://159.75.241.13
- **直接访问后端**: http://159.75.241.13:3001

## 更新部署

```bash
cd /home/ubuntu/fecp
git pull
npm install
cd client && npm install && npm run build && cd ..
cd server && npm install && npm run build && cd ..
pm2 restart fecp-server
```

## 常用命令

```bash
# 查看日志
pm2 logs fecp-server

# 重启服务
pm2 restart fecp-server

# 停止服务
pm2 stop fecp-server

# 查看状态
pm2 status
```

## 注意事项

1. 确保腾讯云安全组已开放相应端口（80 或 3001）
2. 生产环境建议配置 HTTPS
3. 建议使用域名而非 IP 地址访问
