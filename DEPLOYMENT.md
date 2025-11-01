# 部署说明

## 环境要求
- Node.js 18+
- MySQL 8.0+
- 端口：前端 3000 / 后端 4000

## 数据库
```sql
CREATE DATABASE app_roi DEFAULT CHARACTER SET utf8mb4;
```

## 后端部署
```bash
cd backend
cp .env.example .env
# 配置 DATABASE_URL，例如：mysql://user:pass@host:3306/app_roi
npm ci
npm run prisma:generate
npm run prisma:deploy
npm run build
npm start
```

## 前端部署
```bash
cd frontend
echo 'NEXT_PUBLIC_BACKEND=https://your-backend.example.com' > .env.local
npm ci
npm run build
npm start
```